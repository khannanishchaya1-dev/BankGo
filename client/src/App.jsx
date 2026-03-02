import React from 'react'
import Splash from './pages/Splash'
import Start from './pages/Start'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserProtectWrapper from './pages/UserProtectWrapper'
import{Route,Routes,Link} from 'react-router-dom';
import OpenAccount from './pages/OpenAccount';

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<Splash/>}/>
      <Route path='/start' element={<Start/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<UserProtectWrapper><Dashboard/></UserProtectWrapper>}/>
      <Route path='/open-account' element={<UserProtectWrapper><OpenAccount/></UserProtectWrapper>}/>
    </Routes>
      
    </>
  )
}

export default App
