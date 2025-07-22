const OpenAI = require('openai');

class LLMService {
  constructor() {
    console.log('[LLMService] Initializing LLM Service...');
    console.log('[LLMService] OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('[LLMService] OpenAI API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    console.log('[LLMService] OpenAI API Key first 20 chars:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + '...' : 'null');

    // Initialize OpenAI only
    if (process.env.OPENAI_API_KEY) {
      console.log('[LLMService] OpenAI API key found, initializing OpenAI client');
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.error('[LLMService] OpenAI API key not found. Chat functionality will not work.');
      throw new Error('OpenAI API key is required for chat functionality');
    }
  }

  async getChatResponse(message, context = null, user = null) {
    console.log('[LLMService] getChatResponse called with message:', message);
    console.log('[LLMService] Context:', context);
    console.log('[LLMService] User:', user ? user.email : 'No user');

    if (!this.openai) {
      console.error('[LLMService] OpenAI client not initialized');
      throw new Error('OpenAI service not available');
    }

    try {
      console.log('[LLMService] Getting response from OpenAI GPT-4o-mini...');
      const result = await this.getOpenAIResponse(message, context, user);
      console.log('[LLMService] Final result being returned:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('[LLMService] Error getting AI response:', error.message);
      console.error('[LLMService] Error details:', error);
      throw error;
    }
  }

  async getOpenAIResponse(message, context, user) {
    console.log('[LLMService] Getting OpenAI response...');

    const systemPrompt = this.buildSystemPrompt(user);
    const userPrompt = this.buildUserPrompt(message, context);

    console.log('[LLMService] System prompt:', systemPrompt);
    console.log('[LLMService] User prompt:', userPrompt);

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Using GPT-4o-mini for chat as requested
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      console.log('[LLMService] OpenAI response:', response);

      if (!response) {
        throw new Error('No response received from OpenAI');
      }

      const result = {
        text: response,
        context: context
      };
      
      console.log('[LLMService] Formatted result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('[LLMService] OpenAI API error:', error);

      // If GPT-4o-mini fails, try fallback to GPT-3.5-turbo
      console.log('[LLMService] Trying fallback to GPT-3.5-turbo...');
      try {
        const fallbackCompletion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        const fallbackResponse = fallbackCompletion.choices[0]?.message?.content;
        console.log('[LLMService] Fallback OpenAI response:', fallbackResponse);

        if (!fallbackResponse) {
          throw new Error('No response received from OpenAI fallback');
        }

        const fallbackResult = {
          text: fallbackResponse,
          context: context
        };
        
        console.log('[LLMService] Fallback formatted result:', JSON.stringify(fallbackResult, null, 2));
        return fallbackResult;
      } catch (fallbackError) {
        console.error('[LLMService] Fallback also failed:', fallbackError);
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  }

  buildSystemPrompt(user) {
    const userName = user?.name || 'Commander';
    const userLevel = user?.level || 1;
    const userXP = user?.xp || 0;
    const userSkills = user?.unlockedSkills || [];

    return `You are Aura, an AI companion for LifePilot, a personal development and goal-tracking application.

User Information:
- Name: ${userName}
- Level: ${userLevel}
- XP: ${userXP}
- Unlocked Skills: ${userSkills.length > 0 ? userSkills.join(', ') : 'None yet'}

Your role is to:
1. Help users set and achieve personal goals
2. Provide motivation and encouragement
3. Suggest actionable steps for improvement
4. Track progress and celebrate achievements
5. Offer insights for personal growth

Keep responses conversational, supportive, and focused on actionable advice. Be encouraging but realistic. Always relate back to their personal development journey. Respond in a friendly, helpful tone and keep responses concise but meaningful.`;
  }

  buildUserPrompt(message, context) {
    let prompt = `User message: "${message}"`;

    if (context) {
      prompt += `\n\nContext: ${JSON.stringify(context)}`;
    }

    return prompt;
  }

  async processOnboarding(responses, user) {
    console.log('[LLMService] Processing onboarding responses:', responses);

    if (!this.openai) {
      throw new Error('OpenAI service not available');
    }

    try {
      const prompt = `Based on these onboarding responses, create a personalized development plan:

${responses.map((response, index) => `${index + 1}. ${response}`).join('\n')}

Please provide a comprehensive analysis and create:
1. A personalized development plan
2. 3-5 key milestones with specific deadlines
3. Actionable insights and recommendations

Format the response as valid JSON with keys: plan, milestones, insights`;

      console.log('[LLMService] Using GPT-4-turbo for complex onboarding analysis...');

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo", // Using GPT-4-turbo for complex analysis as requested
        messages: [
          {
            role: "system",
            content: "You are a professional personal development coach creating detailed, customized development plans. Analyze the user's responses thoroughly and provide actionable, specific guidance."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      console.log('[LLMService] Onboarding response:', response);

      if (!response) {
        throw new Error('No response received from OpenAI for onboarding');
      }

      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        console.log('[LLMService] Response is not valid JSON, wrapping in structure:', parseError);
        return {
          plan: response,
          milestones: [
            "Define clear objectives",
            "Establish daily habits",
            "Track progress weekly",
            "Review and adjust monthly",
            "Celebrate achievements"
          ],
          insights: [
            "Consistency is key to achieving your goals",
            "Small daily actions lead to big results",
            "Regular reflection helps maintain focus"
          ]
        };
      }

    } catch (error) {
      console.error('[LLMService] Error processing onboarding:', error);

      // Try fallback with GPT-3.5-turbo if GPT-4-turbo fails
      console.log('[LLMService] Trying onboarding fallback to GPT-3.5-turbo...');
      try {
        const fallbackCompletion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a personal development coach creating customized plans."
            },
            { role: "user", content: `Create a development plan based on: ${responses.join(', ')}` }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });

        const fallbackResponse = fallbackCompletion.choices[0]?.message?.content;

        return {
          plan: fallbackResponse || "Based on your responses, I've created a personalized development plan focused on your goals and aspirations.",
          milestones: [
            "Define clear objectives",
            "Establish daily habits",
            "Track progress weekly",
            "Review and adjust monthly",
            "Celebrate achievements"
          ],
          insights: [
            "Consistency is key to achieving your goals",
            "Small daily actions lead to big results",
            "Regular reflection helps maintain focus"
          ]
        };
      } catch (fallbackError) {
        console.error('[LLMService] Fallback onboarding also failed:', fallbackError);
        throw error;
      }
    }
  }
}

// Create singleton instance
const llmService = new LLMService();

module.exports = llmService;