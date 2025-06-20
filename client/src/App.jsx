import { useContext, useState } from 'react'
import './App.css'
import { Route ,Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'

function App() {
  const [count, setCount] = useState(0)

  const {showRecruiterLogin}=useContext(AppContext)

  return (
    <>
   { showRecruiterLogin && <RecruiterLogin/> }
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/apply-job/:id' element={<ApplyJob/>} />
      <Route path='/applications' element={<Applications/>} />
      <Route path='/dashboard' element={<Dashboard/>} >
         <Route path='add-job' element={<AddJob/>} />
         <Route path='manage-jobs' element={<ManageJobs/>} />
         <Route path='view-applications' element={<ViewApplications/>} />
      </Route >
    </Routes>

    </>
  )
}

export default App
