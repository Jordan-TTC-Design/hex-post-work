const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: [true, 'userName為必填資訊'],
    },
    userImgUrl: String,
    postContent: {
      type: String,
      require: [true, 'postContent為必填資訊'],
    },
    postImgUrl: String,
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updateAt: {
      time: {
        type: Date,
        default: Date.now(),
        select: false,
      },
      edit: { type: Boolean, default: false },
    },
    tags: [{ type: String }],
    postLikes: {
      type: Number,
      default: 0,
    },
    postComments: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  },
);
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
