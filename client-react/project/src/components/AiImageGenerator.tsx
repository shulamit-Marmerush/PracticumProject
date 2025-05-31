"use client"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Container,
  Paper,
  Divider,
  Snackbar,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Grid,
  Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  PhotoCamera as PhotoCameraIcon,
  Download as DownloadIcon,
  Brush as BrushIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material"

import '../styles/AiImageGenerator.css'; // Import the CSS file

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

const HeaderCard = styled(Paper)(({ }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "32px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}))

const MainCard = styled(Paper)(({ }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "40px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  position: "relative",
  overflow: "hidden",
}))

const ImagePreviewCard = styled(Card)(({ }) => ({
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
}))

const GenerateButton = styled(Button)(({}) => ({
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #7c3aed, #db2777)",
    transform: "translateY(-3px)",
    boxShadow: "0 15px 35px rgba(139, 92, 246, 0.4)",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "all 0.6s ease",
  },
  "&:hover:before": {
    left: "100%",
  },
}))

const InspirationChip = styled(Chip)(({}) => ({
  borderRadius: "16px",
  margin: "4px",
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
    transform: "translateY(-2px)",
  },
}))

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>("")

  const inspirationExamples: string[] = [
    "Mountain landscape with lake at sunrise",
    "Portrait in Renaissance style",
    "Tel Aviv street in the rain",
    "Stars and galaxies",
    "Colorful flowers in a vase",
    "Cat with magic hat",
    "Futuristic city skyline",
    "Abstract geometric patterns",
  ]

  const handleInspirationClick = (example: string): void => {
    setPrompt(example)
  }

  const generateImage = async (): Promise<void> => {
    if (!prompt) return

    setLoading(true)
    setError("")
    try {
      const token = import.meta.env.VITE_HUGGINGFACE_TOKEN; // עדכון כאן לשימוש במשתנה סביבתי של Vite
      // עדכון כאן לשימוש במשתנה סביבתי של Next.js
      if (!token) {
        console.error("Hugging Face token is not set.")
        setError("Hugging Face token is not set.")
        setLoading(false)
        return
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        console.error("Error from model:", data)
        setError(data.error || "An unexpected error occurred.")
        setLoading(false)
        return
      }

      const blob = await response.blob()
      const imageObjectUrl = URL.createObjectURL(blob)
      setImageUrl(imageObjectUrl)

      setSnackbarMessage("Image generated successfully!")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("General error:", error)
      setError("An error occurred while generating the image.")
    }
    setLoading(false)
  }

  const downloadImage = (): void => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "ai-generated-image.png"
    link.click()

    setSnackbarMessage("Image downloaded successfully!")
    setSnackbarOpen(true)
  }

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <HeaderCard elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <BrushIcon sx={{ fontSize: 40, color: "#8B5CF6", mr: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textAlign: "center",
              }}
            >
              AI Image Generator
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Describe the image you want, and our AI will create it for you in seconds. Use detailed descriptions for the
            best results.
          </Typography>
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
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <MainCard elevation={0}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
              <LightbulbIcon sx={{ color: "#8B5CF6", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Inspiration Gallery
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: "700px",
                mx: "auto",
                mb: 4,
              }}
            >
              {inspirationExamples.map((example, index) => (
                <InspirationChip
                  key={index}
                  label={example}
                  onClick={() => handleInspirationClick(example)}
                  clickable
                />
              ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 4 }} />

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              multiline
              rows={3}
              sx={{
                mb: 3,
                maxWidth: "600px",
                mx: "auto",
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

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <GenerateButton
                variant="contained"
                onClick={generateImage}
                disabled={loading || !prompt}
                startIcon={loading ? null : <PhotoCameraIcon />}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </GenerateButton>
            </Box>
          </Box>
        </MainCard>

        {imageUrl && (
          <Fade in timeout={800}>
            <Box sx={{ mt: 4, mb: 6 }}>
              <Grid container spacing={4} justifyContent="center">
                <Grid >
                  <ImagePreviewCard>
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt="AI Generated Image"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "500px",
                        objectFit: "contain",
                      }}
                    />
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
                        {prompt}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1 }}>
                        Generated by AI on {new Date().toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadImage}
                        sx={{
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                          textTransform: "none",
                          "&:hover": {
                            background: "linear-gradient(135deg, #7c3aed, #db2777)",
                          },
                        }}
                      >
                        Download Image
                      </Button>
                    </CardActions>
                  </ImagePreviewCard>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {!imageUrl && (
          <Box sx={{ mt: 8, mb: 5 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 4,
                fontWeight: 600,
                color: "white",
                textAlign: "center",
              }}
            >
              How it works?
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid >
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AutoAwesomeIcon sx={{ color: "#8B5CF6", mr: 1 }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                      1. Describe
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    The more detailed your description, the more accurate the result. You can specify art style, colors,
                    mood and more.
                  </Typography>
                </Paper>
              </Grid>
              <Grid >
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhotoCameraIcon sx={{ color: "#8B5CF6", mr: 1 }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                      2. Generate
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Our advanced AI will transform your description into a high-quality visual image within seconds.
                  </Typography>
                </Paper>
              </Grid>
              <Grid >
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <DownloadIcon sx={{ color: "#8B5CF6", mr: 1 }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                      3. Download
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Your image is ready! Download it to your computer or share it with friends on social media.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Container>
    </GradientBackground>
  )
}
