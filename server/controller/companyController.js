import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import generatetoken from "../utils/generateToken.js"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"

//register a new company
export const registerCompany=async(req,res)=>{
    const {name,email,password} =req.body
    const imageFile=req.file

    if(!name||!email||!password||!imageFile){
        return res.json({success:false , message : 'Missing Details'})
    }

    try{
        const companyExists=await Company.findOne({email})
        if(companyExists){
            return res.json({success:false , message : 'Company Already Exists'})
           }

        const salt= await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)

        const imageUpload=await cloudinary.uploader.upload(imageFile.path)

        const company=await Company.create({
            name:name,
            email:email,
            password:hashPassword,
            image:imageUpload.secure_url
        })
        res.json({
            success:true,
            company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image
            },
            message:"Registered Successfully",
            token:generatetoken(company._id)
        })
        }
        catch(error){
            res.json({
                success:false,
                message:error.message
            })
        }
    }


//company login
export const loginCompany=async(req,res)=>{
 const {email,password} = req.body
     try{
       const company=await Company.findOne({email})
    if (!company) {
      return res.json({
        success: false,
        message: "Invalid email or password"
      });
    }
      if(await bcrypt.compare(password,company.password)){
        res.json({
            success:true,
            company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image
            },
             message:"Logged in Successfully",
             token:generatetoken(company._id)
        })
       } 
       else{
        res.json({
            success:false,
            message:"Invalid email or password"
        })
       }
     }
     catch(e){
        res.json({success:false,message:e.message})
     }
}
 
//get company data
export const getCompanyData = async (req,res)=>{
    
    try{
        const company=req.company
        res.json({success:true,company})
    }
    catch(e){
        res.json({success:false,message:e.message})
    }
}
//post a new job
export const postJob = async (req,res)=>{

    const {title,description,location,salary,level,category}=req.body

    const companyId=req.company._id

    try{
        const newJob=new Job({
            title:title,
            description,
            location,
            salary,
            companyId,
            date:Date.now(),
            level,
            category
        })
        await newJob.save()
        res.json({success:true,message:"Job added successfully",newJob:newJob})
    }
    catch(e){
        res.json({success:false,message:e.message})
    }

}
//get company job applicants
export const getCompanyJobApplicants = async (req,res)=>{
    try{
        const companyId=req.company._id
        //find job applications for the user and populate related data
        const applications=await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.json({success:true,applications})
    }
    catch(e){
        res.json({success:false,message:e.message})
    }
}
//get company posted jobs
export const getCompanyPostedJobs = async (req,res)=>{
 try{
    const companyId=req.company._id
    const jobs=await Job.find({companyId})

    // adding no of applicants info in data
    const jobsData= await Promise.all( jobs.map(async (job)=>{
        const applicants=await JobApplication.find({jobId:job._id})
        return {...job.toObject(),applicants:applicants.length}
    }))


    res.json({success:true,jobsData})
 }
 catch(e){
    res.json({success:false,message:e.message})
 }
}
//change job application status
export const ChangeJobApplicationStatus= async (req,res)=>{
  
    try{
  const {id,status} =req.body
    //find job application data and update status
    await JobApplication.findOneAndUpdate({_id:id},{status:status})

    res.json({success:true,message:"Status changed"})
    }
    catch(e){
        res.json({success:false,message:e.message})
    }
}
//change job visibility
export const changeVisibility=async(req,res)=>{
    try{
        const {id} = req.body
        const companyId=req.company._id

        const job=await Job.findById(id)

        if(companyId.toString()===job.companyId.toString()){
            job.visible=!job.visible
        }
        await job.save()

        res.json({success:true,job})
    }
    catch(e){
        res.json({success:false,message:e.message})
    }
}

//delete a job
export const deleteJob = async (req, res) => {
  try {
    const  id  = req.query.id;
    const companyId = req.company._id;

    const job = await Job.findById(id);
    if (!job) return res.json({ success: false, message: 'Job not found' });

    // Check if the job belongs to the requesting company
    if (companyId.toString() !== job.companyId.toString()) {
      return res.json({ success: false, message: 'Unauthorized' });
    }

    // Delete job and related job applications
    await Job.findByIdAndDelete(id);
    await JobApplication.deleteMany({ jobId: id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};