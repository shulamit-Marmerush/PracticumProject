"use client"

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
  InputAdornment,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import FolderIcon from "@mui/icons-material/Folder"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import { useNavigate } from "react-router-dom"

const GradientBackground = styled(Box)(({  }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1A0B2E 0%, #2C0F42 50%, #1A0B2E 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}))

const AlbumCard = styled(Card)(({ }) => ({
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
}))

const AlbumIcon = styled(Box)(({ }) => ({
  height: 160,
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
  },
  "& svg": {
    fontSize: 64,
    color: "white",
    zIndex: 1,
    position: "relative",
  },
}))

const HeaderCard = styled(Paper)(({  }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "32px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}))

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

const FolderList: React.FC<FolderListProps> = ({
  showCheckboxes,
  selectedAlbums,
  onToggleSelect,
}) => {
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
        const response = await axios.get("https://localhost:7259/api/album", {
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
      <GradientBackground>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <CircularProgress size={60} sx={{ color: "#8B5CF6" }} />
          </Box>
        </Container>
      </GradientBackground>
    )

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <HeaderCard elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PhotoLibraryIcon sx={{ fontSize: 40, color: "#8B5CF6" }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Your Albums
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Organize and manage your photo collections
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/AddAlbum")}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 35px rgba(139, 92, 246, 0.4)",
                },
              }}
            >
              Create New Album
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8B5CF6" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8b5cf6",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
          />
        </HeaderCard>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </Alert>
        )}

        {folders.length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <FolderIcon sx={{ fontSize: 80, color: "#8B5CF6", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "white", mb: 2 }}>
                No albums yet
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4 }}>
                Create your first album to start organizing your photos
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/AddAlbum")}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 35px rgba(139, 92, 246, 0.4)",
                  },
                }}
              >
                Create Your First Album
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {filteredFolders.map((folder, index) => (
              <Grid  key={folder.albumId}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <AlbumCard onClick={() => openFolder(folder.albumId)}>
                    {showCheckboxes && (
                      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
                        <Checkbox
                          checked={selectedAlbums.includes(folder.albumId)}
                          onChange={() => onToggleSelect(folder.albumId)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: "white",
                            background: "rgba(139, 92, 246, 0.2)",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}

                    <AlbumIcon>
                      <FolderIcon />
                    </AlbumIcon>

                    <CardContent sx={{ p: 3 }}>
                      {editingFolderId === folder.albumId ? (
                        <Box onClick={(e) => e.stopPropagation()}>
                          <TextField
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Album Title"
                            sx={{
                              mb: 2,
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "8px",
                                color: "white",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "rgba(255, 255, 255, 0.2)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                            }}
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "8px",
                                color: "white",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "rgba(255, 255, 255, 0.2)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                            }}
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "white", mb: 1 }}>
                            {folder.title}
                          </Typography>
                          {folder.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {folder.description}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, justifyContent: "flex-end" }}>
                      {editingFolderId === folder.albumId ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => saveTitle(folder.albumId, e)}
                            sx={{
                              margin: "0 0.25rem",
                              transition: "all 0.3s ease",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #10b981, #059669)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(135deg, #059669, #047857)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEditing()
                            }}
                            sx={{
                              margin: "0 0.25rem",
                              transition: "all 0.3s ease",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #ef4444, #dc2626)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => startEditing(folder, e)}
                            sx={{
                              margin: "0 0.25rem",
                              transition: "all 0.3s ease",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteClick(folder.albumId, e)}
                            sx={{
                              margin: "0 0.25rem",
                              transition: "all 0.3s ease",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #ef4444, #dc2626)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </CardActions>
                  </AlbumCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(26, 11, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "white" }}>Delete Album</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Are you sure you want to delete this album? This action cannot be undone and all photos in this album will
              be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteFolder}
              variant="contained"
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </GradientBackground>
  )
}

export default FolderList