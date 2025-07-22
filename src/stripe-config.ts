export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1QQqL8AnuKZ0z0h6VrXXXXXX', // Replace with your actual Stripe price ID
    name: 'Mindweave Premium',
    description: 'Includes: Unlimited secure cloud sync, Rich text editing & media attachments, All insights & analytics features, All customization options, All export options, Access to premium prompts/guided sessions, Priority customer support.',
    mode: 'subscription'
  }
];