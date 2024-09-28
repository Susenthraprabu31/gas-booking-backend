import express from 'express'
import GasController from '../controller/gas.js'
import verifyAdmin from './../middleware/verifyAdmin.js';
import verifyAuth from '../middleware/verifyAuth.js';

const router = express.Router()



router.post("/registerUser",verifyAuth,GasController.registerUser);
router.post("/loginUser", GasController.loginUser);
router.post("/booking", GasController.bookGas)
router.post('/updatePayment', GasController.razorpayWeb)



export default router