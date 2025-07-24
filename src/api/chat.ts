import brain from '@/brain/Brain';

/**
 * Send a chat message directly to OpenAI using the configured brain prompts.
 * Returns the assistant's reply wrapped in an object with a `message` field.
 */
import type { ChatContext } from '@/types/chat';

export const sendChatMessage = async (message: string, context?: ChatContext) => {
  if (import.meta.env.DEV) console.log('sendChatMessage - Called with message:', message);
  if (import.meta.env.DEV) console.log('sendChatMessage - Context:', context);

  // Apply configured filters to the outgoing message
  const filteredMessage = brain.filters.reduce((msg, filter) => filter(msg), message);
  if (import.meta.env.DEV) console.log('sendChatMessage - Using brain configuration:', brain);

  try {
    if (import.meta.env.DEV) console.log('sendChatMessage - Preparing OpenAI request');

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const systemMessages = [
      { role: 'system', content: brain.cognition.systemPrompt }
    ];

    if (brain.behavior.style) {
      systemMessages.push({ role: 'system', content: `Communication style: ${brain.behavior.style}` });
    }

    if (brain.cognition.contextPrompt) {
      systemMessages.push({ role: 'system', content: brain.cognition.contextPrompt });
    }

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        ...systemMessages,
        { role: 'user', content: filteredMessage }
      ]
    };

    if (import.meta.env.DEV) console.log('sendChatMessage - Making request to OpenAI');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (import.meta.env.DEV) console.log('sendChatMessage - OpenAI response:', JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content?.trim() ?? '';
    return { message: reply };
  } catch (error: any) {
    console.error('sendChatMessage - API error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};
