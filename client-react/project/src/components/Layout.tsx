"use client"

import type * as React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { Link, useLocation, Link as RouterLink, useNavigate } from "react-router-dom"
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
  LogOut,
  UserPlus,
  Upload,
  FolderPlus,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react"
import "../styles/Layout.css" // Import your custom styles
import { useUserContext } from "../context/UserContext"

const StyledAppBar = styled(AppBar)(({}) => ({
  background: "rgba(26, 11, 46, 0.8)",
  backdropFilter: "blur(20px)",
  boxShadow: "none",
  transition: "all 0.3s ease",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  "&.scrolled": {
    background: "rgba(26, 11, 46, 0.95)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
}))

const StyledDrawer = styled(Drawer)(({}) => ({
  "& .MuiDrawer-paper": {
    width: 260,
    background: "rgba(26, 11, 46, 0.95)",
    backdropFilter: "blur(20px)",
    color: "white",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
    overflowX: "hidden",
  },
}))

interface NavButtonProps {
  to?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const NavButton = styled(({ to, children, className, onClick }: NavButtonProps) => {
  if (to) {
    return (
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
  }
  return (
    <Button
      onClick={onClick}
      className={className}
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
  )
})(({}) => ({
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
}))

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()
  const navigate = useNavigate()
  
  // שליפת המשתנים בדיוק כפי שהם מוגדרים ב-Context שלך
  const { user, setMyUser } = useUserContext()
  const myUser = user

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

  const handleLogout = () => {
    localStorage.clear()
    // עקיפת מגבלת הטיפוסים בצורה בטוחה באמצעות כפייה ל-any
    setMyUser({} as any)
    navigate("/")
    window.location.reload()
  }

  const topNavItems = !myUser
    ? [
        { name: "Home", path: "/", icon: Home },
        { name: "Login", path: "/login", icon: Login },
        { name: "Register", path: "/register", icon: UserPlus },
      ]
    : [
        { name: "Home", path: "/", icon: Home },
        { name: "Logout", onClick: handleLogout, icon: LogOut },
      ]

  const allNavItems = !myUser
    ? [
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
    : [
        { name: "Home", path: "/", icon: Home },
        { name: "Albums", path: "/Albums", icon: Camera },
        { name: "Upload", path: "/UploadFile", icon: Upload },
        { name: "Add Album", path: "/AddAlbum", icon: FolderPlus },
        { name: "Collage", path: "/College", icon: Layers },
        { name: "AI Generator", path: "/AiImageGenerator", icon: Sparkles },
        { name: "Chat", path: "/chat", icon: MessageCircle },
        { name: "Logout", onClick: handleLogout, icon: LogOut },
      ]

  const drawer = (
    <Box sx={{ height: "100%", overflowX: "hidden" }}>
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

      <List sx={{ overflowX: "hidden" }}>
        {allNavItems.map((item) => {
          const IconComponent = item.icon
          const isAction = "onClick" in item

          return (
            <ListItem
              key={item.name}
              {...(isAction 
                ? { onClick: () => { item.onClick?.(); handleDrawerToggle(); } }
                : { component: RouterLink, to: item.path, onClick: handleDrawerToggle }
              )}
              className={!isAction && location.pathname === item.path ? "active" : ""}
              sx={{
                textDecoration: "none",
                color: "rgba(255, 255, 255, 0.9)",
                padding: "0.75rem 1rem",
                margin: "0.25rem 0.5rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                borderLeft: "3px solid transparent",
                cursor: "pointer",
                minWidth: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.2)",
                  borderLeftColor: "#8b5cf6",
                  transform: "translateX(5px)",
                },
                "&.active": {
                  background: "linear-
