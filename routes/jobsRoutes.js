const express = require('express');
const {
  createJob,
  getAllJobs,
  showStats,
  deleteJob,
  updateJob,
} = require('../controllers/jobsController');
const router = express.Router();

router.route('/').post(createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').patch(updateJob).delete(deleteJob);

module.exports = router;
