import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import migrations from './migrations';

import Card from './models/Card';
import Event from './models/Event';
import Message from './models/Message';
import SubscriptionPlan from './models/SubscriptionPlan';
import User from './models/User';

let database;
export const useDatabase = () => database;

export const createDatabase = () => {
  const adapter = new SQLiteAdapter({
    schema,
    dbName: 'sabio',
    synchronous: true,
    migrations,
    onSetUpError: (error) => {
      // Database failed to load -- offer the user to reload the app or log out
    },
  });

  database = new Database({
    adapter,
    modelClasses: [Card, Event, Message, SubscriptionPlan, User],
    actionsEnabled: true,
  });

  return database;
};
