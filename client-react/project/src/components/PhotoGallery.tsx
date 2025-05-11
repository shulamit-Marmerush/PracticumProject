// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const PhotoGallery: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
//     const { albumId } = useParams<{ albumId: string }>();
//     interface Photo {
//         photoId: number;
//         albumId: number;
//         title: string;
//         url: string;
//     }
    
//     const [photos, setPhotos] = useState<Photo[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
//     const [newTitle, setNewTitle] = useState<string>('');
//     const [newUrl, setNewUrl] = useState<string>(''); // הוסף state חדש ל-URL אם צריך

//     useEffect(() => {
//         const fetchPhotos = async () => {
//             try {
//                 const response = await axios.get(`https://localhost:7259/api/photo`);
//                 setPhotos(response.data);
//             } catch (err) {
//                 setError('שגיאה בטעינת התמונות');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPhotos();
//     }, [albumId]);

//     const startEditing = async(photo: any) => {
//         const photoDetails = await fetchPhotoDetails(photo.photoId);
//         if (photoDetails) {
//             setEditingPhotoId(photoDetails.photoId);
//             setNewTitle(photoDetails.title);
//             // אתה יכול לשמור גם את שאר הפרמטרים אם צריך
//             // לדוגמה, אם תרצה לשמור את ה-URL:
//             setNewUrl(photoDetails.url); // הוסף state חדש ל-URL אם צריך
//         }
//     };
//     const fetchPhotoDetails = async (photoId: number) => {
//         try {
//             const response = await axios.get(`https://localhost:7259/api/photo/${photoId}`);
//             return response.data; // מחזיר את פרטי התמונה
//         } catch (err) {
//             setError('שגיאה בטעינת פרטי התמונה');
//             return null;
//         }
//     };
    
//     const saveTitle = async (photoId: number) => {
//         try {
//             const updatedPhoto = {
//                 photoId: photoId,
//                 albumId: albumId, // אם אתה צריך לשלוח גם את ה-albumId
//                 title: newTitle,
//                 url: newUrl // הוסף את ה-URL המעודכן אם יש צורך
//             };
            
//             await axios.put(`https://localhost:7259/api/photo/${photoId}`, updatedPhoto);
//             setPhotos(prevPhotos => 
//                 prevPhotos.map(photo => 
//                     photo.photoId === photoId ? { ...photo, title: newTitle, url: newUrl } : photo
//                 )
               
//             );
//             setEditingPhotoId(null);
//             setNewTitle('');
//             // אם יש צורך, אפס גם את ה-URL
//             setNewUrl(''); // אם יש לך state ל-URL
//             alert('תמונה עודכנה בהצלחה!');
//         } catch (err) {
//             setError('שגיאה בעדכון התמונה');
//         }
//     };

//     const deletePhoto = async (photoId: number) => {
//         try {
//             await axios.delete(`https://localhost:7259/api/photo/${photoId}`);
//             setPhotos(prevPhotos => prevPhotos.filter(photo => photo.photoId !== photoId));
//         } catch (err) {
//             setError('שגיאה במחיקת התמונה');
//         }
//     };

//     if (loading) return <div>טוען תמונות...</div>;
//     if (error) return <div>{error}</div>;

//     const albumPhotos = photos.filter((photo: any) => photo.albumId === Number(albumId));

//     return (
//         <div className="photo-gallery-modal">
//             <h2>תמונות מהאלבום</h2>
//             <p>אלבום ID: {albumId}</p>
//             <div className="photo-gallery">
//                 <button onClick={onClose}>סגור</button>
//                 {albumPhotos.length === 0 ? (
//                     <div>לא נמצאו תמונות באלבום זה</div>
//                 ) : (
//                     albumPhotos.map((photo: any) => (
//                         <div key={photo.photoId} className="photo-item">
//                            <img src={photo.url} alt={photo.title} style={{ maxWidth: '100%', height: '100px' }} />
               

//                             {editingPhotoId === photo.photoId ? (
//                                 <>
//                                     <input 
//                                         value={newTitle} 
//                                         onChange={(e) => setNewTitle(e.target.value)} 
//                                     />
//                                     <button onClick={() => saveTitle(photo.photoId)}>שמור</button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <h3>{photo.title}</h3>
//                                     <button onClick={() => startEditing(photo)}>עריכה</button>
//                                     <button onClick={() => deletePhoto(photo.photoId)}>מחיקה</button>
//                                 </>
//                             )}
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PhotoGallery;
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import HomeIcon from "@mui/icons-material/Home"
import "../styles/PhotoGallery.css"

interface Photo {
  photoId: number
  albumId: number
  title: string
  url: string
}

const PhotoGallery: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { albumId } = useParams<{ albumId: string }>()
  const navigate = useNavigate()

  const [photos, setPhotos] = useState<Photo[]>([])
  const [albumTitle, setAlbumTitle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState<string>("")
  const [newUrl, setNewUrl] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("User is not authenticated. Please log in.")
          setLoading(false)
          return
        }

        const albumResponse = await axios.get(`https://localhost:7259/api/album/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setAlbumTitle(albumResponse.data.title)

        const photosResponse = await axios.get(`https://localhost:7259/api/photo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const albumPhotos = photosResponse.data.filter((photo: Photo) => photo.albumId === Number(albumId))

        setPhotos(albumPhotos)
        setLoading(false)
      } catch (err) {
        setError("Error loading photos")
        setLoading(false)
      }
    }

    fetchAlbumDetails()
  }, [albumId])

  const startEditing = async (photo: Photo) => {
    const photoDetails = await fetchPhotoDetails(photo.photoId)
    if (photoDetails) {
      setEditingPhotoId(photoDetails.photoId)
      setNewTitle(photoDetails.title)
      setNewUrl(photoDetails.url)
    }
  }

  const fetchPhotoDetails = async (photoId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://localhost:7259/api/photo/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (err) {
      setError("Error loading photo details")
      return null
    }
  }

  const saveTitle = async (photoId: number) => {
    try {
      const token = localStorage.getItem("token")
      const updatedPhoto = {
        photoId: photoId,
        albumId: Number(albumId),
        title: newTitle,
        url: newUrl,
      }

      await axios.put(`https://localhost:7259/api/photo/${photoId}`, updatedPhoto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => (photo.photoId === photoId ? { ...photo, title: newTitle, url: newUrl } : photo)),
      )

      setEditingPhotoId(null)
      setNewTitle("")
      setNewUrl("")
    } catch (err) {
      setError("Error updating photo")
    }
  }

  const handleDeleteClick = (photoId: number) => {
    setPhotoToDelete(photoId)
    setDeleteDialogOpen(true)
  }

  const deletePhoto = async () => {
    if (!photoToDelete) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`https://localhost:7259/api/photo/${photoToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.photoId !== photoToDelete))
      setDeleteDialogOpen(false)
      setPhotoToDelete(null)
    } catch (err) {
      setError("Error deleting photo")
    }
  }

  const cancelEditing = () => {
    setEditingPhotoId(null)
    setNewTitle("")
    setNewUrl("")
  }

  if (loading)
    return (
      <Box className="loading-container">
        <CircularProgress size={60} thickness={4} className="loading-spinner" />
      </Box>
    )

  return (
    <Box className="gallery-container">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
        <MuiLink component={Link} to="/" className="breadcrumb-link">
          <HomeIcon className="breadcrumb-icon" />
          Home
        </MuiLink>
        <MuiLink component={Link} to="/Albums" className="breadcrumb-link">
          Albums
        </MuiLink>
        <Typography color="text.primary">{albumTitle}</Typography>
      </Breadcrumbs>

      <Box className="gallery-header">
        <Typography variant="h4" component="h1" className="gallery-title">
          {albumTitle}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/Albums")}
          className="back-button"
        >
          Back to Albums
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="gallery-alert">
          {error}
        </Alert>
      )}

      {photos.length === 0 ? (
        <Box className="empty-gallery">
          <Typography variant="h6" className="empty-gallery-text">
            No photos found in this album
          </Typography>
          <Button variant="contained" component={Link} to="/UploadFile" className="upload-photos-button">
            Upload Photos
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid  key={photo.photoId}>
              <Card className="photo-card">
                <CardMedia component="img" height="200" image={photo.url} alt={photo.title} className="photo-image" />

                <Box className="photo-content">
                  {editingPhotoId === photo.photoId ? (
                    <Box>
                      <TextField
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        label="Photo Title"
                        className="photo-edit-title"
                      />
                    </Box>
                  ) : (
                    <Typography variant="subtitle1" className="photo-title">
                      {photo.title}
                    </Typography>
                  )}
                </Box>

                <CardActions className="photo-actions">
                  {editingPhotoId === photo.photoId ? (
                    <>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => saveTitle(photo.photoId)}
                        className="action-button save-button"
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={cancelEditing}
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
                        onClick={() => startEditing(photo)}
                        className="action-button edit-button"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(photo.photoId)}
                        className="action-button delete-button"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Photo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this photo? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deletePhoto} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PhotoGallery

