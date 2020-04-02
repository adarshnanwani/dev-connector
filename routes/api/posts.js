const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      const post = new Post(newPost);
      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.route('/').get(auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({
      createdAt: -1
    });
    if (!posts) {
      return res.status(200).json({ msg: 'No posts found for this user.' });
    }
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:postId
// @desc    Get post by id
// @access  Private
router.route('/:postId').get(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: `No post found for the id ${postId}` });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: `No post found for the id ${req.params.postId}` });
    }
    res.s;
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:postId
// @desc    Delete post by id
// @access  Private
router.route('/:postId').delete(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ msg: `No post found for the id ${req.params.postId}` });
    }

    if (post.user.toString() === req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.send('Post deleted');
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: `No post found for the id ${req.params.postId}` });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:postId
// @desc    Like a post
// @access  Private
router.route('/like/:postId').put(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    // Check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked!' });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
