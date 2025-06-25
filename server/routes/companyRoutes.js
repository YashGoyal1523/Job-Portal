import express from 'express'
import { ChangeJobApplicationStatus, changeVisibility, deleteJob, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controller/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/authMiddleware.js'

const router=express.Router()

//register a company
router.post('/register',upload.single('image') ,registerCompany) // upload wala for image
//company login
router.post('/login',loginCompany)
//get company data
router.get('/company',protectCompany,getCompanyData)
//post job
router.post('/post-job',protectCompany,postJob)
//get applicants data of company
router.get('/applicants',protectCompany,getCompanyJobApplicants)
//get company job list
router.get('/list-job',protectCompany,getCompanyPostedJobs)
//change application status
router.post('/change-status',protectCompany,ChangeJobApplicationStatus)
//change applications visibility
router.post('/change-visibility',protectCompany,changeVisibility)
//delete job
router.delete('/delete-job',protectCompany,deleteJob)

export default router