"use client"

import { useState } from "react"
import {
  Box, Button, TextField, Typography, CircularProgress, Alert, Fade, 
  Container, Paper, Divider, Snackbar, Card, CardMedia, CardActions, 
  CardContent, Grid, Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  PhotoCamera as PhotoCameraIcon, Download as DownloadIcon, 
  Brush as BrushIcon, Lightbulb as LightbulbIcon, AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material"

import '../styles/AiImageGenerator.css';

// --- Styled Components (עיצוב מקורי מלא) ---
const GradientBackground = styled(Box)(() => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1A0B2E 0%, #2C0F42 50%, #1A0B2E 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}))

const HeaderCard = styled(Paper)(() => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "32px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}))

const MainCard = styled(Paper)(() => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "40px",
  marginBottom: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}))

const ImagePreviewCard = styled(Card)(() => ({
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" },
}))

const GenerateButton = styled(Button)(() => ({
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { background: "linear-gradient(135deg, #7c3aed, #db2777)" },
}))

const InspirationChip = styled(Chip)(() => ({
  borderRadius: "16px", margin: "4px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "white",
  "&:hover": { background: "rgba(139, 92, 246, 0.2)" }
}))

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

  const generateImage = async (): Promise<void> => {
    if (!prompt) return
    setLoading(true)
    setError("")
    try {
      const token = import.meta.env.VITE_OPENROUTER_TOKEN;
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-1.1-pro", // מודל מצוין לתמונות ב-OpenRouter
          messages: [{ role: "user", content: `Generate an image: ${prompt}` }]
        }),
      })

      const data = await response.json()
      // בדרך כלל ב-Flux דרך OpenRouter מקבלים קישור ישיר או תמונה ב-Base64
      if (data.choices?.[0]?.message?.content) {
        setImageUrl(data.choices[0].message.content)
      }
      setSnackbarOpen(true)
    } catch (err) {
      setError("Error generating image.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <HeaderCard elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <BrushIcon sx={{ fontSize: 40, color: "#8B5CF6", mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)", WebkitBackgroundClip: "text", color: "transparent" }}>
              AI Image Generator
            </Typography>
          </Box>
        </HeaderCard>

        <MainCard elevation={0}>
          <TextField fullWidth multiline rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your image..." 
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(96, 158, 128, 0.23)", color: "white" } }} />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GenerateButton variant="contained" onClick={generateImage} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
            </GenerateButton>
          </Box>
        </MainCard>

        {imageUrl && (
          <Fade in timeout={800}>
            <Box sx={{ mt: 4, mb: 6, display: "flex", justifyContent: "center" }}>
              <ImagePreviewCard sx={{ width: 500 }}>
                <CardMedia component="img" image={imageUrl} alt="AI Result" />
              </ImagePreviewCard>
            </Box>
          </Fade>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message="Action completed!" />
      </Container>
    </GradientBackground>
  )
}
