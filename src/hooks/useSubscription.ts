import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { stripeProducts } from '../stripe-config';

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching subscription:', fetchError);
          setError('Failed to fetch subscription data');
          return;
        }

        setSubscription(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const getProductName = () => {
    if (!subscription?.price_id) return null;
    
    const product = stripeProducts.find(p => p.priceId === subscription.price_id);
    return product?.name || null;
  };

  const isActive = () => {
    return subscription?.subscription_status === 'active';
  };

  const isPending = () => {
    return subscription?.subscription_status === 'incomplete' || 
           subscription?.subscription_status === 'not_started';
  };

  return {
    subscription,
    loading,
    error,
    getProductName,
    isActive,
    isPending,
    refetch: () => {
      if (user) {
        setLoading(true);
        // Re-trigger the effect
        setSubscription(null);
      }
    }
  };
};