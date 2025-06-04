"use client"

// import type React from "react"
import * as React from "react"
import { useState } from "react"
import axios from "axios"
import { TextField, Button, Container, Typography, Box, Paper, Alert, CircularProgress } from "@mui/material"
import { FolderPlus } from "lucide-react"
import { useUserContext } from "../context/UserContext"
import "../styles/AddAlbum.css"

const AddAlbum = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUserContext()
  const token = localStorage.getItem("token")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    if (!user || !token) {
      setError("User is not authenticated. Please log in.")
      setLoading(false)
      return
    }

    const albumData = {
      Title: title,
      Description: description,
      UserId: localStorage.getItem("UserId"),
    }

    try {
      console.log("Album data:", albumData)

      const response = await axios.post("https://practicumproject-server.onrender.com/api/album/album", albumData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Album created:", response.data)
      setSuccess(true)
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("There was an error creating the album!", error)
      setError("Failed to create album. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="add-album-container">
      <Container maxWidth="sm">
        <Paper elevation={0} className="add-album-paper">
          <Box className="add-album-header">
            <FolderPlus className="add-album-icon" />
            <Typography variant="h4" component="h1" className="add-album-title">
              Create New Album
            </Typography>
            <Typography variant="body1" className="add-album-subtitle">
              Create a new album to organize your photos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="add-album-alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="add-album-alert">
              Album created successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Album Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              className="add-album-input"
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
              className="add-album-input"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              className="add-album-button"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Album"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default AddAlbum