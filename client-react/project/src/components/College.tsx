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
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Upload,
  Trash2,
  Palette,
  Type,
  Download,
  Grid3X3,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Move,
  Save,
  Undo,
  Redo,
  Settings,
  Layers,
} from "lucide-react"

interface ImageElement {
  id: string
  img: HTMLImageElement
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  filter: string
}

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
  opacity: number
  fontWeight: string
  textAlign: string
}

export default function CollageCreator() {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imageElements, setImageElements] = useState<ImageElement[]>([])
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [layout, setLayout] = useState<string>("freeform")
  const [backgroundColor, setBackgroundColor] = useState<string>("#1a0b2e")
  const [borderColor, setBorderColor] = useState<string>("#8b5cf6")
  const [borderWidth, setBorderWidth] = useState<number>(5)
  const [canvasWidth, setCanvasWidth] = useState<number>(800)
  const [canvasHeight, setCanvasHeight] = useState<number>(600)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState<boolean>(true)
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true)
  const [gridSize, setGridSize] = useState<number>(20)
  const [textDialogOpen, setTextDialogOpen] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [fontSize, setFontSize] = useState<number>(24)
  const [fontFamily, setFontFamily] = useState<string>("Arial")
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setLoading(true)
    const newImages: HTMLImageElement[] = []

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          newImages.push(img)
          if (newImages.length === files.length) {
            setImages([...images, ...newImages])
            addImagesToCanvas(newImages)
            setLoading(false)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const addImagesToCanvas = (newImages: HTMLImageElement[]) => {
    const newElements: ImageElement[] = newImages.map((img, index) => ({
      id: `img-${Date.now()}-${index}`,
      img,
      x: 50 + index * 20,
      y: 50 + index * 20,
      width: 200,
      height: 200,
      rotation: 0,
      opacity: 1,
      filter: "none",
    }))
    setImageElements((prev) => [...prev, ...newElements])
    saveToHistory()
  }

  const addTextElement = () => {
    if (!newText.trim()) return

    const textElement: TextElement = {
      id: `text-${Date.now()}`,
      text: newText,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      fontSize,
      fontFamily,
      color: textColor,
      rotation: 0,
      opacity: 1,
      fontWeight: "normal",
      textAlign: "center",
    }

    setTextElements((prev) => [...prev, textElement])
    setTextDialogOpen(false)
    setNewText("")
    saveToHistory()
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
    saveToHistory()
  }

  const saveToHistory = () => {
    const state = {
      imageElements: [...imageElements],
      textElements: [...textElements],
      backgroundColor,
      canvasWidth,
      canvasHeight,
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setImageElements(prevState.imageElements)
      setTextElements(prevState.textElements)
      setBackgroundColor(prevState.backgroundColor)
      setCanvasWidth(prevState.canvasWidth)
      setCanvasHeight(prevState.canvasHeight)
      setHistoryIndex(historyIndex - 1)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setImageElements(nextState.imageElements)
      setTextElements(nextState.textElements)
      setBackgroundColor(nextState.backgroundColor)
      setCanvasWidth(nextState.canvasWidth)
      setCanvasHeight(nextState.canvasHeight)
      setHistoryIndex(historyIndex + 1)
    }
  }

  const drawCollage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }
    }

    // Draw image elements
    imageElements.forEach((element) => {
      ctx.save()
      ctx.globalAlpha = element.opacity
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
      ctx.rotate((element.rotation * Math.PI) / 180)

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor
        ctx.fillRect(
          -element.width / 2 - borderWidth,
          -element.height / 2 - borderWidth,
          element.width + borderWidth * 2,
          element.height + borderWidth * 2,
        )
      }

      ctx.drawImage(element.img, -element.width / 2, -element.height / 2, element.width, element.height)

      if (selectedElement === element.id) {
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 2
        ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)
      }

      ctx.restore()
    })

    // Draw text elements
    textElements.forEach((element) => {
      ctx.save()
      ctx.globalAlpha = element.opacity
      ctx.translate(element.x, element.y)
      ctx.rotate((element.rotation * Math.PI) / 180)
      ctx.fillStyle = element.color
      ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`
      ctx.textAlign = element.textAlign as CanvasTextAlign
      ctx.fillText(element.text, 0, 0)

      if (selectedElement === element.id) {
        const metrics = ctx.measureText(element.text)
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 2
        ctx.strokeRect(-metrics.width / 2, -element.fontSize, metrics.width, element.fontSize)
      }

      ctx.restore()
    })
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "advanced-collage.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const applyAutoLayout = () => {
    if (layout === "grid") {
      const cols = Math.ceil(Math.sqrt(imageElements.length))
      const rows = Math.ceil(imageElements.length / cols)
      const cellWidth = (canvasWidth - 40) / cols
      const cellHeight = (canvasHeight - 40) / rows

      const newElements = imageElements.map((element, index) => ({
        ...element,
        x: 20 + (index % cols) * cellWidth,
        y: 20 + Math.floor(index / cols) * cellHeight,
        width: cellWidth - 20,
        height: cellHeight - 20,
      }))
      setImageElements(newElements)
    } else if (layout === "horizontal") {
      const cellWidth = (canvasWidth - 40) / imageElements.length
      const newElements = imageElements.map((element, index) => ({
        ...element,
        x: 20 + index * cellWidth,
        y: 20,
        width: cellWidth - 20,
        height: canvasHeight - 40,
      }))
      setImageElements(newElements)
    } else if (layout === "vertical") {
      const cellHeight = (canvasHeight - 40) / imageElements.length
      const newElements = imageElements.map((element, index) => ({
        ...element,
        x: 20,
        y: 20 + index * cellHeight,
        width: canvasWidth - 40,
        height: cellHeight - 20,
      }))
      setImageElements(newElements)
    }
    saveToHistory()
  }

  useEffect(() => {
    if (imageElements.length > 0 || textElements.length > 0) {
      drawCollage()
    }
  }, [
    imageElements,
    textElements,
    backgroundColor,
    borderColor,
    borderWidth,
    canvasWidth,
    canvasHeight,
    showGrid,
    gridSize,
    selectedElement,
  ])

  return (
    <Box className="collage-page">
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
        <Paper elevation={0} className="collage-header-card">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Sparkles style={{ fontSize: 40, color: "#8B5CF6" }} />
            <Box>
              <Typography variant="h4" component="h1" className="collage-title">
                Advanced Collage Creator
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Create professional collages with advanced tools and customization options
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<Undo />}
              onClick={undo}
              disabled={historyIndex <= 0}
              className="action-button"
            >
              Undo
            </Button>
            <Button
              variant="outlined"
              startIcon={<Redo />}
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="action-button"
            >
              Redo
            </Button>
            <Button variant="outlined" startIcon={<Save />} onClick={downloadImage} className="action-button">
              Save Project
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid>
            <Card className="control-card">
              <CardContent>
                <Typography variant="h6" className="control-section-title">
                  <Upload style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Upload & Manage
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Add Photos"}
                  <input type="file" multiple accept="image/*" onChange={handleUpload} hidden />
                </Button>

                {images.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}>
                      Photos ({images.length})
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

            <Card className="control-card" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" className="control-section-title">
                  <Settings style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Canvas Settings
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="Width"
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className="dimension-input"
                    size="small"
                  />
                  <TextField
                    label="Height"
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className="dimension-input"
                    size="small"
                  />
                </Box>

                <FormControlLabel
                  control={<Switch checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />}
                  label="Show Grid"
                  sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}
                />

                <FormControlLabel
                  control={<Switch checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />}
                  label="Snap to Grid"
                  sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}
                />

                <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                  Grid Size: {gridSize}px
                </Typography>
                <Slider
                  value={gridSize}
                  onChange={(_, value) => setGridSize(value as number)}
                  min={10}
                  max={50}
                  step={5}
                  className="control-slider"
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>

            <Card className="control-card" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" className="control-section-title">
                  <Palette style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Styling
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Auto Layout</InputLabel>
                  <Select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    variant="outlined"
                    className="control-select"
                  >
                    <MenuItem value="freeform">Freeform</MenuItem>
                    <MenuItem value="grid">Grid</MenuItem>
                    <MenuItem value="horizontal">Horizontal</MenuItem>
                    <MenuItem value="vertical">Vertical</MenuItem>
                  </Select>
                </FormControl>

                {layout !== "freeform" && (
                  <Button
                    variant="outlined"
                    startIcon={<Grid3X3 />}
                    onClick={applyAutoLayout}
                    fullWidth
                    sx={{ mb: 2 }}
                    className="action-button"
                  >
                    Apply Layout
                  </Button>
                )}

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
              </CardContent>
            </Card>

            <Card className="control-card" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" className="control-section-title">
                  <Type style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Text Tools
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Type />}
                  onClick={() => setTextDialogOpen(true)}
                  fullWidth
                  className="text-button"
                >
                  Add Text
                </Button>

                {textElements.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)" }}>
                      Text Elements
                    </Typography>
                    {textElements.map((element) => (
                      <Chip
                        key={element.id}
                        label={element.text.substring(0, 20) + (element.text.length > 20 ? "..." : "")}
                        onDelete={() => {
                          setTextElements((prev) => prev.filter((el) => el.id !== element.id))
                          saveToHistory()
                        }}
                        onClick={() => setSelectedElement(element.id)}
                        variant={selectedElement === element.id ? "filled" : "outlined"}
                        sx={{ m: 0.5, color: "white" }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid >
            {imageElements.length > 0 || textElements.length > 0 ? (
              <Card className="canvas-card">
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                      Canvas Preview
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Zoom In">
                        <IconButton size="small" className="zoom-btn">
                          <ZoomIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom Out">
                        <IconButton size="small" className="zoom-btn">
                          <ZoomOut />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset View">
                        <IconButton size="small" className="zoom-btn">
                          <Move />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
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
                      Update Preview
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
                  <Layers width={80} height={80} style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>
                    Start Creating Your Collage
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Upload photos and add text to begin creating your masterpiece
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Text Dialog */}
        <Dialog open={textDialogOpen} onClose={() => setTextDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: "rgba(26, 11, 46, 0.95)", color: "white" }}>Add Text Element</DialogTitle>
          <DialogContent sx={{ background: "rgba(26, 11, 46, 0.95)" }}>
            <TextField
              autoFocus
              margin="dense"
              label="Text"
              fullWidth
              variant="outlined"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              sx={{ mb: 2, "& .MuiInputBase-root": { color: "white" } }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Font Size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { color: "white" } }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Font</InputLabel>
                <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} sx={{ color: "white" }}>
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Helvetica">Helvetica</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Verdana">Verdana</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ color: "white" }}>Color:</Typography>
              <TextField
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                sx={{ width: 60 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ background: "rgba(26, 11, 46, 0.95)" }}>
            <Button onClick={() => setTextDialogOpen(false)} sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Cancel
            </Button>
            <Button onClick={addTextElement} variant="contained" className="text-button">
              Add Text
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
