import express from 'express'
import GasController from '../controller/gas.js'

const router = express.Router()



router.post("/createUser",GasController.registerUser)
router.post("/loginUser", GasController.loginUser)
router.post("/booking", GasController.bookGas)
router.post('/updatePayment', GasController.razorpayWeb)



export default router;