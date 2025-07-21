const express = require('express');
const { requireUser } = require('./middleware/auth.js');
const UserService = require('../services/userService.js');

const router = express.Router();

// GET /api/users/profile - Get user profile data
router.get('/profile', requireUser, async (req, res) => {
  try {
    console.log(`[User Routes] Fetching profile for user ID: ${req.user.id}`);
    console.log(`[User Routes] User object:`, JSON.stringify(req.user, null, 2));

    const user = await UserService.get(req.user.id);
    
    if (!user) {
      console.error(`[User Routes] User not found with ID: ${req.user.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const profileData = {
      id: user.id,
      email: user.email,
      name: user.name || 'Commander',
      level: user.level,
      xp: user.xp,
      unlockedSkills: user.unlockedSkills,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };

    console.log(`[User Routes] Successfully retrieved profile for user: ${user.email}`);
    console.log(`[User Routes] Profile data:`, JSON.stringify(profileData, null, 2));
    
    return res.status(200).json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error(`[User Routes] Error fetching user profile: ${error.message}`);
    console.error(`[User Routes] Error stack:`, error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user profile',
      error: error.message 
    });
  }
});

module.exports = router;