"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserProvider from "./context/UserContext"
import Layout from "./components/Layout"
import HomePage from "./components/HomePage"
import Register from "./components/register"
import Login from "./components/Login"
import FileUploader from "./components/UploadFile"
import AddAlbum from "./components/AddAlbum"
import FolderList from "./components/Albums"
import PhotoGallery from "./components/PhotoGallery"
import "./styles/Global.css"

export default function Home() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
              element={<PhotoGallery onClose={() => console.log("Gallery closed")} />}
            />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  )
}
