import React, { useState } from 'react';
import { Check, Crown, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { stripeProducts } from '../stripe-config';
import { supabase } from '../lib/supabase';

const Pricing: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { subscription, isActive } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) return;

    setLoading(priceId);

    try {
      console.log('Starting checkout process...', { priceId, mode, user: user.id });
      
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error('No access token available. Please sign in again.');
      }

      console.log('Making request to:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        }),
      });

      console.log('Response status:', response.status);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}: Failed to create checkout session`);
      }

      if (responseData.url) {
        console.log('Redirecting to Stripe checkout:', responseData.url);
        window.location.href = responseData.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Failed to start checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const bgClass = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = isDarkMode 
    ? 'bg-white/10 backdrop-blur-sm border-white/10' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';
  
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDarkMode ? 'text-white/70' : 'text-gray-600';

  const features = [
    'Unlimited secure cloud sync',
    'Rich text editing & media attachments',
    'All insights & analytics features',
    'All customization options',
    'All export options',
    'Access to premium prompts/guided sessions',
    'Priority customer support'
  ];

  const isCurrentPlan = (priceId: string) => {
    return subscription?.price_id === priceId && isActive();
  };

  return (
    <div className={`p-8 min-h-screen ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className={`${textSecondaryClass} text-lg`}>
            Unlock the full potential of your journaling experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className={`${cardClass} rounded-2xl p-8 border relative`}>
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold ${textClass} mb-2`}>Free Plan</h3>
              <div className={`text-4xl font-bold ${textClass} mb-2`}>$0</div>
              <p className={textSecondaryClass}>Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className={`flex items-center ${textSecondaryClass}`}>
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                Basic journaling features
              </li>
              <li className={`flex items-center ${textSecondaryClass}`}>
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                Local storage
              </li>
              <li className={`flex items-center ${textSecondaryClass}`}>
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                Basic mood tracking
              </li>
            </ul>

            <button
              disabled
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plans */}
          {stripeProducts.map((product) => (
            <div key={product.priceId} className={`${cardClass} rounded-2xl p-8 border relative ${product.mode === 'subscription' ? 'ring-2 ring-purple-500' : ''}`}>
              {product.mode === 'subscription' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Most Popular
                </div>
                </div>
              )}
              
              {product.mode === 'payment' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Best Value
                  </div>
                </div>
              )}

              <div className="text-center mb-6 mt-4">
                <h3 className={`text-2xl font-bold ${textClass} mb-2`}>{product.name}</h3>
                <div className={`text-4xl font-bold ${textClass} mb-2`}>
                  {product.mode === 'subscription' ? (
                    <>
                      $6.99
                      <span className={`text-lg font-normal ${textSecondaryClass}`}>/month</span>
                    </>
                  ) : (
                    <>
                      $149.99
                      <span className={`text-lg font-normal ${textSecondaryClass}`}> once</span>
                    </>
                  )}
                </div>
                <p className={textSecondaryClass}>
                  {product.mode === 'subscription' 
                    ? 'Everything you need for advanced journaling' 
                    : 'Lifetime access to all premium features'
                  }
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className={`flex items-start ${textSecondaryClass}`}>
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {product.mode === 'payment' && (
                  <>
                    <li className={`flex items-start ${textSecondaryClass}`}>
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      Lifetime updates included
                    </li>
                    <li className={`flex items-start ${textSecondaryClass}`}>
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      No recurring payments
                    </li>
                  </>
                )}
              </ul>

              <button
                onClick={() => handleCheckout(product.priceId, product.mode)}
                disabled={loading === product.priceId || isCurrentPlan(product.priceId)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  isCurrentPlan(product.priceId)
                    ? isDarkMode 
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 cursor-not-allowed'
                    : loading === product.priceId
                    ? 'bg-purple-600/50 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:scale-105'
                }`}
              >
                {loading === product.priceId ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </div>
                ) : isCurrentPlan(product.priceId) ? (
                  'Current Plan'
                ) : (
                  product.mode === 'subscription' ? 'Upgrade Now' : 'Buy Lifetime'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className={`${cardClass} rounded-2xl p-6 border mt-8`}>
          <div className="text-center">
            <h3 className={`text-xl font-bold ${textClass} mb-2`}>30-Day Money-Back Guarantee</h3>
            <p className={textSecondaryClass}>
              Try Mindweave Premium risk-free. If you're not completely satisfied, we'll refund your money within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;