import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "../types/User";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    backgroundImage: {
        backgroundImage: 'url("./images/7.png")', 
        height: '100vh',
        width: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // צבע רקע בהיר יותר
        borderRadius: '15px', // פינות מעוגלות יותר
        padding: '30px', // רווח פנימי גדול יותר
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // צל רך יותר
        width: '100%', 
        maxWidth: '400px',
    },
    submitButton: {
        backgroundColor: '#6200ea',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#3700b3',
        },
    },
    textField: {
        marginBottom: '16px', // רווח בין השדות
    },
}));

const validationSchema = object({
    UserName: string().required("UserName is required").max(20, "Last Name cannot be more than 20 characters"),
    Password: string().required("Password is required").min(6, "Password must be at least 6 characters"),
    Phone: string().required("Phone is required"),
    Email: string().required("Email is required").email("Email is not valid"),
});

export default function Register() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<User>({
        resolver: yupResolver(validationSchema),
    });
    const { setMyUser } = useUserContext();    

    const onSubmit: SubmitHandler<User> = async (data) => {
        try {
            console.log("submitted");
            const response = await registerUser(data);
            console.log(response);
            setMyUser(data);
            // navigate('/recipes');
        } catch (error) {
            console.error(error);
        }
    };

    const registerUser = async (user: User) => {
        try {
            const response = await axios.post<User>('https://localhost:7259/api/User/register', user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Registration error:", error);
            throw new Error("Failed to register user."); // זרוק שגיאה כדי לטפל בה מאוחר יותר
        }
    };
    
    return (
        <div className={classes.backgroundImage}>
            <Container className={classes.formContainer}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Registration
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                   
                    <TextField 
                        {...register("UserName")} 
                        label="UserName" 
                        variant="outlined" 
                        fullWidth 
                        className={classes.textField}
                        error={!!errors.UserName}
                        helperText={errors.UserName ? errors.UserName.message : ''}
                    />
                    <TextField 
                        type="password" 
                        {...register("Password")} 
                        label="Password" 
                        variant="outlined" 
                        fullWidth 
                        className={classes.textField}
                        error={!!errors.Password}
                        helperText={errors.Password ? errors.Password.message : ''}
                    />
                    <TextField 
                        {...register("Phone")} 
                        label="Phone" 
                        variant="outlined" 
                        fullWidth 
                        className={classes.textField}
                        error={!!errors.Phone}
                        helperText={errors.Phone ? errors.Phone.message : ''}
                    />
                    <TextField 
                        {...register("Email")} 
                        label="Email" 
                        variant="outlined" 
                        fullWidth 
                        className={classes.textField}
                        error={!!errors.Email}
                        helperText={errors.Email ? errors.Email.message : ''}
                    />
                    <Button type="submit" variant="contained" className={classes.submitButton} fullWidth>
                        Register
                    </Button>
                </form>
            </Container>
        </div>
    );
}
