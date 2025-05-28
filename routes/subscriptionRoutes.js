const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { create, get, update, cancel } = require('../controllers/subscriptionController');

router.post('/', authenticate, create);
router.get('/:userId', authenticate, get);
router.put('/:userId', authenticate, update);
router.delete('/:userId', authenticate, cancel);

module.exports = router;
