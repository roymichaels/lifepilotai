import api from './api';
import { Subscription, UsageStats } from '@/types/subscription';

// Description: Get current user subscription
// Endpoint: GET /api/subscription
// Request: {}
// Response: { subscription: Subscription | null, usage: UsageStats }
export const getSubscription = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subscription: {
          id: 'sub_1',
          userId: 'user_1',
          planId: 'freemium',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          stripeCustomerId: 'cus_test',
          stripeSubscriptionId: 'sub_test',
          billingCycle: 'monthly'
        },
        usage: {
          aiMessagesUsed: 150,
          widgetsActive: 2,
          teamSeatsUsed: 1
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/subscription');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create Stripe checkout session
// Endpoint: POST /api/subscription/checkout
// Request: { priceId: string, billingCycle: 'monthly' | 'yearly' }
// Response: { sessionId: string, url: string }
export const createCheckoutSession = async (priceId: string, billingCycle: 'monthly' | 'yearly') => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId: 'cs_test_session',
        url: 'https://checkout.stripe.com/pay/cs_test_session'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/subscription/checkout', { priceId, billingCycle });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Cancel subscription
// Endpoint: POST /api/subscription/cancel
// Request: { cancelAtPeriodEnd: boolean }
// Response: { success: boolean, subscription: Subscription }
export const cancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        subscription: {
          id: 'sub_1',
          userId: 'user_1',
          planId: 'freemium',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: true,
          stripeCustomerId: 'cus_test',
          stripeSubscriptionId: 'sub_test',
          billingCycle: 'monthly'
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/subscription/cancel', { cancelAtPeriodEnd });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update subscription plan
// Endpoint: POST /api/subscription/update
// Request: { priceId: string, billingCycle: 'monthly' | 'yearly' }
// Response: { success: boolean, subscription: Subscription }
export const updateSubscription = async (priceId: string, billingCycle: 'monthly' | 'yearly') => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        subscription: {
          id: 'sub_1',
          userId: 'user_1',
          planId: 'personal',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          stripeCustomerId: 'cus_test',
          stripeSubscriptionId: 'sub_test',
          billingCycle
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/subscription/update', { priceId, billingCycle });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};