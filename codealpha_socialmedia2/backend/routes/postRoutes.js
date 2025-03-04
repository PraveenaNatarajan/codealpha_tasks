const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like a post
router.post('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const currentUser  = req.body.userId;
        if (!post.likes.includes(currentUser )) {
            await post.updateOne({ $push: { likes: currentUser  } });
            res.status(200).json("Post liked");
        } else {
            res.status(403).json("You already liked this post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Comment on a post
router.post('/:id/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = { user: req.body.userId, content: req.body.content };
        await post.updateOne({ $push: { comments: comment } });
        res.status(200).json("Comment added");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;