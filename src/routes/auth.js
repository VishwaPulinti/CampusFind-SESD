const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  phone: user.phone,
  department: user.department
});

// REGISTER — everyone registering publicly becomes a student
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Enter name, email and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must contain at least 6 characters.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({
        message: 'Email is already registered.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: 'student',
      status: 'active'
    });

    res.status(201).json({
      token: generateToken(user),
      user: userResponse(user)
    });

  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        message: 'Your account has been suspended. Contact the administrator.'
      });
    }

    res.json({
      token: generateToken(user),
      user: userResponse(user)
    });

  } catch (error) {
    next(error);
  }
});

// GET CURRENT USER PROFILE
router.get('/me', auth, (req, res) => {
  res.json({ user: userResponse(req.user) });
});

// UPDATE CURRENT USER PROFILE
router.put('/me', auth, async (req, res, next) => {
  try {
    const { name, phone, department } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required.'
      });
    }

    req.user.name = name.trim();
    req.user.phone = phone || '';
    req.user.department = department || '';

    await req.user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: userResponse(req.user)
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;