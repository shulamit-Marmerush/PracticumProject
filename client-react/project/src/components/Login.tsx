// UserResponse.ts
export interface UserResponse {
    Email: string;
    token: string; // טוקן הוא תכונה חובה
}

// Login.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";


export default function Login() {
    const { register, handleSubmit } = useForm<{ Email: string; Password: string }>();
    const { setMyUser } = useUserContext();
    const navigate = useNavigate();

    const loginUser = async (user: { Email: string; Password: string }) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            const response = await axios.post<UserResponse>('https://localhost:7259/api/Auth/login', user, { headers });
            return response.data; // החזר את התגובה עצמה
        } catch (error) {
            console.error("Login error:", error);
            return null; // החזר null במקרה של שגיאה
        }
    }
    
    const onSubmit: SubmitHandler<{ Email: string; Password: string }> = async (data) => {
        console.log("Form submitted with data:", data);
        
        try {
            const response = await loginUser(data);
            
            if (response) {
                console.log("logged in");
                alert("logged in");
                console.log(response.token);
                
                const token = response.token; // גישה לטוקן
                if (token) {
                    localStorage.setItem('token', token); // שמור את הטוקן ב-local storage
                }
                
                // יצירת אובייקט User מתוך UserResponse
                const user: User = {
                    UserId: undefined, // או ערך אחר אם יש לך
                    UserName: "defaultUser", // ערך ברירת מחדל
                    Email: response.Email,
                    Phone: "0000000000", // ערך ברירת מחדל
                    Password: data.Password, // או מה שצריך
                };
                
                setMyUser(user); // עדכון כאן
                navigate('/recipes'); // נווט לעמוד המתכון
            } else {
                console.log("logged out");
                navigate('/register');
            }
        } catch (error) {
            console.log("Error during login:", error);
        }
    }
    
    
    
    return (
        <div>
            <form onSubmit={handleSubmit((data) => { 
                console.log("Submitting form..."); // הוסף שורה זו
                onSubmit(data); 
            })}>
                <input type="text" {...register("Email", { required: true })} placeholder="Email" />
                <input type="password" {...register("Password", { required: true, minLength: 2 })} placeholder="Password" />
                <button type="submit">Login </button>
            </form>
        </div>
    )
}
