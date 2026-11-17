const router = require('express').Router();
const User = require('../models/User');
const Report = require('../models/Report');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// All routes below require admin access
router.use(auth, admin);

// GET ALL USERS
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// ACTIVATE OR SUSPEND A USER
router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid account status.'
      });
    }

    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({
        message: 'You cannot change your own account status.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.json({
      message: 'User status updated.',
      user
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN DASHBOARD ANALYTICS
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalReports,
      lostReports,
      foundReports
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'suspended' }),
      Report.countDocuments(),
      Report.countDocuments({ type: 'lost' }),
      Report.countDocuments({ type: 'found' })
    ]);

    res.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalReports,
      lostReports,
      foundReports
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;