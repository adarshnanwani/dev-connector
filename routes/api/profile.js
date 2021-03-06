const express = require('express');
const axios = require('axios');
const config = require('config');
const normalize = require('normalize-url');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router
  .route('/')
  .post(
    [
      auth,
      [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;

      // Build profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website)
        profileFields.website = normalize(website, {
          forceHttps: true,
        });
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(',').map((s) => s.trim());
      }

      // Build social object
      profileFields.social = {};
      if (twitter)
        profileFields.social.twitter = normalize(twitter, {
          forceHttps: true,
        });
      if (facebook)
        profileFields.social.facebook = normalize(facebook, {
          forceHttps: true,
        });
      if (youtube)
        profileFields.social.youtube = normalize(youtube, {
          forceHttps: true,
        });
      if (instagram)
        profileFields.social.instagram = normalize(instagram, {
          forceHttps: true,
        });
      if (linkedin)
        profileFields.social.linkedin = normalize(linkedin, {
          forceHttps: true,
        });

      try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
          // Update
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            {
              $set: profileFields,
            },
            {
              new: true,
            }
          );
          return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
      }
    }
  );

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.route('/').get(async (req, res) => {
  try {
    const profiles = await Profile.find().populate({
      path: 'user',
      model: 'User',
      select: 'name avatar',
    });
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by user id
// @access  Public
router.route('/user/:userId').get(async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate({
      path: 'user',
      model: 'User',
      select: 'name avatar',
    });
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found.' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.route('/').delete(auth, async (req, res) => {
  try {
    // @TODO - remove user's posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router
  .route('/experience')
  .put(
    [
      auth,
      [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route   DELETE api/profile/experience/:expId
// @desc    Delete profile experience
// @access  Private
router.route('/experience/:expId').delete(auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.expId);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router
  .route('/education')
  .put(
    [
      auth,
      [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route   DELETE api/profile/education/:eduId
// @desc    Delete profile education
// @access  Private
router.route('/education/:eduId').delete(auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.eduId);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.route('/github/:username').get(async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`
    );

    const headers = {
      'user-agent': 'node.js',
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;
