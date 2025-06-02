"use client"

import * as React from "react"
import { useRef, useState, useEffect } from "react"
import "../styles/CollageCreator.css"
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  CircularProgress,
  Grid,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material"
import { Upload, ImageIcon, Trash2, Palette, Type, Download, Grid3X3, Sparkles } from "lucide-react"

export default function SimpleCollageCreator() {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [layout, setLayout] = useState<string>("grid")
  const [backgroundColor, setBackgroundColor] = useState<string>("#1a0b2e")
  const [borderColor, setBorderColor] = useState<string>("#8b5cf6")
  const [borderWidth, setBorderWidth] = useState<number>(5)
  const [text, setText] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setLoading(true)
    const newImages: HTMLImageElement[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          newImages.push(img)
          if (newImages.length === files.length) {
            setImages([...images, ...newImages])
            setLoading(false)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const removeSelectedImages = () => {
    const sortedIndices = [...selectedImages].sort((a, b) => b - a)
    const newImages = [...images]

    sortedIndices.forEach((index) => {
      newImages.splice(index, 1)
    })

    setImages(newImages)
    setSelectedImages([])
  }

  const drawCollage = () => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let cols: number, rows: number, cellSize: number

    if (layout === "grid") {
      cols = Math.ceil(Math.sqrt(images.length))
      rows = Math.ceil(images.length / cols)
      cellSize = 200
    } else if (layout === "horizontal") {
      cols = images.length
      rows = 1
      cellSize = 150
    } else {
      cols = 1
      rows = images.length
      cellSize = 150
    }

    const padding = borderWidth
    const canvasWidth = cols * (cellSize + padding) + padding
    const canvasHeight = rows * (cellSize + padding) + padding + (text ? 60 : 0)

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    images.forEach((img, index) => {
      const col = layout === "vertical" ? 0 : index % cols
      const row = layout === "horizontal" ? 0 : Math.floor(index / cols)

      const x = col * (cellSize + padding) + padding
      const y = row * (cellSize + padding) + padding

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor
        ctx.fillRect(x - borderWidth, y - borderWidth, cellSize + borderWidth * 2, cellSize + borderWidth * 2)
      }

      ctx.drawImage(img, x, y, cellSize, cellSize)
    })

    if (text) {
      ctx.fillStyle = textColor
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.fillText(text, canvas.width / 2, canvasHeight - 20)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "collage.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  useEffect(() => {
    if (images.length > 0) {
      drawCollage()
    }
  }, [images, layout, backgroundColor, borderColor, borderWidth, text, textColor])

  return (
    <Box className="collage-page">
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <Paper elevation={0} className="collage-header-card">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Sparkles style={{ fontSize: 40, color: "#8B5CF6" }} />
            <Box>
              <Typography variant="h4" component="h1" className="collage-title">
                Create Photo Collage
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Upload photos, customize your layout, and create beautiful collages
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid >
            <Card className="control-card">
              <CardContent>
                <Typography variant="h6" className="control-section-title">
                  <Upload style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Upload Photos
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  startIcon={<Upload />}
                  className="upload-button"
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Select Photos"}
                  <input type="file" multiple accept="image/*" onChange={handleUpload} hidden />
                </Button>

                {images.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}>
                      Uploaded Images ({images.length})
                    </Typography>
                    <Box className="thumbnails-container">
                      {images.map((img, index) => (
                        <Tooltip title="Click to select/deselect" key={index}>
                          <Box
                            component="img"
                            src={img.src}
                            alt={`Image ${index + 1}`}
                            className={`thumbnail ${selectedImages.includes(index) ? "selected" : ""}`}
                            onClick={() => toggleImageSelection(index)}
                          />
                        </Tooltip>
                      ))}
                    </Box>

                    {selectedImages.length > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 />}
                        onClick={removeSelectedImages}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Remove Selected ({selectedImages.length})
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {images.length > 0 && (
              <Card className="control-card" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" className="control-section-title">
                    <Palette style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Customize
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Layout</InputLabel>
                    <Select
                      value={layout}
                      onChange={(e) => setLayout(e.target.value)}
                      variant="outlined"
                      className="control-select"
                    >
                      <MenuItem value="grid">Grid</MenuItem>
                      <MenuItem value="horizontal">Horizontal</MenuItem>
                      <MenuItem value="vertical">Vertical</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                    Background Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        backgroundColor: backgroundColor,
                        mr: 2,
                      }}
                    />
                    <TextField
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      fullWidth
                      className="color-input"
                    />
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                    Border Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        backgroundColor: borderColor,
                        mr: 2,
                      }}
                    />
                    <TextField
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      fullWidth
                      className="color-input"
                    />
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                    Border Width: {borderWidth}px
                  </Typography>
                  <Slider
                    value={borderWidth}
                    onChange={(_, value) => setBorderWidth(value as number)}
                    min={0}
                    max={20}
                    step={1}
                    className="control-slider"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                    <Type style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Add Text
                  </Typography>
                  <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text for your collage"
                    fullWidth
                    className="text-input"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                    Text Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        backgroundColor: textColor,
                        mr: 2,
                      }}
                    />
                    <TextField
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      fullWidth
                      className="color-input"
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid >
            {images.length > 0 ? (
              <Card className="canvas-card">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "white", fontWeight: 600 }}>
                    Preview
                  </Typography>
                  <Box className="canvas-container">
                    <canvas ref={canvasRef} className="canvas" />
                  </Box>
                  <Box className="actions-container">
                    <Button
                      variant="contained"
                      startIcon={<Grid3X3 />}
                      onClick={drawCollage}
                      className="action-button generate-button"
                    >
                      Update Collage
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={downloadImage}
                      className="action-button download-button"
                    >
                      Download Collage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card className="empty-canvas-card">
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <ImageIcon
                    width={80}
                    height={80}
                    style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }}
                  />
                  <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>
                    No Photos Uploaded
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Upload photos to start creating your collage
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}