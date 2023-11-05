import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class Message extends Model {
  static table = 'messages';

  static associations = {
    user: { type: 'belongs_to', key: 'user_id' },
  };

  @text('message_id') messageId;
  @text('type') type;
  @text('payload') payload;
  @text('status') status;
  @field('timestamp') timestamp;
  @field('created_at') createdAt;
  @field('updated_at') updatedAt;
}
