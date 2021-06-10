const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdminAuth");


router.get('/', HomeController.index);
router.post('/user', UserController.signUp);
router.get('/user',AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth,UserController.findUser);
router.put('/user',AdminAuth, UserController.update);
router.delete('/user/:id',AdminAuth, UserController.delete);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;