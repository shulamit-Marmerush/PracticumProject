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
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  ButtonGroup,
  Divider,
  Stack,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material"
import {
  Upload,
  Palette,
  Type,
  Download,
  Grid3X3,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Layers,
  ImageIcon,
  ImageUpIcon as AutoAwesome,
  DotIcon as GridOn,
  ViewIcon as ViewModule,
  ViewIcon as ViewQuilt,
  ViewIcon as ViewComfy,
  TimerIcon as Tune,
  TextIcon as TextFields,
  RefreshCwIcon as Refresh,
  Share,
  PrinterIcon as Print,
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
  brightness: number
  contrast: number
  blur: number
  borderRadius: number
  shadow: number
  zIndex: number
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
  shadow: boolean
  stroke: boolean
  strokeColor: string
  zIndex: number
}

interface CollageTemplate {
  name: string
  layout: string
  spacing: number
  padding: number
  aspectRatio: string
}

const collageTemplates: CollageTemplate[] = [
  { name: "Classic Grid", layout: "grid", spacing: 8, padding: 20, aspectRatio: "1:1" },
  { name: "Magazine Style", layout: "magazine", spacing: 4, padding: 15, aspectRatio: "4:3" },
  { name: "Mosaic", layout: "mosaic", spacing: 2, padding: 10, aspectRatio: "16:9" },
  { name: "Polaroid", layout: "polaroid", spacing: 12, padding: 25, aspectRatio: "1:1" },
  { name: "Scrapbook", layout: "scrapbook", spacing: 6, padding: 18, aspectRatio: "3:2" },
  { name: "Modern Minimal", layout: "minimal", spacing: 1, padding: 8, aspectRatio: "16:9" },
]

export default function ProfessionalCollageCreator() {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imageElements, setImageElements] = useState<ImageElement[]>([])
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CollageTemplate>(collageTemplates[0])
  const [backgroundColor, setBackgroundColor] = useState<string>("#1a0b2e")
  const [backgroundGradient, setBackgroundGradient] = useState<boolean>(false)
  const [gradientColor1, setGradientColor1] = useState<string>("#1a0b2e")
  const [gradientColor2, setGradientColor2] = useState<string>("#2c0f42")
  const [canvasWidth, setCanvasWidth] = useState<number>(1200)
  const [canvasHeight, setCanvasHeight] = useState<number>(800)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState<number>(0)
  const [textDialogOpen, setTextDialogOpen] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [fontSize, setFontSize] = useState<number>(32)
  const [fontFamily, setFontFamily] = useState<string>("Arial")
  const [fontWeight, setFontWeight] = useState<string>("normal")
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [autoArrange, setAutoArrange] = useState<boolean>(true)
  // const [showPresets, setShowPresets] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(1)

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
            if (autoArrange) {
              addImagesToCanvasWithTemplate(newImages)
            } else {
              addImagesToCanvas(newImages)
            }
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
      brightness: 100,
      contrast: 100,
      blur: 0,
      borderRadius: 0,
      shadow: 0,
      zIndex: index,
    }))
    setImageElements((prev) => [...prev, ...newElements])
    saveToHistory()
  }

  const addImagesToCanvasWithTemplate = (newImages: HTMLImageElement[]) => {
    const totalImages = imageElements.length + newImages.length
    const template = selectedTemplate
    let newElements: ImageElement[] = []

    switch (template.layout) {
      case "grid":
        newElements = arrangeInGrid(newImages, totalImages, template)
        break
      case "magazine":
        newElements = arrangeInMagazineStyle(newImages, totalImages, template)
        break
      case "mosaic":
        newElements = arrangeInMosaic(newImages, totalImages, template)
        break
      case "polaroid":
        newElements = arrangeInPolaroid(newImages, totalImages, template)
        break
      case "scrapbook":
        newElements = arrangeInScrapbook(newImages, totalImages, template)
        break
      case "minimal":
        newElements = arrangeInMinimal(newImages, totalImages, template)
        break
      default:
        newElements = arrangeInGrid(newImages, totalImages, template)
    }

    setImageElements((prev) => [...prev, ...newElements])
    saveToHistory()
  }

  const arrangeInGrid = (
    newImages: HTMLImageElement[],
    totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    const cols = Math.ceil(Math.sqrt(totalImages))
    const rows = Math.ceil(totalImages / cols)
    const cellWidth = (canvasWidth - template.padding * 2 - template.spacing * (cols - 1)) / cols
    const cellHeight = (canvasHeight - template.padding * 2 - template.spacing * (rows - 1)) / rows
    const size = Math.min(cellWidth, cellHeight)

    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const col = totalIndex % cols
      const row = Math.floor(totalIndex / cols)

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: template.padding + col * (size + template.spacing),
        y: template.padding + row * (size + template.spacing),
        width: size,
        height: size,
        rotation: 0,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: 8,
        shadow: 4,
        zIndex: totalIndex,
      }
    })
  }

  const arrangeInMagazineStyle = (
    newImages: HTMLImageElement[],
    _totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    const layouts = [
      { width: 0.6, height: 0.4 },
      { width: 0.35, height: 0.25 },
      { width: 0.35, height: 0.25 },
      { width: 0.5, height: 0.3 },
      { width: 0.45, height: 0.35 },
    ]

    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const layout = layouts[totalIndex % layouts.length]
      const baseX = template.padding + (totalIndex % 2) * (canvasWidth * 0.5)
      const baseY = template.padding + Math.floor(totalIndex / 2) * (canvasHeight * 0.4)

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: baseX + Math.random() * 50,
        y: baseY + Math.random() * 30,
        width: canvasWidth * layout.width,
        height: canvasHeight * layout.height,
        rotation: (Math.random() - 0.5) * 6,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: 12,
        shadow: 8,
        zIndex: totalIndex,
      }
    })
  }

  const arrangeInMosaic = (
    newImages: HTMLImageElement[],
    _totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    const sizes = [120, 150, 180, 200, 160]

    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const size = sizes[totalIndex % sizes.length]
      const cols = Math.floor(canvasWidth / (size + template.spacing))
      const col = totalIndex % cols
      const row = Math.floor(totalIndex / cols)

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: template.padding + col * (size + template.spacing) + Math.random() * 20,
        y: template.padding + row * (size + template.spacing) + Math.random() * 20,
        width: size,
        height: size,
        rotation: (Math.random() - 0.5) * 8,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: size * 0.1,
        shadow: 6,
        zIndex: totalIndex,
      }
    })
  }

  const arrangeInPolaroid = (
    newImages: HTMLImageElement[],
    _totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    const polaroidSize = 180
    const cols = Math.floor((canvasWidth - template.padding * 2) / (polaroidSize + template.spacing))

    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const col = totalIndex % cols
      const row = Math.floor(totalIndex / cols)

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: template.padding + col * (polaroidSize + template.spacing) + (Math.random() - 0.5) * 30,
        y: template.padding + row * (polaroidSize + template.spacing) + (Math.random() - 0.5) * 30,
        width: polaroidSize - 20,
        height: polaroidSize - 40,
        rotation: (Math.random() - 0.5) * 15,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: 4,
        shadow: 12,
        zIndex: totalIndex,
      }
    })
  }

  const arrangeInScrapbook = (
    newImages: HTMLImageElement[],
    _totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const size = 140 + Math.random() * 80

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: template.padding + Math.random() * (canvasWidth - template.padding * 2 - size),
        y: template.padding + Math.random() * (canvasHeight - template.padding * 2 - size),
        width: size,
        height: size * (0.8 + Math.random() * 0.4),
        rotation: (Math.random() - 0.5) * 20,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: 8 + Math.random() * 12,
        shadow: 4 + Math.random() * 8,
        zIndex: totalIndex,
      }
    })
  }

  const arrangeInMinimal = (
    newImages: HTMLImageElement[],
    totalImages: number,
    template: CollageTemplate,
  ): ImageElement[] => {
    const cols = Math.ceil(Math.sqrt(totalImages))
    const cellWidth = (canvasWidth - template.padding * 2 - template.spacing * (cols - 1)) / cols
    const cellHeight =
      (canvasHeight - template.padding * 2 - template.spacing * (Math.ceil(totalImages / cols) - 1)) /
      Math.ceil(totalImages / cols)

    return newImages.map((img, index) => {
      const totalIndex = imageElements.length + index
      const col = totalIndex % cols
      const row = Math.floor(totalIndex / cols)

      return {
        id: `img-${Date.now()}-${index}`,
        img,
        x: template.padding + col * (cellWidth + template.spacing),
        y: template.padding + row * (cellHeight + template.spacing),
        width: cellWidth,
        height: cellHeight,
        rotation: 0,
        opacity: 1,
        brightness: 100,
        contrast: 100,
        blur: 0,
        borderRadius: 0,
        shadow: 0,
        zIndex: totalIndex,
      }
    })
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
      fontWeight,
      textAlign: "center",
      shadow: true,
      stroke: false,
      strokeColor: "#000000",
      zIndex: 1000,
    }

    setTextElements((prev) => [...prev, textElement])
    setTextDialogOpen(false)
    setNewText("")
    saveToHistory()
  }

  const saveToHistory = () => {
    const state = {
      imageElements: [...imageElements],
      textElements: [...textElements],
      backgroundColor,
      backgroundGradient,
      gradientColor1,
      gradientColor2,
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
      restoreState(prevState)
      setHistoryIndex(historyIndex - 1)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      restoreState(nextState)
      setHistoryIndex(historyIndex + 1)
    }
  }

  const restoreState = (state: any) => {
    setImageElements(state.imageElements)
    setTextElements(state.textElements)
    setBackgroundColor(state.backgroundColor)
    setBackgroundGradient(state.backgroundGradient)
    setGradientColor1(state.gradientColor1)
    setGradientColor2(state.gradientColor2)
    setCanvasWidth(state.canvasWidth)
    setCanvasHeight(state.canvasHeight)
  }

  const applyTemplate = (template: CollageTemplate) => {
    setSelectedTemplate(template)
    if (images.length > 0) {
      addImagesToCanvasWithTemplate(images)
      saveToHistory()
    }
  }
';'
  const drawCollage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Background
    if (backgroundGradient) {
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
      gradient.addColorStop(0, gradientColor1)
      gradient.addColorStop(1, gradientColor2)
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = backgroundColor
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Sort elements by zIndex
    const allElements = [
      ...imageElements.map((el) => ({ ...el, type: "image" })),
      ...textElements.map((el) => ({ ...el, type: "text" })),
    ].sort((a, b) => a.zIndex - b.zIndex)

    // Draw elements
    allElements.forEach((element) => {
      if (element.type === "image") {
        drawImageElement(ctx, element as ImageElement & { type: string })
      } else {
        drawTextElement(ctx, element as TextElement & { type: string })
      }
    })
  }

  const drawImageElement = (ctx: CanvasRenderingContext2D, element: ImageElement & { type: string }) => {
    ctx.save()
    ctx.globalAlpha = element.opacity
    ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
    ctx.rotate((element.rotation * Math.PI) / 180)

    // Apply filters
    ctx.filter = `brightness(${element.brightness}%) contrast(${element.contrast}%) blur(${element.blur}px)`

    // Shadow
    if (element.shadow > 0) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = element.shadow
      ctx.shadowOffsetX = element.shadow / 2
      ctx.shadowOffsetY = element.shadow / 2
    }

    // Border radius
    if (element.borderRadius > 0) {
      ctx.beginPath()
      const x = -element.width / 2
      const y = -element.height / 2
      const w = element.width
      const h = element.height
      const r = element.borderRadius

      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.clip()
    }

    ctx.drawImage(element.img, -element.width / 2, -element.height / 2, element.width, element.height)

    // Selection indicator
    if (selectedElement === element.id) {
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.strokeRect(-element.width / 2 - 5, -element.height / 2 - 5, element.width + 10, element.height + 10)
    }

    ctx.restore()
  }

  const drawTextElement = (ctx: CanvasRenderingContext2D, element: TextElement & { type: string }) => {
    ctx.save()
    ctx.globalAlpha = element.opacity
    ctx.translate(element.x, element.y)
    ctx.rotate((element.rotation * Math.PI) / 180)

    ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`
    ctx.textAlign = element.textAlign as CanvasTextAlign

    // Text shadow
    if (element.shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
    }

    // Text stroke
    if (element.stroke) {
      ctx.strokeStyle = element.strokeColor
      ctx.lineWidth = 2
      ctx.strokeText(element.text, 0, 0)
    }

    ctx.fillStyle = element.color
    ctx.fillText(element.text, 0, 0)

    // Selection indicator
    if (selectedElement === element.id) {
      const metrics = ctx.measureText(element.text)
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.strokeRect(-metrics.width / 2 - 5, -element.fontSize - 5, metrics.width + 10, element.fontSize + 10)
    }

    ctx.restore()
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `professional-collage-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const clearCanvas = () => {
    setImageElements([])
    setTextElements([])
    setImages([])
    saveToHistory()
  }

  const randomizeLayout = () => {
    const randomTemplate = collageTemplates[Math.floor(Math.random() * collageTemplates.length)]
    applyTemplate(randomTemplate)
  }

  useEffect(() => {
    drawCollage()
  }, [
    imageElements,
    textElements,
    backgroundColor,
    backgroundGradient,
    gradientColor1,
    gradientColor2,
    canvasWidth,
    canvasHeight,
    selectedElement,
  ])

  const speedDialActions = [
    { icon: <AutoAwesome />, name: "Auto Arrange", onClick: randomizeLayout },
    { icon: <Refresh />, name: "Clear All", onClick: clearCanvas },
    { icon: <Share />, name: "Share", onClick: () => {} },
    { icon: <Print />, name: "Print", onClick: () => window.print() },
  ]

  return (
    <Box className="professional-collage-page">
      <Container maxWidth="xl" sx={{ pt: 2, pb: 4, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Paper elevation={0} className="professional-header-card">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <Sparkles size={28} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" className="professional-title">
                  Professional Collage Studio
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Create stunning photo collages with advanced tools and templates
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Badge badgeContent={history.length} color="primary">
                <Button variant="outlined" startIcon={<Undo />} onClick={undo} disabled={historyIndex <= 0}>
                  Undo
                </Button>
              </Badge>
              <Button
                variant="outlined"
                startIcon={<Redo />}
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                Redo
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Panel */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Upload Section */}
              <Card className="professional-card">
                <CardContent>
                  <Typography variant="h6" className="section-title" gutterBottom>
                    <Upload size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Media Upload
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
                    disabled={loading}
                    fullWidth
                    size="large"
                    className="upload-btn"
                  >
                    {loading ? "Processing..." : "Add Photos"}
                    <input type="file" multiple accept="image/*" onChange={handleUpload} hidden />
                  </Button>

                  {images.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Photos ({images.length})
                      </Typography>
                      <Box className="media-grid">
                        {images.map((img, index) => (
                          <Card key={index} className="media-item">
                            <Box component="img" src={img.src} alt={`Photo ${index + 1}`} className="media-thumbnail" />
                          </Card>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Templates Section */}
              <Card className="professional-card">
                <CardContent>
                  <Typography variant="h6" className="section-title" gutterBottom>
                    <ViewModule size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Templates
                  </Typography>

                  <Grid container spacing={1}>
                    {collageTemplates.map((template, index) => (
                      <Grid item xs={6} key={index}>
                        <Card
                          className={`template-card ${selectedTemplate.name === template.name ? "selected" : ""}`}
                          onClick={() => applyTemplate(template)}
                        >
                          <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                            <Box className="template-preview">
                              {template.layout === "grid" && <Grid3X3 size={24} />}
                              {template.layout === "magazine" && <ViewQuilt size={24} />}
                              {template.layout === "mosaic" && <ViewComfy size={24} />}
                              {template.layout === "polaroid" && <ImageIcon size={24} />}
                              {template.layout === "scrapbook" && <Layers size={24} />}
                              {template.layout === "minimal" && <GridOn size={24} />}
                            </Box>
                            <Typography variant="caption" display="block">
                              {template.name}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Settings Tabs */}
              <Card className="professional-card">
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth">
                  <Tab icon={<Tune />} label="Canvas" />
                  <Tab icon={<Palette />} label="Style" />
                  <Tab icon={<Type />} label="Text" />
                </Tabs>

                <CardContent>
                  {tabValue === 0 && (
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">Canvas Size</Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          label="Width"
                          type="number"
                          value={canvasWidth}
                          onChange={(e) => setCanvasWidth(Number(e.target.value))}
                          size="small"
                          fullWidth
                        />
                        <TextField
                          label="Height"
                          type="number"
                          value={canvasHeight}
                          onChange={(e) => setCanvasHeight(Number(e.target.value))}
                          size="small"
                          fullWidth
                        />
                      </Box>

                      <ButtonGroup variant="outlined" fullWidth>
                        <Button
                          onClick={() => {
                            setCanvasWidth(1920)
                            setCanvasHeight(1080)
                          }}
                        >
                          HD
                        </Button>
                        <Button
                          onClick={() => {
                            setCanvasWidth(1200)
                            setCanvasHeight(1200)
                          }}
                        >
                          Square
                        </Button>
                        <Button
                          onClick={() => {
                            setCanvasWidth(1080)
                            setCanvasHeight(1350)
                          }}
                        >
                          Story
                        </Button>
                      </ButtonGroup>

                      <FormControlLabel
                        control={<Switch checked={autoArrange} onChange={(e) => setAutoArrange(e.target.checked)} />}
                        label="Auto Arrange"
                      />
                    </Stack>
                  )}

                  {tabValue === 1 && (
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={backgroundGradient}
                            onChange={(e) => setBackgroundGradient(e.target.checked)}
                          />
                        }
                        label="Gradient Background"
                      />

                      {backgroundGradient ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            label="Color 1"
                            type="color"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            size="small"
                            fullWidth
                          />
                          <TextField
                            label="Color 2"
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </Box>
                      ) : (
                        <TextField
                          label="Background Color"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          size="small"
                          fullWidth
                        />
                      )}

                      <Typography variant="subtitle2">Zoom: {Math.round(zoom * 100)}%</Typography>
                      <Slider
                        value={zoom}
                        onChange={(_, value) => setZoom(value as number)}
                        min={0.1}
                        max={2}
                        step={0.1}
                        marks={[
                          { value: 0.5, label: "50%" },
                          { value: 1, label: "100%" },
                          { value: 1.5, label: "150%" },
                        ]}
                      />
                    </Stack>
                  )}

                  {tabValue === 2 && (
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<TextFields />}
                        onClick={() => setTextDialogOpen(true)}
                        fullWidth
                        className="text-btn"
                      >
                        Add Text
                      </Button>

                      {textElements.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Text Elements
                          </Typography>
                          <Stack spacing={1}>
                            {textElements.map((element) => (
                              <Chip
                                key={element.id}
                                label={element.text.substring(0, 15) + (element.text.length > 15 ? "..." : "")}
                                onDelete={() => {
                                  setTextElements((prev) => prev.filter((el) => el.id !== element.id))
                                  saveToHistory()
                                }}
                                onClick={() => setSelectedElement(element.id)}
                                variant={selectedElement === element.id ? "filled" : "outlined"}
                                color="primary"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Main Canvas */}
          <Grid item xs={12} md={8}>
            <Card className="canvas-card">
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Canvas Preview</Typography>
                  <ButtonGroup variant="outlined" size="small">
                    <Button onClick={() => setZoom(zoom - 0.1)} disabled={zoom <= 0.1}>
                      <ZoomOut size={16} />
                    </Button>
                    <Button onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</Button>
                    <Button onClick={() => setZoom(zoom + 0.1)} disabled={zoom >= 2}>
                      <ZoomIn size={16} />
                    </Button>
                  </ButtonGroup>
                </Box>

                <Box className="canvas-container" sx={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                  <canvas ref={canvasRef} className="professional-canvas" />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="contained" startIcon={<Refresh />} onClick={drawCollage} className="update-btn">
                    Update Preview
                  </Button>
                  <Button variant="contained" startIcon={<Download />} onClick={downloadImage} className="download-btn">
                    Download HD
                  </Button>
                  <Button variant="outlined" startIcon={<AutoAwesome />} onClick={randomizeLayout}>
                    Surprise Me
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Text Dialog */}
        <Dialog open={textDialogOpen} onClose={() => setTextDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Text Element</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                label="Text Content"
                fullWidth
                multiline
                rows={2}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Font Size"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  sx={{ width: 120 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Font Family</InputLabel>
                  <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Helvetica">Helvetica</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="Times New Roman">Times</MenuItem>
                    <MenuItem value="Verdana">Verdana</MenuItem>
                    <MenuItem value="Impact">Impact</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Weight</InputLabel>
                  <Select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="bold">Bold</MenuItem>
                    <MenuItem value="lighter">Light</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Text Color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                sx={{ width: 120 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTextDialogOpen(false)}>Cancel</Button>
            <Button onClick={addTextElement} variant="contained">
              Add Text
            </Button>
          </DialogActions>
        </Dialog>

        {/* Speed Dial */}
        <SpeedDial ariaLabel="Quick Actions" sx={{ position: "fixed", bottom: 24, right: 24 }} icon={<SpeedDialIcon />}>
          {speedDialActions.map((action) => (
            <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.onClick} />
          ))}
        </SpeedDial>
      </Container>
    </Box>
  )
}