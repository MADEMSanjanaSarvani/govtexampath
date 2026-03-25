const Resource = require('../models/Resource');

/**
 * @desc    Get all resources with filters and pagination
 * @route   GET /api/resources
 */
const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.examCategory) {
      filter.examCategory = req.query.examCategory;
    }

    if (req.query.examId) {
      filter.examId = req.query.examId;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .populate('uploadedBy', 'name email')
        .populate('examId', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resource.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        resources,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get resources error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching resources.',
    });
  }
};

/**
 * @desc    Get a single resource by ID
 * @route   GET /api/resources/:id
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('examId', 'title category');

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Get resource by ID error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching resource.',
    });
  }
};

/**
 * @desc    Get resources by exam ID
 * @route   GET /api/resources/exam/:examId
 */
const getByExam = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { examId: req.params.examId };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .populate('uploadedBy', 'name email')
        .populate('examId', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resource.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        resources,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get resources by exam error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching resources.',
    });
  }
};

/**
 * @desc    Create a new resource (admin only)
 * @route   POST /api/resources
 */
const createResource = async (req, res) => {
  try {
    const { title, description, type, examCategory, examId, fileUrl } = req.body;

    const resource = await Resource.create({
      title,
      description,
      type,
      examCategory,
      examId,
      fileUrl,
      uploadedBy: req.user.id,
    });

    await resource.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      data: resource,
      message: 'Resource created successfully.',
    });
  } catch (error) {
    console.error('Create resource error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error creating resource.',
    });
  }
};

/**
 * @desc    Update a resource (admin only)
 * @route   PUT /api/resources/:id
 */
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('uploadedBy', 'name email')
      .populate('examId', 'title category');

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
      message: 'Resource updated successfully.',
    });
  } catch (error) {
    console.error('Update resource error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating resource.',
    });
  }
};

/**
 * @desc    Delete a resource (admin only)
 * @route   DELETE /api/resources/:id
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully.',
    });
  } catch (error) {
    console.error('Delete resource error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error deleting resource.',
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  getByExam,
  createResource,
  updateResource,
  deleteResource,
};
