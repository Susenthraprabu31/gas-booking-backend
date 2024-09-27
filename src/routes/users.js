import express from 'express'
import usersController from '../controller/user.js'
import verifyAuth from '../middleware/verifyAuth.js'
import verifyAdmin from '../middleware/verifyAdmin.js'


const router = express.Router()

router.get('/getAllUsers',verifyAuth,verifyAdmin,usersController.getAllUsers)
router.post('/createUser',usersController.createUser)
router.post('/login',usersController.login)




export default router