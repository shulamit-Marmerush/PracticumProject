"use client"

import * as React from "react";
import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation, Link as RouterLink } from "react-router-dom"
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
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Menu,
  X,
  Camera,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Home,
  LogInIcon as Login,
  UserPlus,
  Upload,
  FolderPlus,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react"
import '../styles/Layout.css'; // Import the CSS file

const StyledAppBar = styled(AppBar)(({  }) => ({
  background: "rgba(26, 11, 46, 0.8)",
  backdropFilter: "blur(20px)",
  boxShadow: "none",
  transition: "all 0.3s ease",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  "&.scrolled": {
    background: "rgba(26, 11, 46, 0.95)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
}));

const StyledDrawer = styled(Drawer)(({ }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    background: "rgba(26, 11, 46, 0.95)",
    backdropFilter: "blur(20px)",
    color: "white",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  },
}));

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavButton = styled(
  ({ to, children, className }: NavButtonProps) => (
    <RouterLink to={to} className={className}>
      <Button
        sx={{
          color: "rgba(255, 255, 255, 0.9)",
          fontWeight: 500,
          position: "relative",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          transition: "all 0.3s ease",
          textTransform: "none",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </RouterLink>
  )
)(({  }) => ({
  "& .MuiButton-root": {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 500,
    position: "relative",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    textTransform: "none",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    "&:hover": {
      background: "rgba(139, 92, 246, 0.2)",
      transform: "translateY(-2px)",
    },
    "&.active": {
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
      color: "white",
    },
  },
}));


interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
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

  const topNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Login", path: "/login", icon: Login },
    { name: "Register", path: "/register", icon: UserPlus },
  ]

  const allNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Albums", path: "/Albums", icon: Camera },
    { name: "Upload", path: "/UploadFile", icon: Upload },
    { name: "Add Album", path: "/AddAlbum", icon: FolderPlus },
    { name: "Collage", path: "/College", icon: Layers },
    { name: "AI Generator", path: "/AiImageGenerator", icon: Sparkles },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Login", path: "/login", icon: Login },
    { name: "Register", path: "/register", icon: UserPlus },
  ]

  const drawer = (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          background: "rgba(139, 92, 246, 0.1)",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: "white" }}>
          Photo
          <span
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Click
          </span>
        </Typography>
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} aria-label="close">
          <X />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <List>
        {allNavItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <ListItem
              key={item.name}
              component={RouterLink}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={handleDrawerToggle}
              sx={{
                textDecoration: "none",
                color: "rgba(255, 255, 255, 0.9)",
                padding: "1rem 1.5rem",
                margin: "0.25rem 1rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                borderLeft: "3px solid transparent",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.2)",
                  borderLeftColor: "#8b5cf6",
                  transform: "translateX(5px)",
                },
                "&.active": {
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
                  color: "white",
                  fontWeight: 600,
                  borderLeftColor: "#ec4899",
                },
              }}
            >
              <IconComponent size={20} style={{ marginRight: "12px" }} />
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0b2e 0%, #2c0f42 50%, #1a0b2e 100%)",
        color: "white",
        overflowX: "hidden",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <StyledAppBar position="fixed" className={scrolled ? "scrolled" : ""}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Camera
              size={28}
              style={{
                color: "#8b5cf6",
                filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))",
              }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: "white",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.5px",
                fontSize: "1.5rem",
              }}
            >
              Photo
              <span
                style={{
                  background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Click
              </span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {topNavItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <NavButton
                      key={item.name}
                      to={item.path}
                      className={location.pathname === item.path ? "active" : ""}
                    >
                      <IconComponent size={18} />
                      {item.name}
                    </NavButton>
                  )
                })}
              </Box>
            )}

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: "#8b5cf6",
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.2)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Menu />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </StyledDrawer>

      <Box sx={{ flex: 1, paddingTop: "64px", width: "100%", position: "relative", zIndex: 1 }}>{children}</Box>

      <Box
        component="footer"
        sx={{
          background: "rgba(26, 11, 46, 0.8)",
          backdropFilter: "blur(20px)",
          color: "white",
          padding: "3rem 0 1.5rem",
          marginTop: "3rem",
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: "2rem",
              padding: "0 1.5rem",
            }}
          >
            <Box sx={{ flex: 1, minWidth: "250px", marginBottom: "1.5rem", padding: "0 1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: 600,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-8px",
                    left: 0,
                    width: "40px",
                    height: "3px",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    borderRadius: "3px",
                  },
                }}
              >
                Photo
                <span
                  style={{
                    background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Click
                </span>
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}>
                Create beautiful photo albums and collages with our easy-to-use tools. Share your memories with friends
                and family.
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: "250px", marginBottom: "1.5rem", padding: "0 1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: 600,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-8px",
                    left: 0,
                    width: "40px",
                    height: "3px",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    borderRadius: "3px",
                  },
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/Albums" className="footer-link">Albums</Link>
                <Link to="/UploadFile" className="footer-link">Upload Photos</Link>
                <Link to="/AddAlbum" className="footer-link">Create Album</Link>
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: "250px", marginBottom: "1.5rem", padding: "0 1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: 600,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-8px",
                    left: 0,
                    width: "40px",
                    height: "3px",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    borderRadius: "3px",
                  },
                }}
              >
                Connect With Us
              </Typography>
              <Box sx={{ display: "flex", gap: "0.75rem" }}>
                <IconButton className="social-icon"><Facebook /></IconButton>
                <IconButton className="social-icon"><Instagram /></IconButton>
                <IconButton className="social-icon"><Twitter /></IconButton>
                <IconButton className="social-icon"><Linkedin /></IconButton>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "1.5rem",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
              © {new Date().getFullYear()} PhotoClick. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout;
