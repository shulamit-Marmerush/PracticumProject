// import { useForm, SubmitHandler } from "react-hook-form";
// import { useUserContext } from "../context/UserContext";
// import axios from "axios";
// import { TextField, Button, Container, Typography } from '@mui/material';
// import { useNavigate } from "react-router-dom";
// import { object, string } from "yup";
// import { yupResolver } from '@hookform/resolvers/yup';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles(() => ({
//     backgroundImage: {
//         backgroundImage: 'url("./images/7.png")', 
//         height: '100vh',
//         width: '100%',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     formContainer: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: '15px',
//         padding: '30px',
//         boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
//         width: '100%', 
//         maxWidth: '400px',
//     },
//     submitButton: {
//         backgroundColor: '#6200ea',
//         color: '#fff',
//         '&:hover': {
//             backgroundColor: '#3700b3',
//         },
//     },
//     textField: {
//         marginBottom: '16px',
//     },
// }));

// // סכימת וואפ
// const validationSchema = object({
//     UserName: string().required("UserName is required").max(20, "UserName cannot be more than 20 characters"),
//     Password: string().required("Password is required").min(6, "Password must be at least 6 characters"),
//     Phone: string().required("Phone is required"),
//     Email: string().required("Email is required").email("Email is not valid"),
// });

// // סוג חדש עבור הטופס
// type RegisterForm = {
//     UserName: string; 
//     Password: string; 
//     Phone: string; 
//     Email: string;
// };

// // סוג User
// export type User = {
//     UserId: number;
//     UserName: string;
//     Email: string;
//     Phone: string;
//     Password: string;   
// };

// export default function Register() {
//     const classes = useStyles();
//     const navigate = useNavigate();
    
//     const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
//         resolver: yupResolver(validationSchema),
//     });
    
//     const { setMyUser } = useUserContext();    

//     const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
//         try {
//             console.log("submitted");
//             const response = await registerUser(data);
//             console.log(response);
//             localStorage.setItem('UserId', (response.UserId).toString());
//             setMyUser({ ...data, UserId: response.UserId });
//             // navigate('/recipes');
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const registerUser = async (user: RegisterForm): Promise<User> => {
//         try {
//             const response = await axios.post<{ userId: number }>('https://localhost:7259/api/User/register', user, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
            
//             console.log("Registration response:", response.data);
//             return { UserId: response.data.userId, ...user }; // כאן מתקן את השם ל-userId
//         } catch (error) {
//             console.error("Registration error:", error);
//             throw new Error("Failed to register user.");
//         }
//     };
    
    
//     return (
//         <div className={classes.backgroundImage}>
//             <Container className={classes.formContainer}>
//                 <Typography variant="h4" component="h1" gutterBottom align="center">
//                     Registration
//                 </Typography>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <TextField 
//                         {...register("UserName")} 
//                         label="UserName" 
//                         variant="outlined" 
//                         fullWidth 
//                         className={classes.textField}
//                         error={!!errors.UserName}
//                         helperText={errors.UserName ? errors.UserName.message : ''}
//                     />
//                     <TextField 
//                         type="password" 
//                         {...register("Password")} 
//                         label="Password" 
//                         variant="outlined" 
//                         fullWidth 
//                         className={classes.textField}
//                         error={!!errors.Password}
//                         helperText={errors.Password ? errors.Password.message : ''}
//                     />
//                     <TextField 
//                         {...register("Phone")} 
//                         label="Phone" 
//                         variant="outlined" 
//                         fullWidth 
//                         className={classes.textField}
//                         error={!!errors.Phone}
//                         helperText={errors.Phone ? errors.Phone.message : ''}
//                     />
//                     <TextField 
//                         {...register("Email")} 
//                         label="Email" 
//                         variant="outlined" 
//                         fullWidth 
//                         className={classes.textField}
//                         error={!!errors.Email}
//                         helperText={errors.Email ? errors.Email.message : ''}
//                     />
//                     <Button type="submit" variant="contained" className={classes.submitButton} fullWidth>
//                         Register
//                     </Button>
//                 </form>
//             </Container>
//         </div>
//     );
// }
"use client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

import MailIcon from "@mui/icons-material/Mail"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LockIcon from "@mui/icons-material/Lock"
import "../styles/Register.css"
import { useUserContext } from "../context/UserContext"

// Form validation schema
const validationSchema = yup.object({
  UserName: yup.string().required("Username is required").max(20, "Username cannot be more than 20 characters"),
  Password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  Phone: yup.string().required("Phone is required"),
  Email: yup.string().required("Email is required").email("Email is not valid"),
})

// Form type
type RegisterForm = {
  UserName: string
  Password: string
  Phone: string
  Email: string
}

// User type
export type UserType = {
  UserId: number
  UserName: string
  Email: string
  Phone: string
  Password: string
}

const Register = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
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
      // navigate('/recipes');
    } catch (error) {
      console.error(error)
    }
  }

  const registerUser = async (user: RegisterForm): Promise<UserType> => {
    try {
      const response = await axios.post<{ userId: number }>("https://localhost:7259/api/User/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Registration response:", response.data)
      return { UserId: response.data.userId, ...user }
    } catch (error) {
      console.error("Registration error:", error)
      throw new Error("Failed to register user.")
    }
  }

  return (
    <Container maxWidth="sm" className="register-container">
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
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
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
                  <LockIcon />
                </InputAdornment>
              ),
            }}
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
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
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
                  <MailIcon />
                </InputAdornment>
              ),
            }}
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
  )
}

export default Register

