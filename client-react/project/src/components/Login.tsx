"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../styles/Login.css"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Mail, Lock } from "lucide-react"
import { useUserContext } from "../context/UserContext"

type LoginForm = {
  Email: string
  Password: string
}

export interface LoginResponse {
  token: string
  UserId: number
}

interface TokenPayload {
  id: number
}

interface User {
  UserId: number
  UserName: string
  Email: string
  Phone: string
  Password: string
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()
  const { setMyUser } = useUserContext()
  const navigate = useNavigate()

  const loginUser = async (user: LoginForm): Promise<LoginResponse | null> => {
    try {
      const headers = {
        "Content-Type": "application/json",
      }

      const response = await axios.post<LoginResponse>("https://practicumproject-server.onrender.com/api/Auth/login", user, { headers })
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  const fetchUserDetails = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must login to view user details")
        return null
      }

      const response = await axios.get<User>(`https://practicumproject-server.onrender.com/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("User details fetched:", response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching user details:", error)
      return null
    }
  }

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await loginUser(data)

      if (response) {
        console.log("logged in")
        const token = response.token

        if (token) {
          localStorage.setItem("token", token)
          console.log("Token saved:", token)

          const decodedToken: TokenPayload = jwtDecode(token)
          const userId = decodedToken.id

          if (userId !== undefined) {
            localStorage.setItem("UserId", userId.toString())

            const userDetails = await fetchUserDetails(userId)
            if (userDetails) {
              const user: User = {
                UserId: userDetails.UserId,
                UserName: userDetails.UserName,
                Email: userDetails.Email,
                Phone: userDetails.Phone,
                Password: data.Password,
              }

              setMyUser(user)
              navigate("/Albums")
            } else {
              setError("Failed to fetch user details.")
            }
          } else {
            setError("UserId is undefined in the decoded token.")
          }
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      setError("Error during login. Please try again.")
      console.log("Error during login:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="login-container">
      <Container maxWidth="sm">
        <Paper elevation={0} className="login-paper">
          <Box className="login-header">
            <Typography variant="h4" component="h1" className="login-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="login-subtitle">
              Sign in to access your photo albums
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="login-alert">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("Email", { required: true })}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Email}
              helperText={errors.Email ? "Email is required" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="login-input"
            />

            <TextField
              type="password"
              {...register("Password", { required: true, minLength: 2 })}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Password}
              helperText={errors.Password ? "Password is required" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="login-input"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              className="login-button"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>

            <Box className="register-link-container">
              <Typography variant="body2" className="register-link-text">
                Don't have an account?{" "}
                <Typography component="span" className="register-link" onClick={() => navigate("/register")}>
                  Register
                </Typography>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login