import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import * as userController from '../controllers/user/userController.js';
import Auth, { localVariables } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailer.js'
const router = Router();

/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
// router.route('/login').post(controller.verifyUser,controller.login); // login in app
router.route('/login').post(controller.login); // login in app

//admin panel 
router.route("/update-user").post(Auth,userController.updateUser);

/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route("/user-details").get(Auth,userController.userDetails)
router.route("/logout").get(controller.logout);
//admin panel 
router.route("/all-user").get(Auth,userController.fetchAllUsers);

/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password


export default router;