"use client"

import type React from "react"
import { useState, useEffect, type ChangeEvent } from "react"
import axios from "axios"
import { Box, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material"
import { CloudUpload, Folder } from "lucide-react"

import "../styles/UploadFile.css"
import AlbumModal from "./AlbumGallery"
const FileUploader: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null)
  const [albums, setAlbums] = useState<any[]>([])
  const [_loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      const userId = Number(localStorage.getItem("UserId"))

      if (!token) {
        setError("User is not authenticated. Please log in.")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("https://localhost:7259/api/album", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userAlbums = response.data.filter((album: any) => {
          return Number(album.userId) === userId
        })
        setAlbums(userAlbums)
      } catch (err) {
        setError("Error loading albums")
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      setShowModal(true)
    }
  }

  const uploadFile = async (file: File, albumId: number) => {
    const token = localStorage.getItem("token")

    if (!albumId || !token) {
      setError("Please select an album and ensure you are logged in")
      return
    }

    setUploading(true)

    try {
      const response = await axios.get(`https://localhost:7259/api/album/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status !== 200) {
        setError("Error uploading image, please try again later")
        setUploading(false)
        return
      }

      const albumName = response.data.title

      const presignedResponse = await axios.get("https://localhost:7259/api/UploadFile/presigned-url", {
        params: {
          fileName: file.name,
          albumName: albumName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const presignedUrl = presignedResponse.data.uploadUrl
      const fileUrl = presignedResponse.data.fileUrl

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          "x-amz-acl": "bucket-owner-full-control",
        },
      })

      const photoData = {
        AlbumId: albumId,
        UserId: localStorage.getItem("UserId"),
        Url: fileUrl,
        Title: file.name,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      }

      try {
        await axios.post("https://localhost:7259/api/photo", photoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Error sending photo to API:")
      }

      setUploading(false)
      setShowModal(false)
      alert("File uploaded successfully!")
    } catch (error) {
      setError("Error during upload")
      setUploading(false)
    }
  }

  return (
    <Box className="uploader-container">
      <Typography variant="h4" component="h1" className="uploader-title">
        Upload Photos
      </Typography>

      {error && (
        <Alert severity="error" className="uploader-alert">
          {error}
        </Alert>
      )}

      <Paper elevation={0} className="upload-paper">
        <Box className="upload-circle">
          <CloudUpload className="upload-icon" />
          <Typography variant="body2" className="upload-text">
            Click or drag your files here
            <br />
            up to <strong>2GB</strong> for free
          </Typography>
        </Box>

        <Box className="upload-buttons">
          <Button variant="contained" component="label" startIcon={<CloudUpload />} className="upload-button">
            Select Files
            <input type="file" multiple onChange={handleFileChange} hidden />
          </Button>

          <Button variant="outlined" component="label" startIcon={<Folder />} className="folder-button">
            Select Folder
            <input type="file" webkitdirectory="true" {...({} as any)} hidden />
          </Button>
        </Box>
      </Paper>

      {showModal && (
        <AlbumModal
          albums={albums}
          onClose={() => setShowModal(false)}
          onUpload={(file: File) => uploadFile(file, selectedAlbum!)}
          onSelectAlbum={(albumId: number) => setSelectedAlbum(albumId)}
          selectedFiles={selectedFiles}
        />
      )}

      {uploading && (
        <Box className="uploading-overlay">
          <Paper className="uploading-paper">
            <CircularProgress size={60} thickness={4} className="uploading-spinner" />
            <Typography variant="h6">Uploading...</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default FileUploader
