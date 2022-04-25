const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/VerifyToken');

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing name, email or password',
        });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: 'User already taken' });
        }
        const newUser = new User({
            fullName,
            email,
            password,
            phoneNumber: '',
            address: '',
            dob: '',
        });
        await newUser.save();

        // Return token
        const assetToken = jwt.sign(
            {
                userId: newUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            assetToken,
            user: newUser,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error', error });
    }
});

// @route POST api/auth/login
// @desc User login
// @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Email not found' });
        }

        if (user.password !== password) {
            return res
                .status(400)
                .json({ success: false, message: 'Incorrect password' });
        }

        // Return token
        const assetToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            assetToken,
            user,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error', error });
    }
});

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route PUT api/auth
// @desc Update user info
// @access Public
router.put('/', verifyToken, async (req, res) => {
    const { userUpdate: {fullName, phoneNumber, address, dob}, userId } = req.body;

    if (!fullName || (!phoneNumber && !address && !dob)) {
        return res
            .status(400)
            .json({ success: false, message: 'Note missing property' });
    }

    try {
        let userUpdate = {
            fullName,
            phoneNumber,
            address,
            dob,
        };

        userUpdate = await User.findOneAndUpdate({ _id: userId }, userUpdate, {
            new: true,
        });

        if (!userUpdate) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Updated successfully',
            user: userUpdate,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
