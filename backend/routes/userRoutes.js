const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/getUsers', userController.getUsers);
router.post('/', userController.addUser);
router.put('/:sl_no', userController.editUser);
router.post('/bmi', userController.addBMI);
router.post('/importExcel', authMiddleware, upload.single('file'), userController.importExcel);

module.exports = router;