import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";
import { jwtDecode } from "jwt-decode";


// ייבוא הממשק
export interface LoginResponse {
    token: string; // ה-token שתקבל מהשרת
    UserId: number; // ה-UserId של המשתמש
}

interface TokenPayload {
    UserId: number; // או את סוג ה-ID הנכון
}

export default function Login() {
    const { register, handleSubmit } = useForm<{ Email: string; Password: string }>();
    const { setMyUser } = useUserContext();
    const navigate = useNavigate();

    const loginUser = async (user: { Email: string; Password: string }): Promise<LoginResponse | null> => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            const response = await axios.post<LoginResponse>('https://localhost:7259/api/Auth/login', user, { headers });
            return response.data; // החזר את התגובה עצמה
        } catch (error) {
            console.error("Login error:", error);
            return null; // החזר null במקרה של שגיאה
        }
    };

    const fetchUserDetails = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must login to view user details");
                return null; // החזר null אם הטוקן לא קיים
            }
            
            const response = await axios.get<User>(`https://localhost:7259/api/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                }
            });
    
            console.log("User details fetched:", response.data);
            return response.data; // החזר את התגובה עצמה
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null; // החזר null במקרה של שגיאה
        }
    };
    
    const onSubmit: SubmitHandler<{ Email: string; Password: string }> = async (data) => {
        console.log("Form submitted with data:", data);
        
        try {
            const response = await loginUser(data);
            
            if (response) {
                console.log("logged in");
                const token = response.token; // גישה לטוקן
                
                if (token) {
                    localStorage.setItem('token', token); // שמור את הטוקן ב-local storage
                    console.log("Token saved:", token);
    
                    // שליפת ה-UserId מה-local storage
                    const userId = localStorage.getItem('UserId');
                    if (userId) {
                        const userDetails = await fetchUserDetails(Number(userId));
                        if (userDetails) {
                            const user: User = {
                                UserId: userDetails.UserId,
                                UserName: userDetails.UserName,
                                Email: userDetails.Email,
                                Phone: userDetails.Phone,
                                Password: data.Password, // או מה שצריך
                            };
                            
                            setMyUser(user); // עדכון כאן
                        } else {
                            console.error("Failed to fetch user details.");
                        }
                    } else {
                        console.error("UserId is undefined in local storage.");
                    }
                }
            } else {
                console.log("logged out");
                navigate('/register');
            }
        } catch (error) {
            console.log("Error during login:", error);
        }
    };
    
    
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("Email", { required: true })} placeholder="Email" />
                <input type="password" {...register("Password", { required: true, minLength: 2 })} placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
