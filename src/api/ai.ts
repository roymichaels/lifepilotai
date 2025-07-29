// Description: Process onboarding responses with AI to create enhanced life plan or project plan
// Returns: { success: boolean, plan: any, message: string, usedFallback?: boolean }
import { TraitService } from '@/services/TraitService'
import { getRuntimeConfig } from '@/lib/runtimeConfig'

export const processOnboardingWithAI = async (responses: Record<string, any>, planType: 'life' | 'project') => {
  if (import.meta.env.DEV)
    console.log('AI API: Processing onboarding with AI', { planType, responseKeys: Object.keys(responses) });

  const { openaiApiKey: apiKey } = getRuntimeConfig();
  if (!apiKey) {
    console.warn('AI API: Missing OpenAI API key');
    return { success: false, plan: null, message: 'Missing OpenAI API key', usedFallback: true };
  }

  const prompt = `Using the following onboarding answers, create a structured ${planType} plan in JSON format.\n\n${JSON.stringify(responses)}`;

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are Aura, an AI assistant that generates concise and actionable plans.' },
      { role: 'user', content: prompt }
    ]
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `OpenAI chat request failed (${res.status}): ${errorText}`
      );
    }

    const data = await res.json();
    if (import.meta.env.DEV)
      console.log('AI API: OpenAI response:', JSON.stringify(data, null, 2));
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    let plan: any = null;
    try {
      plan = JSON.parse(content);
    } catch (parseError) {
      console.error('AI API: Failed to parse plan JSON', parseError);
    }

    if (plan) {
      try {
        const allText = Object.values(responses).map(r => String(r)).join(' ')
        await TraitService.addFromInput(allText, 'onboarding')
      } catch (err) {
        if (import.meta.env.DEV) console.warn('Trait extraction failed', err)
      }

      return { success: true, plan, message: 'AI-enhanced plan created' };
    }

    return { success: false, plan: null, message: 'Invalid AI response', usedFallback: true };
  } catch (error: any) {
    console.error('AI API: Error calling OpenAI:', error);
    return { success: false, plan: null, message: error.message || 'Network error', usedFallback: true };
  }
};
