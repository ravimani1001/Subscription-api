const express = require('express');
const { create, getAll } = require('../controllers/planController');
const authenticate = require('../middlewares/authMiddleware'); // to protect POST

const router = express.Router();

router.post('/', authenticate, create); // Protected route
router.get('/', getAll);                // Public route

module.exports = router;
