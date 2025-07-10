import { createContext, useEffect, useState ,useRef} from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react"; 

export const AppContext=createContext()

export const AppContextProvider= (props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const { getToken } = useAuth();

    const [searchFilter,setSearchFilter]=useState({
        title:'',
        location:''
    })



    const [isSearched,setIsSearched]=useState(false)


     const titleRef=useRef()
     const locationRef=useRef()
    

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false )




    const [companyToken,setCompanyToken]=useState(null)
    const [companyData,setCompanyData]=useState(null)

    const [isLoadingToken, setIsLoadingToken] = useState(true);

    const [userData,setUserData]=useState(null)
    const [userApplications,setUserApplications] =useState([])



    const [jobs,setJobs]=useState([])


    const [applicants,setApplicants]=useState(false)
    


    //function to fetch jobs
    const fetchJobs= async () =>{
        try{
            const {data} = await axios.get(backendUrl+'/api/jobs')
            if(data.success){
                setJobs(data.jobs)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(e){
            toast.error(e.message)
        }
        
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

    //func to fetch user data
    const fetchUserData=async()=>{
        try{
            const token = await getToken()

            const {data} = await axios.get(backendUrl+'/api/users/user',{headers:{Authorization:`Bearer ${token}`}}) //authenticate clerk middleware krega
            if(data.success){
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(e){
            toast.error(e.message)
        }
    }

    //func to fetch users applied applications data
    const fetchUserApplications = async ()=>{
        try{
            const token= await getToken()

            const {data}= await axios.get(backendUrl+'/api/users/applications',{headers:{Authorization:`Bearer ${token}`}})

            if(data.success){
                setUserApplications(data.applications)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(e){
            toast.error(e.message)
        }
    }

    //func to fetch company job applications data
    const fetchCompanyJobApplications = async () =>{
        try{
            const {data} = await axios.get(backendUrl+'/api/company/applicants',{headers:{token:companyToken}})
           
            if(data.success){
                setApplicants(data.applications.reverse())
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
        setIsLoadingToken(false); // token load complete
    },[])

    useEffect(()=>{
        if(companyToken){
          fetchCompanyData()  
        }
    },[companyToken])


    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])
    

    useEffect(()=>{
        if(companyToken){
            fetchCompanyJobApplications()
        }
    },[companyToken])
    



    const value={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        titleRef,locationRef,
        showRecruiterLogin,setShowRecruiterLogin,
        companyData,setCompanyData,companyToken,setCompanyToken,
        backendUrl,isLoadingToken,
        fetchJobs,
        fetchUserData,
        userData,userApplications,setUserData,setUserApplications,
        fetchUserApplications,
        fetchCompanyJobApplications,applicants,setApplicants
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}