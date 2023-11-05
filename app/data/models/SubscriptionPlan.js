import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class SubscriptionPlan extends Model {
  static table = 'subscription_plans';

  static associations = {
    users: { type: 'belongs_to', key: 'subscriptionPlanId' },
  };

  @field('price') price;
  @field('stripePriceId') stripePriceId;
  @field('active') active;
  @field('created') created;
  @field('updated') updated;
}
