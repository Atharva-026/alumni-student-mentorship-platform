const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   POST /api/post/create
// @desc    Create a new post
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { title, description, content, image, postType, tags, category, authorName, authorPhoto, authorCompany, authorType } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content required' });
    }

    const post = new Post({
      authorId: req.user.id,
      authorType: authorType || (req.user.role === 'student' ? 'student' : 'alumni'),
      authorName: authorName || 'Anonymous',
      authorPhoto: authorPhoto || '',
      authorCompany: authorCompany || '',
      title,
      description: description || '',
      content,
      image: image || '',
      postType: postType || 'other',
      tags: tags || [],
      category: category || 'general',
      likes: [],
      comments: [],
      saves: [],
      views: 0
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/post/explore
// @desc    Get all posts (explore feed)
// @access  Private
router.get('/explore', protect, async (req, res) => {
  try {
    const { category, postType, search } = req.query;
    let query = { isDeleted: false };

    if (category) {
      query.category = category;
    }

    if (postType) {
      query.postType = postType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/post/:postId
// @desc    Get single post by ID
// @access  Private
router.get('/:postId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/post/:postId
// @desc    Update a post (only by author)
// @access  Private
router.put('/:postId', protect, async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    const { title, description, content, image, postType, tags, category } = req.body;

    post.title = title || post.title;
    post.description = description || post.description;
    post.content = content || post.content;
    post.image = image || post.image;
    post.postType = postType || post.postType;
    post.tags = tags || post.tags;
    post.category = category || post.category;
    post.isEdited = true;

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/post/:postId
// @desc    Delete a post (only by author)
// @access  Private
router.delete('/:postId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/post/user/:userId
// @desc    Get all posts by a user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const posts = await Post.find({
      authorId: req.params.userId,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/post/:postId/like
// @desc    Like or unlike a post
// @access  Private
router.post('/:postId/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);

      // Create notification
      if (post.authorId.toString() !== req.user.id) {
        const notification = new Notification({
          recipientId: post.authorId,
          senderId: req.user.id,
          senderName: req.body.senderName || 'Someone',
          type: 'like',
          postId: post._id,
          message: `liked your post: "${post.title}"`
        });
        await notification.save();
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/post/:postId/comment
// @desc    Add a comment to post
// @access  Private
router.post('/:postId/comment', protect, async (req, res) => {
  try {
    const { text, commentorName, commentorPhoto, commentorType } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      _id: new require('mongoose').Types.ObjectId(),
      commentorId: req.user.id,
      commentorName: commentorName || 'Anonymous',
      commentorPhoto: commentorPhoto || '',
      commentorType: commentorType || 'student',
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Create notification
    if (post.authorId.toString() !== req.user.id) {
      const notification = new Notification({
        recipientId: post.authorId,
        senderId: req.user.id,
        senderName: commentorName || 'Someone',
        type: 'comment',
        postId: post._id,
        message: `commented on your post: "${post.title}"`
      });
      await notification.save();
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/post/:postId/comments
// @desc    Get all comments on a post
// @access  Private
router.get('/:postId/comments', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      count: post.comments.length,
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/post/:postId/save
// @desc    Save or unsave a post
// @access  Private
router.post('/:postId/save', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadySaved = post.saves.includes(req.user.id);

    if (alreadySaved) {
      post.saves.pull(req.user.id);
    } else {
      post.saves.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadySaved ? 'Post unsaved' : 'Post saved',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/post/category/:category
// @desc    Get posts by category
// @access  Private
router.get('/category/:category', protect, async (req, res) => {
  try {
    const posts = await Post.find({
      category: req.params.category,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/post/search/:query
// @desc    Search posts
// @access  Private
router.post('/search/:query', protect, async (req, res) => {
  try {
    const query = req.params.query;

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;