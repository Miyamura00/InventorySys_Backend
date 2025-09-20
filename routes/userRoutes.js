const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, updateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser)

module.exports = router;