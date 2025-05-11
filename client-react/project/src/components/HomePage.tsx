"use client"
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
} from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import ShareIcon from "@mui/icons-material/Share"
import PaletteIcon from "@mui/icons-material/Palette"
import StarIcon from "@mui/icons-material/Star"
import "../styles/HomePage.css"
import "../styles/Global.css"

const HomePage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box>
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid >
              <Fade in={true} timeout={1000}>
                <Box className={isMobile ? "text-center" : "text-left"}>
                  <Typography variant="h2" component="h1" className="hero-title">
                    Create Amazing Photo Albums & Collages
                  </Typography>
                  <Typography variant="h6" className="hero-subtitle">
                    PhotoClick allows you to easily create stunning designs for your photos. Save, share, and print your
                    precious memories with our intuitive tools.
                  </Typography>
                  <Box className={`cta-buttons ${isMobile ? "center" : "left"}`}>
                    <Button variant="contained" component={Link} to="/register" size="large" className="btn-primary">
                      Get Started
                    </Button>
                    <Button variant="outlined" component={Link} to="/Albums" size="large" className="btn-secondary">
                      View Examples
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid >
              <Box className="image-grid-container">
                {[1, 2, 3, 4].map((item, index) => (
                  <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }} key={item}>
                    <Paper elevation={6} className={`grid-item grid-item-${item}`}>
                      <Box
                        component="img"
                        src={`/placeholder.svg?height=150&width=150`}
                        alt={`Sample photo ${item}`}
                        className="grid-image"
                      />
                    </Paper>
                  </Zoom>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" className="section-title">
            Why Choose PhotoClick?
          </Typography>
          <Typography variant="h6" align="center" className="section-subtitle">
            Advanced and easy-to-use tools to help you create professional albums and collages
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <ImageIcon fontSize="large" />,
                title: "Create Collages",
                description:
                  "Choose from a variety of collage templates, customize them, and add special effects to your photos.",
              },
              {
                icon: <ShareIcon fontSize="large" />,
                title: "Easy Sharing",
                description:
                  "Share your creations on social media, send via email, or save in the cloud for access from anywhere.",
              },
              {
                icon: <PaletteIcon fontSize="large" />,
                title: "Advanced Editing",
                description:
                  "Professional editing tools including filters, color adjustments, special texts, and advanced design options.",
              },
            ].map((feature, index) => (
              <Grid  key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Card className="feature-card">
                    <CardContent className="feature-content">
                      <Box className="feature-icon-container">{feature.icon}</Box>
                      <Typography variant="h5" component="h3" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" className="feature-description">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section */}
      <Box className="gallery-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" className="section-title">
            Project Gallery
          </Typography>
          <Typography variant="h6" align="center" className="section-subtitle">
            A glimpse of amazing albums and collages created with PhotoClick
          </Typography>

          <Grid container spacing={3}>
            {[
              { title: "Family Album", description: "Stylish collage of family photos" },
              { title: "Wedding Album", description: "Special digital album for the happy couple" },
              { title: "Travel Collage", description: "Collection of memories from a family trip" },
              { title: "Birthday Album", description: "Album to mark a special event" },
            ].map((item, index) => (
              <Grid  key={index}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Card className="gallery-card">
                    <CardMedia
                      component="img"
                      height="280"
                      image={`/placeholder.svg?height=280&width=280`}
                      alt={item.title}
                      className="gallery-image"
                    />
                    <Box className="gallery-overlay">
                      <Typography variant="h6" component="h3">
                        {item.title}
                      </Typography>
                      <Typography variant="body2">{item.description}</Typography>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box className="testimonial-section">
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" align="center" className="section-title">
            What People Are Saying
          </Typography>
          <Typography variant="h6" align="center" className="section-subtitle">
            Satisfied customers share their experience with PhotoClick
          </Typography>

          <Fade in={true} timeout={1000}>
            <Card className="testimonial-card">
              <Box className="quote-mark">"</Box>
              <Typography variant="h6" className="testimonial-text">
                I've been using PhotoClick for six months to create collages for my family. The interface is so simple
                and intuitive, and the results are amazing! I highly recommend it to anyone who wants to create
                wonderful family memories.
              </Typography>
              <Box className="testimonial-author">
                <Avatar src="/placeholder.svg?height=60&width=60" alt="User photo" className="author-avatar" />
                <Box>
                  <Typography variant="subtitle1" className="author-name">
                    Sarah Johnson
                  </Typography>
                  <Typography variant="body2" className="author-title">
                    Loyal User
                  </Typography>
                  <Box className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} fontSize="small" className="star-icon" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Fade>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
