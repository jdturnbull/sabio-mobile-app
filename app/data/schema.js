import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'userId', type: 'string' },
        { name: 'username', type: 'string', isOptional: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'name', type: 'string', isOptional: true },
        { name: 'timezone', type: 'string' },
        { name: 'eventId', type: 'string', isOptional: true, isIndexed: true },
        { name: 'subscriptionPlanId', type: 'string', isOptional: true },
        { name: 'vip', type: 'boolean' },
        { name: 'onboardingComplete', type: 'boolean', isOptional: true },
        { name: 'subscriptionExpiration', type: 'number', isOptional: true },
        { name: 'subscriptionStatus', type: 'string', isOptional: true },
        { name: 'stripeSubscription', type: 'string', isOptional: true },
        { name: 'stripePaymentMethod', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'subscription_plans',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'stripePriceId', type: 'string' },
        { name: 'active', type: 'boolean' },
        { name: 'created', type: 'number', isOptional: true },
        { name: 'updated', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'messageId', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'payload', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'timestamp', type: 'number' },
        { name: 'created', type: 'number', isOptional: true },
        { name: 'updated', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'cards',
      columns: [
        { name: 'cardId', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string' },
        { name: 'message', type: 'string', isOptional: true },
        { name: 'data', type: 'string', isOptional: true },
        { name: 'completed', type: 'boolean' },
        { name: 'analysis', type: 'string', isOptional: true },
        { name: 'created', type: 'number', isOptional: true },
        { name: 'updated', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [
        { name: 'eventId', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'created', type: 'number', isOptional: true },
        { name: 'updated', type: 'number', isOptional: true },
      ],
    }),
  ],
});
