import React from 'react'
import { jobsData, manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { toast } from 'react-toastify'

const ManageJobs = () => {

const navigate=useNavigate()

const [jobs,setJobs]=useState(false)
const {backendUrl,companyToken}=useContext(AppContext)
//func to fetch company job applications data
const fetchCompanyJobs=async()=>{
    try{
        const {data}=await axios.get(backendUrl+'/api/company/list-job',{headers:{token:companyToken}})
        if(data.success){
            setJobs(data.jobsData.reverse())
            
        }
        else{
           
            toast.error(data.message)
        }
    }
    catch(e){
        toast.error(e.message)
    }
}
useEffect(()=>{
    if(companyToken){
        fetchCompanyJobs()
    }
},[])

  return (
    <div className='container p-4 max-w-5xl '>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr className='border-b border-gray-200'>
                        <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
                        <th className='py-2 px-4 text-left'>Job title</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                        <th className='py-2 px-4 text-center'>Applicants</th>
                        <th className='py-2 px-4 text-left'>Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {manageJobsData.map((job,index)=>(
                        <tr key={index} className='border-b border-gray-200 text-gray-700'>
                            <td className='py-2 px-4 max-sm:hidden'>{index+1}</td>
                            <td className='py-2 px-4'>{job.title}</td>
                            <td className='py-2 px-4 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                            <td className='py-2 px-4 max-sm:hidden'>{job.location}</td>
                            <td className='py-2 px-4 text-center'>{job.applicants}</td>
                            <td className='py-2 px-4 '>
                                <input className='scale-125 ml-4' type="checkbox" />
                            </td>

                        </tr>
                    ))} 
                </tbody>
            </table>
        </div>

        <div className='mt-4 flex justify-end'>
            <button onClick={()=>navigate('/dashboard/add-job')}  className='bg-black text-white py-2 px-4 rounded'>Add New</button>
        </div>
    </div>
  )
}

export default ManageJobs