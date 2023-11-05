import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators';

export default class Card extends Model {
  static table = 'cards';

  static associations = {
    users: { type: 'belongs_to', key: 'userId' },
  };

  @field('cardId') cardId;
  @field('type') type;
  @field('title') title;
  @field('subtitle') subtitle;
  @field('message') message;
  @json('data') data;
  @field('completed') completed;
  @json('analysis') analysis;
  @field('created') created;
  @field('updated') updated;
}
