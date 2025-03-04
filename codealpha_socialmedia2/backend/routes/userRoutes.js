const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', async (req, res) => {
    const newUser  = new User(req.body);
    try {
        const savedUser  = await newUser .save();
        res.status(201).json(savedUser );
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Follow a user
router.post('/:id/follow', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser  = await User.findById(req.body.userId);
        if (!user.followers.includes(currentUser ._id)) {
            await user.updateOne({ $push: { followers: currentUser ._id } });
            await currentUser .updateOne({ $push: { following: user._id } });
            res.status(200).json("User  followed");
        } else {
            res.status(403).json("You already follow this user");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;