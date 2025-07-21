import api from './api';

// Description: Process onboarding responses with AI to create enhanced life plan or project plan
// Endpoint: POST /api/ai/process-onboarding
// Request: { responses: Record<string, any>, planType: 'life' | 'project' }
// Response: { success: boolean, plan: any, message: string, usedFallback?: boolean }
export const processOnboardingWithAI = async (responses: Record<string, any>, planType: 'life' | 'project') => {
  try {
    console.log('AI API: Processing onboarding with AI', { planType, responseKeys: Object.keys(responses) });
    const response = await api.post('/api/ai/process-onboarding', {
      responses,
      planType
    });
    console.log('AI API: Received AI-enhanced plan', response.data);
    return response.data;
  } catch (error: any) {
    console.error('AI API: Error processing onboarding:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};