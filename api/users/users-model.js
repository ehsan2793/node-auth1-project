const db = require('../../data/db-config');

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const allusers = await db('users').select('user_id', 'username');
  return allusers;
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const found = await db('users')
    .where(filter);
  return found;
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const oneUser = await db('users')
    .select('user_id', 'username')
    .where({ user_id: user_id })
    .first();
  return oneUser;
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
// Don't forget to add these to the `exports` object so they can be required in other modules
