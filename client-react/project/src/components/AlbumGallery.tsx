"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Checkbox,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material"
import { X, FolderIcon } from "lucide-react"

import "../styles/AlbumGallery.css"

type Folder = {
  albumId: number
  title: string
  userId: number
  description: string
}

interface AlbumModalProps {
  albums: Folder[]
  onClose: () => void
  onUpload: (file: File, albumId: number) => void
  onSelectAlbum: (album: number) => void
  selectedFiles: File[]
}

type Photo = {
  photoId: number
  url: string
  title: string
  // הוסף כאן שדות נוספים אם צריך
}

const AlbumModal = ({
  albums = [],
  onClose,
  onUpload,
  onSelectAlbum,
  selectedFiles,
}: AlbumModalProps) => {
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleSelect = (albumId: number) => {
    setSelectedAlbums((prev) =>
      prev.includes(albumId) ? prev.filter((id) => id !== albumId) : [...prev, albumId]
    )
    onSelectAlbum(albumId)
  }

  const handleSave = () => {
    if (selectedFiles.length > 0 && selectedAlbums.length > 0) {
      const albumId = selectedAlbums[0]
      selectedFiles.forEach((file: File) => {
        onUpload(file, albumId)
      })
    } else {
      setError("Please select a file to upload and choose an album.")
    }
  }

  const fetchPhotos = async (albumId: number) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://localhost:7259/api/Albums/${albumId}/photos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setPhotos(response.data)
    } catch (error) {
      console.log("Error loading photos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedAlbums.length > 0) {
      fetchPhotos(selectedAlbums[0])
    }
  }, [selectedAlbums])

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth className="album-modal">
      <DialogTitle className="album-modal-title">
        <Typography variant="h6" component="div" className="album-modal-heading">
          Select Album
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <X />
        </IconButton>
      </DialogTitle>

      <DialogContent className="album-modal-content">
        {error && (
          <Alert severity="error" className="album-modal-alert">
            {error}
          </Alert>
        )}

        <Box className="selected-files-container">
          <Typography variant="subtitle1" className="section-heading">
            Selected Files ({selectedFiles.length})
          </Typography>
          <Grid container spacing={2}>
            {selectedFiles.map((file: File, index: number) => (
              <Grid  key={index}>
                <Card className="file-card">
                  <CardMedia
                    component="img"
                    height="100"
                    image={URL.createObjectURL(file)}
                    alt={file.name}
                    className="file-image"
                  />
                  <CardContent className="file-content">
                    <Typography variant="body2" noWrap className="file-name">
                      {file.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="subtitle1" className="section-heading">
          Choose an Album
        </Typography>

        {albums.length === 0 ? (
          <Alert severity="info">You don't have any albums yet. Please create an album first.</Alert>
        ) : (
          <Grid container spacing={2}>
            {albums.map((album: Folder) => (
              <Grid  key={album.albumId}>
                <Card
                  className={`album-card ${selectedAlbums.includes(album.albumId) ? "selected" : ""}`}
                  onClick={() => handleToggleSelect(album.albumId)}
                >
                  <Box className="album-checkbox">
                    <Checkbox
                      checked={selectedAlbums.includes(album.albumId)}
                      onChange={() => handleToggleSelect(album.albumId)}
                      onClick={(e) => e.stopPropagation()}
                      className="album-checkbox-input"
                    />
                  </Box>
                  <CardContent className="album-content">
                    <FolderIcon className="album-icon" />
                    <Typography variant="subtitle1" className="album-title">
                      {album.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedAlbums.length > 0 && (
          <Box className="album-preview-container">
            <Typography variant="subtitle1" className="section-heading">
              Album Preview
            </Typography>

            {loading ? (
              <Box className="preview-loading">
                <CircularProgress size={40} thickness={4} className="preview-spinner" />
              </Box>
            ) : photos.length > 0 ? (
              <Grid container spacing={2}>
                {photos.map((photo: Photo) => (
                  <Grid  key={photo.photoId}>
                    <Card className="preview-card">
                      <CardMedia
                        component="img"
                        height="100"
                        image={photo.url}
                        alt={photo.title}
                        className="preview-image"
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">No photos in this album yet.</Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions className="album-modal-actions">
        <Button onClick={onClose} className="cancel-button">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedAlbums.length === 0 || selectedFiles.length === 0}
          className="save-button"
        >
          Upload to Selected Album
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlbumModal
