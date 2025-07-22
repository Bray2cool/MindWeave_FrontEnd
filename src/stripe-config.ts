export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'prod_Sh79Kx2N8uoA7x', // This will be replaced with your actual price ID
    name: 'Mindweave Premium',
    description: 'Includes: Unlimited secure cloud sync, Rich text editing & media attachments, All insights & analytics features, All customization options, All export options, Access to premium prompts/guided sessions, Priority customer support.',
    mode: 'subscription'
  }
];