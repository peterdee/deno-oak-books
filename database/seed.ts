import { hash } from 'https://deno.land/x/bcrypt/mod.ts';

import { ACCOUNT_TYPES, ADMIN } from '../config/index.ts';
import database, {
  collections,
  generateId,
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
    const userId = generateId();
    const [hashed] = await Promise.all([
      hash(ADMIN.password),
      User.insertOne({
        id: userId,
        accountType: ACCOUNT_TYPES.admin,
        created: `${now}`,
        email: ADMIN.email,
        entity: collections.User,
        firstName: ADMIN.firstName,
        lastName: ADMIN.lastName,
        updated: `${now}`,
      }),
    ]);

    // create the Password record
    await database.collection(collections.Password).insertOne({
      created: `${now}`,
      entity: collections.Password,
      hash: hashed,
      id: generateId(),
      recoveryCode: null,
      updated: `${now}`,
      userId,
    });

    log('-- seeding: done');
    return Deno.exit(0);
  } catch (error) {
    throw new Error(error);
  }
})();
