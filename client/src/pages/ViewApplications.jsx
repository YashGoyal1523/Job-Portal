import React, { useContext,useState ,useEffect } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'


const ViewApplications = () => {

const {companyToken,backendUrl,applicants,fetchCompanyJobApplications,fetchUserApplications}=useContext(AppContext)

//func to update job application status
const changeJobApplicationsStatus=async(id,status)=>{
    try{
        const {data} = await axios.post(backendUrl+'/api/company/change-status',{id:id,status:status},{headers:{token:companyToken}})

        if(data.success){
            fetchCompanyJobApplications() // for view applications page
            fetchUserApplications() // for applied jobs page of user
        }
        else{
            toast.error(data.message)
        }
        
    }
    catch(e){
        toast.error(e.message)
    }
}

  return applicants? applicants.length===0 ? (
     <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Applications Available </p>
  </div>)
   :(
    <div className='container mx-auto p-4 '>
        <div>
            <table className='w-full max-w-4xl bg-white border border-gray-200  max-sm:text-sm'>
                <thead>
                    <tr className='border-b border-gray-200'>
                        <th className='py-2  px-4 text-left'>#</th>
                        <th className='py-2  px-4 text-left'>Username</th>
                        <th className='py-2  px-4 text-left max-sm:hidden'>Job title</th>
                        <th className='py-2  px-4 text-left max-sm:hidden'>Location</th>
                        <th className='py-2  px-4 text-left'>Resume</th>
                        <th className='py-2  px-4 text-left'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.filter(item=>item.jobId&&item.userId).map((applicant,index)=>(
                        <tr key={index} className='text-gray-700 border-b border-gray-200'>
                            <td className='py-2 px-4  text-center'>{index+1}</td>
                            <td className='py-2 px-4  text-center'>
                                <div className='flex items-center'>
                                <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                                <span>{applicant.userId.name}</span>
                                </div>
                  
                            </td>
                            <td className='py-2 px-4  max-sm:hidden'>{applicant.jobId.title}</td>
                            <td className='py-2 px-4  max-sm:hidden'>{applicant.jobId.location}</td>
                            <td className='py-2 px-4 '>
                                <a className='bg-blue-50 text-blue-400 py-1 px-3 rounded inline-flex gap-2 items-center' href={applicant.userId.resume} target='_blank'>
                                    Resume
                                    <img src={assets.resume_download_icon} alt="" />
                                </a>
                            </td>
                            <td className='py-2 px-4 relative'>
                                {applicant.status==='Pending' ?
                                <div className='relative inline-block text-left group'>
                                    <button className='text-gray-500 action-button'>...</button>
                                    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                                        <button onClick={()=>changeJobApplicationsStatus(applicant._id,'Accepted')} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 '>Accept</button>
                                        <button onClick={()=>changeJobApplicationsStatus(applicant._id,'Rejected')}className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 '>Reject</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    {applicant.status}
                                </div>
                                 }
                                
                            </td>
                        </tr>
                    ))}
                </tbody> 
            </table>
        </div>
    </div>
  ) :<Loading />
}

export default ViewApplications