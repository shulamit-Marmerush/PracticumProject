"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Checkbox,
  Card,
  CardContent,
  CardActions,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Paper,
  Fade,
  Zoom,
  Container,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import FolderIcon from "@mui/icons-material/Folder"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import { useNavigate } from "react-router-dom"
import "../styles/Albums.css"

interface Folder {
  albumId: number
  title: string
  userId: number
  description: string
}

interface FolderListProps {
  albums: Folder[]
  onSelectAlbum: (albumId: number) => void
  showCheckboxes: boolean
  selectedAlbums: number[]
  onToggleSelect: (albumId: number) => void
}

const FolderList: React.FC<FolderListProps> = ({ onSelectAlbum, showCheckboxes, selectedAlbums, onToggleSelect }) => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState<string>("")
  const [currentDescription, setCurrentDescription] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchFolders = async () => {
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

        const userFolders = response.data.filter((folder: Folder) => {
          return Number(folder.userId) === userId
        })
        setFolders(userFolders)
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.message) {
          setError(err.message)
        } else {
          setError("Unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFolders()
  }, [])

  const openFolder = (albumId: number) => {
    navigate(`/PhotoGallery/${albumId}`)
  }

  const handleDeleteClick = (folderId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setFolderToDelete(folderId)
    setDeleteDialogOpen(true)
  }

  const deleteFolder = async () => {
    if (!folderToDelete) return

    const token = localStorage.getItem("token")
    if (!token) {
      setError("User is not authenticated. Please log in.")
      return
    }

    try {
      await axios.delete(`https://localhost:7259/api/album/${folderToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setFolders((prevFolders) => prevFolders.filter((folder) => folder.albumId !== folderToDelete))
      setDeleteDialogOpen(false)
      setFolderToDelete(null)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.message) {
        setError(`Error deleting folder: ${err.message}`)
      } else {
        setError("Unknown error occurred")
      }
    }
  }

  const startEditing = (folder: Folder, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingFolderId(folder.albumId)
    setNewTitle(folder.title)
    setCurrentDescription(folder.description)
  }

  const cancelEditing = () => {
    setEditingFolderId(null)
    setNewTitle("")
    setCurrentDescription("")
  }

  const saveTitle = async (folderId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const token = localStorage.getItem("token")
    if (!token) {
      setError("User is not authenticated. Please log in.")
      return
    }

    try {
      await axios.put(
        `https://localhost:7259/api/album/${folderId}`,
        {
          albumId: folderId,
          title: newTitle,
          userId: localStorage.getItem("UserId"),
          description: currentDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.albumId === folderId ? { ...folder, title: newTitle, description: currentDescription } : folder,
        ),
      )
      setEditingFolderId(null)
      setNewTitle("")
      setCurrentDescription("")
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.message) {
        setError(`Error updating folder: ${err.message}`)
      } else {
        setError("Unknown error occurred")
      }
    }
  }

  if (loading)
    return (
      <Box className="albums-page loading-container">
        <CircularProgress size={60} thickness={4} className="loading-spinner" />
      </Box>
    )

  return (
    <Box className="albums-page">
      <div className="albums-background"></div>
      <Container maxWidth={false} className="albums-container">
        <Box className="albums-header">
          <Typography variant="h4" component="h1" className="albums-title">
            Your Albums
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/AddAlbum")}
            className="add-album-button"
          >
            Create New Album
          </Button>
        </Box>

        {error && (
          <Alert severity="error" className="albums-alert">
            {error}
          </Alert>
        )}

        {folders.length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Paper className="empty-albums">
              <FolderIcon className="empty-icon" />
              <Typography variant="h6" className="empty-albums-text">
                You don't have any albums yet
              </Typography>
              <Typography variant="body1" className="empty-albums-subtext">
                Create your first album to start organizing your photos
              </Typography>
              <Button variant="contained" onClick={() => navigate("/AddAlbum")} className="create-album-button">
                Create Your First Album
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {folders.map((folder, index) => (
              <Grid  key={folder.albumId}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card className="album-card" onClick={() => openFolder(folder.albumId)}>
                    {showCheckboxes && (
                      <Box className="album-checkbox">
                        <Checkbox
                          checked={selectedAlbums.includes(folder.albumId)}
                          onChange={() => onToggleSelect(folder.albumId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>
                    )}

                    <Box className="album-image-container">
                      <div className="album-glow"></div>
                      <FolderIcon className="album-icon" />
                    </Box>

                    <CardContent className="album-content">
                      {editingFolderId === folder.albumId ? (
                        <Box className="album-edit-form" onClick={(e) => e.stopPropagation()}>
                          <TextField
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Album Title"
                            className="album-edit-title"
                          />
                          <TextField
                            value={currentDescription}
                            onChange={(e) => setCurrentDescription(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                          />
                        </Box>
                      ) : (
                        <Box className="album-info">
                          <Typography variant="h6" className="album-title">
                            {folder.title}
                          </Typography>
                          {folder.description && (
                            <Typography variant="body2" className="album-description">
                              {folder.description}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>

                    <CardActions className="album-actions">
                      {editingFolderId === folder.albumId ? (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => saveTitle(folder.albumId, e)}
                            className="action-button save-button"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEditing()
                            }}
                            className="action-button cancel-button"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => startEditing(folder, e)}
                            className="action-button edit-button"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDeleteClick(folder.albumId, e)}
                            className="action-button delete-button"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            className: "delete-dialog",
          }}
        >
          <DialogTitle>Delete Album</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this album? This action cannot be undone and all photos in this album will
              be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteFolder} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default FolderList
