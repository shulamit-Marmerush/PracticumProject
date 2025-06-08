"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  CircularProgress,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Fade,
  Container,
  InputAdornment,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate } from "react-router-dom"
import "../styles/FolderList.css"

// קומפוננטה מעודכנת לאיקון תיקיה עם הצבעים שלך
interface GradientFolderIconProps {
  className?: string
  size?: number
}

const GradientFolderIcon: React.FC<GradientFolderIconProps> = ({ className, size = 120 }: GradientFolderIconProps) => {
  const uniqueId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className ? className : "folder-icon"}
      style={{ filter: "drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3))" }}
    >
      <defs>
        <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#c084fc", stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: "#f9a8d4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z"
        fill={`url(#${uniqueId})`}
        stroke="none"
      />
    </svg>
  )
}

interface IFolder {
  albumId: number
  title: string
  userId: number
  description: string
}

interface FolderListProps {
  showCheckboxes: boolean
  selectedAlbums: number[]
  onToggleSelect: (albumId: number) => void
}

const FolderList: React.FC<FolderListProps> = () => {
  const [folders, setFolders] = useState<IFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState<string>("")
  const [currentDescription, setCurrentDescription] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate()

  const filteredFolders: IFolder[] = folders.filter(
    (folder) =>
      folder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        const response = await axios.get("https://practicumproject-server.onrender.com/api/album", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userFolders = response.data.filter((folder: IFolder) => {
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
      await axios.delete(`https://practicumproject-server.onrender.com/api/album/${folderToDelete}`, {
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

  const startEditing = (folder: IFolder, event: React.MouseEvent) => {
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
        `https://practicumproject-server.onrender.com/api/album/${folderId}`,
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
      <div className="albums-page">
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <CircularProgress size={60} sx={{ color: "#8B5CF6" }} />
          </Box>
        </Container>
      </div>
    )

  return (
    <div className="albums-page">
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        {/* Header */}
        <div className="albums-header">
          <div className="albums-header-content">
            <Typography variant="h3" className="albums-title">
              My Albums
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/AddAlbum")}
              className="add-album-btn"
            >
              Add New Album
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="search-section">
          <TextField
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="search-icon" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        {/* Albums Grid */}
        {folders.length === 0 ? (
          <Fade in={true} timeout={1000}>
            <div className="empty-state">
              <GradientFolderIcon size={140} className="empty-icon" />
              <Typography variant="h4" className="empty-title">
                No albums yet
              </Typography>
              <Typography variant="h6" className="empty-subtitle">
                Create your first album to start organizing your photos
              </Typography>
              <Button variant="contained" onClick={() => navigate("/AddAlbum")} className="create-first-btn">
                Create Your First Album
              </Button>
            </div>
          </Fade>
        ) : (
          <div className="albums-grid">
            {filteredFolders.map((folder, index) => (
              <Fade key={folder.albumId} in={true} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="album-item">
                  {/* Folder Icon */}
                  <div className="folder-icon-wrapper" onClick={() => openFolder(folder.albumId)}>
                    <GradientFolderIcon size={120} />
                  </div>

                  {/* Album Info */}
                  <div className="album-info">
                    {editingFolderId === folder.albumId ? (
                      <div className="edit-form">
                        <TextField
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Album Title"
                          className="edit-title-field"
                        />
                        <TextField
                          value={currentDescription}
                          onChange={(e) => setCurrentDescription(e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Description"
                          className="edit-desc-field"
                        />
                      </div>
                    ) : (
                      <>
                        <Typography className="album-name" onClick={() => openFolder(folder.albumId)}>
                          {folder.title}
                        </Typography>
                        <Typography className="album-count">{Math.floor(Math.random() * 50) + 1}</Typography>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="album-actions">
                    {editingFolderId === folder.albumId ? (
                      <>
                        <IconButton onClick={(e) => saveTitle(folder.albumId, e)} className="action-btn save-btn">
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelEditing()
                          }}
                          className="action-btn cancel-btn"
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={(e) => startEditing(folder, e)} className="action-btn edit-btn">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleDeleteClick(folder.albumId, e)}
                          className="action-btn delete-btn"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            className: "delete-dialog",
          }}
        >
          <DialogTitle className="dialog-title">Delete Album</DialogTitle>
          <DialogContent>
            <DialogContentText className="dialog-text">
              Are you sure you want to delete this album? This action cannot be undone and all photos in this album will
              be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setDeleteDialogOpen(false)} className="dialog-cancel-btn">
              Cancel
            </Button>
            <Button onClick={deleteFolder} variant="contained" className="dialog-delete-btn">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  )
}

export default FolderList
