import { useCallback } from 'react';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
interface PaymentIntentResponse {
  client_secret: string;
  amount: number;
  currency: string;
  title: string;
  plan_id: string;
  payment_intent_id: string;
  checkout_id: string;
}
export const usePaymentIntent = () => {
  const createPaymentIntent = useCallback(
    async (planId: string) => {
      const response = await api.post<PaymentIntentResponse>(
        '/checkouts/storeIntent',
        serializeJsonToFormData({ plan_id: planId })
      );
      return response.data;
    },
    []
  );
  return {
    createPaymentIntent,
  };
};