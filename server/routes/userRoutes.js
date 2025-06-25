import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controller/userController.js'
import upload from '../config/multer.js'

const router=express.Router()

//get user data
router.get('/user',getUserData)
//apply a job
router.post('/apply',applyForJob)
//get applied jobs data
router.get('/applications',getUserJobApplications)
//update user profile (resume)
router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router;