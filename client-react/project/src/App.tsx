import { useState } from 'react';
import './App.css';
import Register from './components/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserProvider from './context/UserContext';
import Layout from './components/Layout';
import FileUploader from './components/UploadFile';
import FolderList from './components/Albums';
import AddAlbum from './components/AddAlbum';
import PhotoGallery from './components/PhotoGallery';

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/UploadFile" element={<FileUploader />} /> 
            <Route path="/AddAlbum" element={<AddAlbum />} />
            <Route 
              path="/Albums" 
              element={
                <FolderList 
                  albums={[]} 
                  onSelectAlbum={() => {}} 
                  showCheckboxes={false} 
                  selectedAlbums={[]} 
                  onToggleSelect={() => {}} 
                />
              } 
            />
            <Route 
              path="/PhotoGallery/:albumId" 
              element={<PhotoGallery onClose={() => console.log('Gallery closed')} />} 
            />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
