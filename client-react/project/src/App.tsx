import { useState } from 'react'
import './App.css'
import Register from './components/register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'

import UserProvider from './context/UserContext'
import Layout from './components/Layout';
import FileUploader from './components/UploadFile';


function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<div>Home Page Content</div>} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UploadFile" element={<FileUploader />} /> 
        </Routes>
      </Layout>
    </Router>
  </UserProvider>
  )
}

export default App
