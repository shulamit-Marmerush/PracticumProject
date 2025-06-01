import * as React from "react"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
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
  Container,
  Paper,
  InputAdornment,
  Backdrop,
  Fade,
  Zoom,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import '../styles/PhotoGallery.css'; // Import the CSS file

const AnalysisResultCard = styled(Paper)(({ theme }) => ({
  background: "rgba(139, 92, 246, 0.08)",
  borderRadius: "16px",
  padding: theme.spacing(3),
  border: "1px solid rgba(139, 92, 246, 0.2)",
  boxShadow: "0 4px 24px rgba(139, 92, 246, 0.1)",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const GradientBackground = styled(Box)(({  }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1A0B2E 0%, #2C0F42 50%, #1A0B2E 100%)",
  position: "relative",
}));

const PhotoCard = styled(Card)(({ }) => ({
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    "& .photo-overlay": {
      opacity: 1,
    },
  },
}));

const PhotoOverlay = styled(Box)(({ }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  opacity: 0,
  transition: "all 0.3s ease",
  zIndex: 2,
}));

const HeaderCard = styled(Paper)(({ }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "32px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}));

interface Photo {
  photoId: number;
  albumId: number;
  title: string;
  url: string;
}

const PhotoGallery: React.FC<{ onClose: () => void }> = ({ }) => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (searchTerm) {
      setFilteredPhotos(photos.filter((photo) => photo.title.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredPhotos(photos);
    }
  }, [searchTerm, photos]);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const albumResponse = await axios.get(`https://localhost:7259/api/album/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAlbumTitle(albumResponse.data.title);

        const photosResponse = await axios.get(`https://localhost:7259/api/photo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const albumPhotos = photosResponse.data.filter((photo: Photo) => photo.albumId === Number(albumId));

        setPhotos(albumPhotos);
        setFilteredPhotos(albumPhotos);
        setLoading(false);
      } catch (err) {
        setError("Error loading photos");
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    } else {
      setCurrentPhotoIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    }
  };

  const downloadPhoto = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setSnackbarMessage("Photo downloaded successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error downloading photo:", error);
      setSnackbarMessage("Error downloading photo");
      setSnackbarOpen(true);
    }
  };

  const analyzePhotoTitle = async (title: string) => {
    try {
      const response = await axios.post("https://localhost:7259/api/TextGenerator/generate-description", {
        GeneratedText: title,
      });
      setAnalysisResult(response.data.description || "Analysis completed successfully!");
      setAnalysisOpen(true);
    } catch (error) {
      setAnalysisResult("Error analyzing photo title. Please try again.");
      setAnalysisOpen(true);
    }
  };


  // const fetchPhotoDetails = async (photoId: number) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`https://localhost:7259/api/photo/${photoId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (err) {
  //     setError("Error loading photo details");
  //     return null;
  //   }
  // };

  // const _saveTitle = async (photoId: number) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const updatedPhoto = {
  //       photoId: photoId,
  //       albumId: Number(albumId),
  //       title: newTitle,
  //       url: newUrl,
  //     };

  //     await axios.put(`https://localhost:7259/api/photo/${photoId}`, updatedPhoto, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     setPhotos((prevPhotos) =>
  //       prevPhotos.map((photo) => (photo.photoId === photoId ? { ...photo, title: newTitle, url: newUrl } : photo)),
  //     );

  //     setEditingPhotoId(null);
  //     setNewTitle("");
  //     setNewUrl("");
  //     setSnackbarMessage("Photo updated successfully!");
  //     setSnackbarOpen(true);
  //   } catch (err) {
  //     setError("Error updating photo");
  //   }
  // };

  // const _handleDeleteClick = (photoId: number) => {
  //   setPhotoToDelete(photoId);
  //   setDeleteDialogOpen(true);
  // };

  const deletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7259/api/photo/${photoToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.photoId !== photoToDelete));
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
      setSnackbarMessage("Photo deleted successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Error deleting photo");
    }
  };

  // const _cancelEditing = () => {
  //   setEditingPhotoId(null);
  //   setNewTitle("");
  //   setNewUrl("");
  // };

  if (loading)
    return (
      <GradientBackground>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <CircularProgress size={60} sx={{ color: "#8B5CF6" }} />
          </Box>
        </Container>
      </GradientBackground>
    );

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            mb: 3,
            "& .MuiBreadcrumbs-separator": { color: "white" },
            "& a": { color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" },
            "& a:hover": { color: "white" },
          }}
        >
          <MuiLink component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeIcon sx={{ fontSize: 20 }} />
            Home
          </MuiLink>
          <MuiLink component={Link} to="/Albums">
            Albums
          </MuiLink>
          <Typography sx={{ color: "white", fontWeight: "bold" }}>{albumTitle}</Typography>
        </Breadcrumbs>

        <HeaderCard elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
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
              {albumTitle}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/Albums")}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#8B5CF6",
                  background: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              Back to Albums
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search photos..."
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
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.08)",
                },
                "&.Mui-focused": {
                  background: "rgba(255, 255, 255, 0.08)",
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

        {filteredPhotos.length === 0 ? (
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
              <SearchIcon sx={{ fontSize: 80, color: "#8B5CF6", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "white", mb: 2 }}>
                {searchTerm ? "No photos found" : "No photos in this album"}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4 }}>
                {searchTerm ? "Try adjusting your search terms" : "Upload some photos to get started"}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  component={Link}
                  to="/UploadFile"
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    },
                  }}
                >
                  Upload Photos
                </Button>
              )}
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {filteredPhotos.map((photo, index) => (
              <Grid  key={photo.photoId}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <PhotoCard onClick={() => openLightbox(index)}>
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        image={photo.url}
                        alt={photo.title}
                        className="photo-image" // הוסף את המחלקה כאן
                      />
                      <PhotoOverlay className="photo-overlay">
                        <IconButton
                          sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "#8B5CF6",
                            "&:hover": { background: "white" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPhoto(photo.url, photo.title);
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "#8B5CF6",
                            "&:hover": { background: "white" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            analyzePhotoTitle(photo.title);
                          }}
                        >
                          <AnalyticsIcon />
                        </IconButton>
                      </PhotoOverlay>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "white" }}>
                        {photo.title}
                      </Typography>
                    </Box>
                  </PhotoCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Analysis Result Dialog */}
        <Dialog
          open={analysisOpen}
          onClose={() => setAnalysisOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(26, 11, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
            Photo Analysis Result
          </DialogTitle>
          <DialogContent>
            <AnalysisResultCard>
              <Typography variant="body1" sx={{ color: "white", lineHeight: 1.6 }}>
                {analysisResult}
              </Typography>
            </AnalysisResultCard>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: "center" }}>
            <Button
              onClick={() => setAnalysisOpen(false)}
              variant="contained"
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                textTransform: "none",
                px: 4,
                "&:hover": {
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Lightbox Dialog */}
        <Dialog
          open={lightboxOpen}
          onClose={closeLightbox}
          maxWidth={false}
          fullWidth
          PaperProps={{
            sx: {
              background: "transparent",
              boxShadow: "none",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          }}
        >
          <Backdrop open={lightboxOpen} sx={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                p: 4,
              }}
              onClick={closeLightbox}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  color: "white",
                  background: "rgba(0, 0, 0, 0.5)",
                  "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                  zIndex: 3,
                }}
                onClick={closeLightbox}
              >
                <CloseIcon />
              </IconButton>

              {filteredPhotos.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: "absolute",
                      left: 20,
                      color: "white",
                      background: "rgba(0, 0, 0, 0.5)",
                      "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                      zIndex: 3,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto("prev");
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>

                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 20,
                      color: "white",
                      background: "rgba(0, 0, 0, 0.5)",
                      "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                      zIndex: 3,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto("next");
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </>
              )}

              <Box
                component="img"
                src={filteredPhotos[currentPhotoIndex]?.url}
                alt={filteredPhotos[currentPhotoIndex]?.title}
                sx={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                onClick={(e) => e.stopPropagation()}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  px: 3,
                  py: 1,
                  borderRadius: "20px",
                  zIndex: 3,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {filteredPhotos[currentPhotoIndex]?.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {currentPhotoIndex + 1} of {filteredPhotos.length}
                </Typography>
              </Box>
            </Box>
          </Backdrop>
        </Dialog>

        {/* Delete Confirmation Dialog */}
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
          <DialogTitle sx={{ fontWeight: "bold", color: "white" }}>Delete Photo</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Are you sure you want to delete this photo? This action cannot be undone.
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
              onClick={deletePhoto}
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Container>
    </GradientBackground>
  );
};

export default PhotoGallery;
