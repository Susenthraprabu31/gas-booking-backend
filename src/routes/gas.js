import express from 'express'
import GasController from '../controller/gas.js'
import verifyAdmin from './../middleware/verifyAdmin.js';
import verifyAuth from '../middleware/verifyAuth.js';

const router = express.Router()


router.post('/bookgas',GasController.bookgas)
router.get('/getAllBookGas',verifyAuth,verifyAdmin,GasController.getAllBookGas)
router.post('/updated-payment',GasController.razorpay)



export default router