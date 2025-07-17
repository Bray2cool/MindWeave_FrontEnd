export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RliuvAnuKZ0z0h6kEJd6Jn2',
    name: 'Mindweave Premium',
    description: 'Includes: Unlimited secure cloud sync, Rich text editing & media attachments, All insights & analytics features, All customization options, All export options, Access to premium prompts/guided sessions, Priority customer support.',
    mode: 'subscription'
  }
];