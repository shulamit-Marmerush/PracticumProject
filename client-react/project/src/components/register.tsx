"use client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { TextField, Button, Container, Typography, Box, Paper, InputAdornment } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Mail, User, Phone, Lock } from "lucide-react"
import { useUserContext } from "../context/UserContext"
import "../styles/Register.css"

const validationSchema = yup.object({
  UserName: yup.string().required("Username is required").max(20, "Username cannot be more than 20 characters"),
  Password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  Phone: yup.string().required("Phone is required"),
  Email: yup.string().required("Email is required").email("Email is not valid"),
})

type RegisterForm = {
  UserName: string
  Password: string
  Phone: string
  Email: string
}

export type UserType = {
  UserId: number
  UserName: string
  Email: string
  Phone: string
  Password: string
}

const Register = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(validationSchema),
  })

  const { setMyUser } = useUserContext()

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      console.log("submitted")
      const response = await registerUser(data)
      console.log(response)
      localStorage.setItem("UserId", response.UserId.toString())
      setMyUser({ ...data, UserId: response.UserId })
      navigate("/login")
      alert("Registration successful! Please log in.")
    } catch (error) {
      console.error(error)
    }
  }

  const registerUser = async (user: RegisterForm): Promise<UserType> => {
    try {
      const response = await axios.post<{ userId: number }>("https://practicumproject-server.onrender.com/api/User/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status == 200) {
        alert("Registration successful")
      }

      console.log("Registration response:", response.data)
      return { UserId: response.data.userId, ...user }
    } catch (error) {
      console.error("Registration error:", error)
      throw new Error("Failed to register user.")
    }
  }

  return (
    <Box className="register-container">
      <Container maxWidth="sm">
        <Paper elevation={0} className="register-paper">
          <Box className="register-header">
            <Typography variant="h4" component="h1" className="register-title">
              Create an Account
            </Typography>
            <Typography variant="body1" className="register-subtitle">
              Join PhotoClick to start creating amazing photo albums
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("UserName")}
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.UserName}
              helperText={errors.UserName ? errors.UserName.message : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="register-input"
            />

            <TextField
              type="password"
              {...register("Password")}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Password}
              helperText={errors.Password ? errors.Password.message : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="register-input"
            />

            <TextField
              {...register("Phone")}
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Phone}
              helperText={errors.Phone ? errors.Phone.message : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="register-input"
            />

            <TextField
              {...register("Email")}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Email}
              helperText={errors.Email ? errors.Email.message : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="register-input"
            />

            <Button type="submit" variant="contained" fullWidth size="large" className="register-button">
              Register
            </Button>

            <Box className="login-link-container">
              <Typography variant="body2" className="login-link-text">
                Already have an account?{" "}
                <Typography component="span" className="login-link" onClick={() => navigate("/login")}>
                  Login
                </Typography>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default Register