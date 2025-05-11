"use client"

import type React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  Container,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import InstagramIcon from "@mui/icons-material/Instagram"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import "../styles/Layout.css"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Albums", path: "/Albums" },
    { name: "Upload", path: "/UploadFile" },
    { name: "Add Album", path: "/AddAlbum" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} className="drawer-container">
      <Box className="drawer-header">
        <Typography variant="h6" component="div" className="logo">
          Photo<span className="logo-accent">Click</span>
        </Typography>
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            to={item.path}
            className={`drawer-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box className="layout-container">
      <AppBar position="fixed" className={`app-bar ${scrolled ? "scrolled" : ""}`}>
        <Toolbar className="toolbar">
          <Box className="logo-container">
            <PhotoCameraIcon className="logo-icon" />
            <Typography variant="h6" component={Link} to="/" className="logo">
              Photo<span className="logo-accent">Click</span>
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="nav-links">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className="drawer"
      >
        {drawer}
      </Drawer>

      <Box className="content-wrapper">{children}</Box>

      <Box component="footer" className="footer">
        <Container maxWidth={false}>
          <Box className="footer-content">
            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Photo<span className="logo-accent">Click</span>
              </Typography>
              <Typography variant="body2" className="footer-description">
                Create beautiful photo albums and collages with our easy-to-use tools. Share your memories with friends
                and family.
              </Typography>
            </Box>

            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Quick Links
              </Typography>
              <Box className="footer-links">
                <Link to="/" className="footer-link">
                  Home
                </Link>
                <Link to="/Albums" className="footer-link">
                  Albums
                </Link>
                <Link to="/UploadFile" className="footer-link">
                  Upload Photos
                </Link>
                <Link to="/AddAlbum" className="footer-link">
                  Create Album
                </Link>
              </Box>
            </Box>

            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Connect With Us
              </Typography>
              <Box className="social-icons">
                <IconButton className="social-icon facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton className="social-icon instagram">
                  <InstagramIcon />
                </IconButton>
                <IconButton className="social-icon twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton className="social-icon linkedin">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box className="footer-bottom">
            <Typography variant="body2" className="copyright">
              © {new Date().getFullYear()} PhotoClick. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout
