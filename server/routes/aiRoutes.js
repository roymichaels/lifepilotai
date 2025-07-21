const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const LLMService = require('../services/llmService.js');

const router = express.Router();

// POST /api/ai/chat - Send a chat message to AI
router.post('/chat', requireUser, async (req, res) => {
  try {
    console.log('[AI Routes] Chat request received from user:', req.user.id);
    console.log('[AI Routes] Request body:', JSON.stringify(req.body, null, 2));

    const { message, context } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('[AI Routes] Invalid message provided:', message);
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a non-empty string'
      });
    }

    console.log('[AI Routes] Processing chat message:', message);

    // Call LLM service to get AI response
    const aiResponse = await LLMService.getChatResponse(message, context, req.user);
    console.log('[AI Routes] AI response received:', aiResponse);

    const responseText = aiResponse.text || aiResponse.response || aiResponse;
    
    if (!responseText) {
      console.error('[AI Routes] No valid response text received from LLM service');
      return res.status(500).json({
        success: false,
        message: 'No response generated from AI service'
      });
    }

    return res.status(200).json({
      success: true,
      response: responseText,
      context: aiResponse.context || context
    });

  } catch (error) {
    console.error('[AI Routes] Error processing chat message:', error.message);
    console.error('[AI Routes] Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message
    });
  }
});

// POST /api/ai/onboarding - Process onboarding responses
router.post('/onboarding', requireUser, async (req, res) => {
  try {
    console.log('[AI Routes] Onboarding request received from user:', req.user.id);
    console.log('[AI Routes] Request body:', JSON.stringify(req.body, null, 2));

    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.log('[AI Routes] Invalid responses provided:', responses);
      return res.status(400).json({
        success: false,
        message: 'Responses array is required and must not be empty'
      });
    }

    console.log('[AI Routes] Processing onboarding responses:', responses);

    // Call LLM service to process onboarding
    const result = await LLMService.processOnboarding(responses, req.user);
    console.log('[AI Routes] Onboarding processing result:', result);

    return res.status(200).json({
      success: true,
      plan: result.plan || result,
      milestones: result.milestones || [],
      insights: result.insights || []
    });

  } catch (error) {
    console.error('[AI Routes] Error processing onboarding:', error.message);
    console.error('[AI Routes] Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process onboarding responses',
      error: error.message
    });
  }
});

module.exports = router;