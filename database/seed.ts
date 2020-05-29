import { hash } from 'https://deno.land/x/bcrypt/mod.ts';

import { ACCOUNT_TYPES, ADMIN } from '../config/index.ts';
import database, {
  collections,
  NewRecord,
  User,
} from './index.ts';
import log from '../utilities/log.ts';

/**
 * Seed the Admin data
 * @returns {Promise<void>}
 */
(async function seed() {
  try {
    // check if Admin exists
    const User = database.collection(collections.User);
    const existingRecord: User = await User.findOne({ email: ADMIN.email });
    if (existingRecord) {
      log('-- seeding: not required');
      return Deno.exit(0);
    }

    // create the Admin record
    const now = Date.now();
    const [admin, hashed]: [NewRecord, string] = await Promise.all([
      User.insertOne({
        accountType: ACCOUNT_TYPES.admin,
        created: `${now}`,
        email: ADMIN.email,
        entity: collections.User,
        firstName: ADMIN.firstName,
        lastName: ADMIN.lastName,
        updated: `${now}`,
      }),
      hash(ADMIN.password),
    ]);

    // create the Password record
    const Password = database.collection(collections.Password);
    await Password.insertOne({
      created: `${now}`,
      entity: collections.Password,
      hash: hashed,
      updated: `${now}`,
      userId: admin['$oid'],
    });
    
    log('-- seeding: done');
    return Deno.exit(0);
  } catch (error) {
    throw new Error(error);
  }
})();
