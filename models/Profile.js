const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
