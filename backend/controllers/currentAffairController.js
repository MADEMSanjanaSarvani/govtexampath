const CurrentAffair = require('../models/CurrentAffair');

/**
 * @desc    Get all current affairs with filters and pagination
 * @route   GET /api/current-affairs
 */
const getCurrentAffairs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const [affairs, total] = await Promise.all([
      CurrentAffair.find(filter)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit),
      CurrentAffair.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        currentAffairs: affairs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get current affairs error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching current affairs.',
    });
  }
};

/**
 * @desc    Get a single current affair by ID
 * @route   GET /api/current-affairs/:id
 */
const getCurrentAffairById = async (req, res) => {
  try {
    const affair = await CurrentAffair.findById(req.params.id);

    if (!affair) {
      return res.status(404).json({
        success: false,
        error: 'Current affair not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: affair,
    });
  } catch (error) {
    console.error('Get current affair by ID error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching current affair.',
    });
  }
};

/**
 * @desc    Get current affairs by category
 * @route   GET /api/current-affairs/category/:category
 */
const getByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { category: req.params.category };

    const [affairs, total] = await Promise.all([
      CurrentAffair.find(filter)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit),
      CurrentAffair.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        currentAffairs: affairs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get current affairs by category error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching current affairs.',
    });
  }
};

/**
 * @desc    Create a new current affair (admin only)
 * @route   POST /api/current-affairs
 */
const createCurrentAffair = async (req, res) => {
  try {
    const { title, content, category, source, publishDate, tags } = req.body;

    const affair = await CurrentAffair.create({
      title,
      content,
      category,
      source,
      publishDate,
      tags,
    });

    res.status(201).json({
      success: true,
      data: affair,
      message: 'Current affair created successfully.',
    });
  } catch (error) {
    console.error('Create current affair error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error creating current affair.',
    });
  }
};

/**
 * @desc    Update a current affair (admin only)
 * @route   PUT /api/current-affairs/:id
 */
const updateCurrentAffair = async (req, res) => {
  try {
    const affair = await CurrentAffair.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!affair) {
      return res.status(404).json({
        success: false,
        error: 'Current affair not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: affair,
      message: 'Current affair updated successfully.',
    });
  } catch (error) {
    console.error('Update current affair error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating current affair.',
    });
  }
};

/**
 * @desc    Delete a current affair (admin only)
 * @route   DELETE /api/current-affairs/:id
 */
const deleteCurrentAffair = async (req, res) => {
  try {
    const affair = await CurrentAffair.findByIdAndDelete(req.params.id);

    if (!affair) {
      return res.status(404).json({
        success: false,
        error: 'Current affair not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Current affair deleted successfully.',
    });
  } catch (error) {
    console.error('Delete current affair error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error deleting current affair.',
    });
  }
};

module.exports = {
  getCurrentAffairs,
  getCurrentAffairById,
  getByCategory,
  createCurrentAffair,
  updateCurrentAffair,
  deleteCurrentAffair,
};
