import { Model } from '@nozbe/watermelondb';
import { writer, text, json, field } from '@nozbe/watermelondb/decorators';
import moment from 'moment';

export default class User extends Model {
  static table = 'users';

  static associations = {
    messages: { type: 'has_many', foreignKey: 'user_id' },
    cards: { type: 'has_many', foreignKey: 'user_id' },
  };

  @text('user_id') userId;
  @text('username') username;
  @text('email') email;
  @text('name') name;
  @text('timezone') timezone;
  @text('event_id') eventId;
  @text('subscription_plan_id') subscriptionPlanId;
  @field('vip') vip;
  @field('onboarding_complete') onboardingComplete;
  @field('subscription_expiration') subscriptionExpiration;
  @text('subscription_status') subscriptionStatus;
  @json('stripe_subscription') stripeSubscription;
  @json('stripe_payment_method') stripePaymentMethod;
  @field('created_at') createdAt;
  @field('updated_at') updatedAt;

  @writer async setName(name) {
    await this.update((user) => {
      user.name = name;
      user.updatedAt = moment.utc().valueOf();
    });
  }

  @writer async completeOnboarding(bool) {
    await this.update((user) => {
      user.onboardingComplete = bool;
      user.updatedAt = moment.utc().valueOf();
    });
  }
}
