const { randomUUID } = require('crypto');

const User = require('../models/User.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      console.log('[UserService] Listing all users');
      const users = await User.find();
      console.log(`[UserService] Found ${users.length} users`);
      return users;
    } catch (err) {
      console.error('[UserService] Error listing users:', err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      console.log(`[UserService] Getting user by ID: ${id}`);
      const user = await User.findOne({ _id: id }).exec();
      if (user) {
        console.log(`[UserService] Found user: ${user.email}`);
      } else {
        console.log(`[UserService] User not found with ID: ${id}`);
      }
      return user;
    } catch (err) {
      console.error(`[UserService] Error getting user by ID ${id}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      console.log(`[UserService] Getting user by email: ${email}`);
      const user = await User.findOne({ email }).exec();
      if (user) {
        console.log(`[UserService] Found user with email: ${email}`);
      } else {
        console.log(`[UserService] User not found with email: ${email}`);
      }
      return user;
    } catch (err) {
      console.error(`[UserService] Error getting user by email ${email}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      console.log(`[UserService] Updating user ${id} with data:`, JSON.stringify(data, null, 2));
      const updatedUser = await User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
      if (updatedUser) {
        console.log(`[UserService] Successfully updated user: ${updatedUser.email}`);
      } else {
        console.log(`[UserService] User not found for update with ID: ${id}`);
      }
      return updatedUser;
    } catch (err) {
      console.error(`[UserService] Error updating user ${id}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      console.log(`[UserService] Deleting user with ID: ${id}`);
      const result = await User.deleteOne({ _id: id }).exec();
      const success = (result.deletedCount === 1);
      if (success) {
        console.log(`[UserService] Successfully deleted user with ID: ${id}`);
      } else {
        console.log(`[UserService] User not found for deletion with ID: ${id}`);
      }
      return success;
    } catch (err) {
      console.error(`[UserService] Error deleting user ${id}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) {
      console.error('[UserService] Authentication failed: Email is required');
      throw new Error('Email is required');
    }
    if (!password) {
      console.error('[UserService] Authentication failed: Password is required');
      throw new Error('Password is required');
    }

    try {
      console.log(`[UserService] Authenticating user with email: ${email}`);
      const user = await User.findOne({email}).exec();
      if (!user) {
        console.log(`[UserService] Authentication failed: User not found with email: ${email}`);
        return null;
      }

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) {
        console.log(`[UserService] Authentication failed: Invalid password for user: ${email}`);
        return null;
      }

      console.log(`[UserService] Authentication successful for user: ${email}`);
      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      console.log(`[UserService] Updated last login time for user: ${email}`);
      return updatedUser;
    } catch (err) {
      console.error(`[UserService] Error authenticating user ${email}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, name = '' }) {
    if (!email) {
      console.error('[UserService] User creation failed: Email is required');
      throw new Error('Email is required');
    }
    if (!password) {
      console.error('[UserService] User creation failed: Password is required');
      throw new Error('Password is required');
    }

    console.log(`[UserService] Creating new user with email: ${email}`);

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      console.error(`[UserService] User creation failed: User already exists with email: ${email}`);
      throw new Error('User with this email already exists');
    }

    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        name,
      });

      await user.save();
      console.log(`[UserService] Successfully created new user: ${email}`);
      return user;
    } catch (err) {
      console.error(`[UserService] Error creating new user with email ${email}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) {
      console.error('[UserService] Set password failed: Password is required');
      throw new Error('Password is required');
    }

    console.log(`[UserService] Setting password for user: ${user.email}`);
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
        console.log(`[UserService] Successfully updated password for user: ${user.email}`);
      } else {
        console.log(`[UserService] Password set for new user: ${user.email}`);
      }

      return user;
    } catch (err) {
      console.error(`[UserService] Error setting password for user ${user.email}:`, err.message);
      console.error('[UserService] Error stack:', err.stack);
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }
}

module.exports = UserService;