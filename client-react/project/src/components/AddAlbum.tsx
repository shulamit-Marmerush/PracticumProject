import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const AddAlbum = () => {
    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const { user } = useUserContext();
    const token = localStorage.getItem('token');

   
  
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!user || !token) {
            throw new Error('User is not authenticated. Please logg in.');
        }
        console.log('User:', user);

        const albumData = {
            Title: Title,
            Description: Description,
            UserId: localStorage.getItem('UserId') , // הכנס כאן את ה-ID של המשתמש המתאים
        };

        try {
            console.log('Album data:', albumData);
            
            const response = await axios.post('https://localhost:7259/api/album/album', albumData, {
                headers: {
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                }
            });
            console.log('Album created:', response.data);
            alert('Album created successfully!');
            // כאן תוכל להוסיף לוגיקה נוספת כמו רענון רשימת האלבומים או הצגת הודעת הצלחה
        } catch (error) {
            console.error('There was an error creating the album!', error);
        }
    };

    return (
        <div>
            <h2>Add Album</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={Description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Album</button>
            </form>
        </div>
    );
};

export default AddAlbum;

