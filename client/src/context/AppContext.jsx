import { createContext, useEffect, useState ,useRef} from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext=createContext()

export const AppContextProvider= (props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL


    const [searchFilter,setSearchFilter]=useState({
        title:'',
        location:''
    })



    const [isSearched,setIsSearched]=useState(false)


    const [companyToken,setCompanyToken]=useState(null)
    const [companyData,setCompanyData]=useState(null)



    const [jobs,setJobs]=useState([])
    //function to fetch jobs
    const fetchJobs= async () =>{
        setJobs(jobsData)
    }
    
    //func to fetch company data
    const fetchCompanyData=async()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken}})
            if(data.success){
                setCompanyData(data.company)
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
        fetchJobs()

        const storedCompanyToken=localStorage.getItem('companyToken')
        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)

        }

    },[])

    useEffect(()=>{
        if(companyToken){
          fetchCompanyData()  
        }
    },[companyToken])



     const titleRef=useRef()
     const locationRef=useRef()
    

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false )



    const value={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        titleRef,locationRef,
        showRecruiterLogin,setShowRecruiterLogin,
        companyData,setCompanyData,companyToken,setCompanyToken,
        backendUrl,
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}