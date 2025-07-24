import api from './api';
import { Subscription, UsageStats } from '@/types/subscription';

// Description: Get current user subscription
// Endpoint: GET /subscription
// Request: {}
// Response: { subscription: Subscription | null, usage: UsageStats }
export const getSubscription = async () => {
  try {
    const response = await api.get('/subscription');
    return response.data as { subscription: Subscription | null; usage: UsageStats };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Create Stripe checkout session
// Endpoint: POST /subscription/checkout
// Request: { priceId: string, billingCycle: 'monthly' | 'yearly' }
// Response: { sessionId: string, url: string }
export const createCheckoutSession = async (priceId: string, billingCycle: 'monthly' | 'yearly') => {
  try {
    const response = await api.post('/subscription/checkout', { priceId, billingCycle });
    return response.data as { sessionId: string; url: string };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Cancel subscription
// Endpoint: POST /subscription/cancel
// Request: { cancelAtPeriodEnd: boolean }
// Response: { success: boolean, subscription: Subscription }
export const cancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
  try {
    const response = await api.post('/subscription/cancel', { cancelAtPeriodEnd });
    return response.data as { success: boolean; subscription: Subscription };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update subscription plan
// Endpoint: POST /subscription/update
// Request: { priceId: string, billingCycle: 'monthly' | 'yearly' }
// Response: { success: boolean, subscription: Subscription }
export const updateSubscription = async (priceId: string, billingCycle: 'monthly' | 'yearly') => {
  try {
    const response = await api.post('/subscription/update', { priceId, billingCycle });
    return response.data as { success: boolean; subscription: Subscription };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};