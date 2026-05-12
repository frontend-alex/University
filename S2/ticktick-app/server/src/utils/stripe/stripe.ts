import Stripe from 'stripe';
import { config } from '../../config/config';

export const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});