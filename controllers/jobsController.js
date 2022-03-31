const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const moment = require('moment');
const Job = require('../models/Job');
const { BadRequest, NotFound } = require('../errors');
const checkPermissions = require('../utils/checkPermission');

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequest(`Company and position fields can't be empty`);
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObj = {
    creadetBy: req.user.userId,
  };

  if (status !== 'all') {
    queryObj.status = status;
  }
  if (jobType !== 'all') {
    queryObj.jobType = jobType;
  }
  if (search) {
    queryObj.position = { $regex: search, $options: 'i' };
  }

  let result = Job.find(queryObj);

  // sort
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  // total 100
  // 0-10 11-20 21-30 31-40 41-50 51-60 61-70 71-80 81-90 91-100

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObj);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({
    totalJobs,
    numOfPages,
    page,
    jobs,
  });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    throw new NotFound('No job was found');
  }

  checkPermissions(req.user, job.createdBy);

  job.remove();
  res.status(StatusCodes.OK).json({ message: 'Job deleted' });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { position, company, jobLocation, status, jobType } = req.body;

  const job = await Job.findById(id);
  if (!job) {
    throw new NotFound('No job was found');
  }

  if (!position || !company) {
    throw new BadRequest(`Company and position fields can't be empty`);
  }

  checkPermissions(req.user, job.createdBy);

  job.position = position;
  job.company = company;
  job.jobLocation = jobLocation;
  job.jobType = jobType;
  job.status = status;

  await job.save();
  res.status(StatusCodes.OK).json({ job });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');

      return {
        date,
        count,
      };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    defaultStats,
    monthlyApplications,
  });
};

module.exports = {
  createJob,
  getAllJobs,
  showStats,
  deleteJob,
  updateJob,
};
