import { createContext, useEffect, useState ,useRef} from "react";
import { jobsData } from "../assets/assets";

export const AppContext=createContext()

export const AppContextProvider= (props)=>{

    
    const [searchFilter,setSearchFilter]=useState({
        title:'',
        location:''
    })



    const [isSearched,setIsSearched]=useState(false)



    const [jobs,setJobs]=useState([])
    //function to fetch jobs
    const fetchJobs= async () =>{
        setJobs(jobsData)
    }
    useEffect(()=>{
        fetchJobs()
    },[])



     const titleRef=useRef()
     const locationRef=useRef()
    

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false )


    const value={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        titleRef,locationRef,
        showRecruiterLogin,setShowRecruiterLogin
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}