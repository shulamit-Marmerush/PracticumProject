// import { SubmitHandler, useForm } from "react-hook-form";
// import axios from "axios";
// import { useUserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode"; // תקן את הייבוא של jwtDecode
// import { User } from "../types/User";

// // ייבוא הממשק
// export interface LoginResponse {
//     token: string; // ה-token שתקבל מהשרת
//     UserId: number; // ה-UserId של המשתמש
// }

// interface TokenPayload {
//     id: number; // או את סוג ה-ID הנכון
// }

// export default function Login() {
//     const { register, handleSubmit } = useForm<{ Email: string; Password: string }>();
//     const { setMyUser } = useUserContext();
//     const navigate = useNavigate();

//     const loginUser = async (user: { Email: string; Password: string }): Promise<LoginResponse | null> => {
//         try {
//             const headers = {
//                 'Content-Type': 'application/json',
//             };

//             const response = await axios.post<LoginResponse>('https://localhost:7259/api/Auth/login', user, { headers });
//             return response.data; // החזר את התגובה עצמה
//         } catch (error) {
//             console.error("Login error:", error);
//             return null; // החזר null במקרה של שגיאה
//         }
//     };

//     const fetchUserDetails = async (userId: number) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert("You must login to view user details");
//                 return null; // החזר null אם הטוקן לא קיים
//             }

//             const response = await axios.get<User>(`https://localhost:7259/api/User/${userId}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
//                 }
//             });

//             console.log("User details fetched:", response.data);
//             return response.data; // החזר את התגובה עצמה
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             return null; // החזר null במקרה של שגיאה
//         }
//     };

//     const onSubmit: SubmitHandler<{ Email: string; Password: string }> = async (data) => {
//         console.log("Form submitted with data:", data);
    
//         try {
//             const response = await loginUser(data);
            
//             if (response) {
//                 console.log("logged in");
//                 alert("Login successful!");
//                 const token = response.token; // גישה לטוקן
                
//                 if (token) {
//                     localStorage.setItem('token', token); // שמור את הטוקן ב-local storage
//                     console.log("Token saved:", token);

//                     // פענח את הטוקן כדי לשלוף את ה-UserId
//                     const decodedToken: TokenPayload = jwtDecode(token);
//                     const userId = decodedToken.id; // שלוף את ה-UserId מהטוקן

//                     // בדוק אם userId קיים לפני השימוש בו
//                     if (userId !== undefined) {
//                         localStorage.setItem('UserId', userId.toString()); // שמור את ה-UserId ב-local storage

//                         const userDetails = await fetchUserDetails(userId);
//                         if (userDetails) {
//                             const user: User = {
//                                 UserId: userDetails.UserId,
//                                 UserName: userDetails.UserName,
//                                 Email: userDetails.Email,
//                                 Phone: userDetails.Phone,
//                                 Password: data.Password, // או מה שצריך
//                             };
                            
//                             setMyUser(user); // עדכון כאן
//                         } else {
//                             console.error("Failed to fetch user details.");
//                         }
//                     } else {
//                         console.error("UserId is undefined in the decoded token.");
//                     }
//                 }
//             } else {
//                 console.log("logged out");
//                 navigate('/register');
//             }
//         } catch (error) {
//             console.log("Error during login:", error);
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <input type="text" {...register("Email", { required: true })} placeholder="Email" />
//                 <input type="password" {...register("Password", { required: true, minLength: 2 })} placeholder="Password" />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// }
"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import axios from "axios"

import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
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
import MailIcon from "@mui/icons-material/Mail"
import LockIcon from "@mui/icons-material/Lock"
import "../styles/Login.css"
import { useUserContext } from "../context/UserContext"

// Interface for login form
type LoginForm = {
  Email: string
  Password: string
}

// Interface for login response
export interface LoginResponse {
  token: string
  UserId: number
}

// Interface for token payload
interface TokenPayload {
  id: number
}

// Interface for User
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

      const response = await axios.post<LoginResponse>("https://localhost:7259/api/Auth/login", user, { headers })
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

      const response = await axios.get<User>(`https://localhost:7259/api/User/${userId}`, {
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

          // Decode token to get UserId
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
    <Container maxWidth="sm" className="login-container">
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
                  <MailIcon />
                </InputAdornment>
              ),
            }}
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
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} className="login-button">
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
  )
}

export default Login

