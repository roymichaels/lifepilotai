const { generatePasswordHash, validatePassword } = require('../utils/password.js');
const UserModel = require('../models/User.js');

class UserService {
  static async list() {
    return UserModel.listUsers();
  }

  static async get(id) {
    return UserModel.getUserById(id);
  }

  static async getByEmail(email) {
    return UserModel.getUserByEmail(email);
  }

  static async update(id, data) {
    return UserModel.updateUser(id, data);
  }

  static async delete(id) {
    return UserModel.deleteUser(id);
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const user = UserModel.getUserByEmail(email);
    if (!user) return null;

    const passwordValid = await validatePassword(password, user.password);
    if (!passwordValid) return null;

    const now = new Date().toISOString();
    UserModel.updateUser(user.id, { lastLoginAt: now });
    return UserModel.getUserById(user.id);
  }

  static async create({ email, password, name = '' }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const existing = UserModel.getUserByEmail(email);
    if (existing) throw new Error('User with this email already exists');

    const hash = await generatePasswordHash(password);
    return UserModel.createUser({ email, password: hash, name });
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    const hash = await generatePasswordHash(password);
    return UserModel.updateUser(user.id, { password: hash });
  }
}

module.exports = UserService;
