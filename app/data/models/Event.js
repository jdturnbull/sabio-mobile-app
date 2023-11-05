import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';

  static associations = {
    users: { type: 'belongs_to', key: 'eventId' },
  };

  @field('eventId') eventId;
  @field('type') type;
  @field('name') name;
  @field('location') location;
  @field('date') date;
  @field('created') created;
  @field('updated') updated;
}
