import express from 'express'

import gasRoutes from './gas.js'


const router = express.Router()

router.use('/gas',gasRoutes)
router.get('*',(req,res)=>res.send(`<div style="text-align:center"><h1>404 NOT FOUND</h1><p>The requested endpoint does not exists</p></div>`))


 
export default router