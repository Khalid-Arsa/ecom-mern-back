const express = require('express');
const { requireSignin } = require('../../common-middleware/ComMiddleware');
const { signup, signin, signout } = require('../../controller/admin/auth');
const { isRequestValidated, validateSignupRequest, validateSigninRequest } = require('../../validators/validators');
const router = express.Router();



router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signout', signout)

module.exports = router