// import React, { useState } from 'react';
// import axios from 'axios';
// import { useUserContext } from '../context/UserContext';

// const AddAlbum = () => {
//     const [Title, setTitle] = useState('');
//     const [Description, setDescription] = useState('');
//     const { user } = useUserContext();
//     const token = localStorage.getItem('token');

   
  
    
//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if(!user || !token) {
//             throw new Error('User is not authenticated. Please logg in.');
//         }
//         console.log('User:', user);

//         const albumData = {
//             Title: Title,
//             Description: Description,
//             UserId: localStorage.getItem('UserId') , // הכנס כאן את ה-ID של המשתמש המתאים
//         };

//         try {
//             console.log('Album data:', albumData);
            
//             const response = await axios.post('https://localhost:7259/api/album/album', albumData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
//                 }
//             });
//             console.log('Album created:', response.data);
//             alert('Album created successfully!');
//             // כאן תוכל להוסיף לוגיקה נוספת כמו רענון רשימת האלבומים או הצגת הודעת הצלחה
//         } catch (error) {
//             console.error('There was an error creating the album!', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Add Album</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Title:</label>
//                     <input
//                         type="text"
//                         value={Title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Description:</label>
//                     <textarea
//                         value={Description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Create Album</button>
//             </form>
//         </div>
//     );
// };

// export default AddAlbum;
"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"

import { TextField, Button, Container, Typography, Box, Paper, Alert, CircularProgress } from "@mui/material"
import FolderPlusIcon from "@mui/icons-material/CreateNewFolder"
import "../styles/AddAlbum.css"
import { useUserContext } from "../context/UserContext"

const AddAlbum = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUserContext()
  const token = localStorage.getItem("token")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    if (!user || !token) {
      setError("User is not authenticated. Please log in.")
      setLoading(false)
      return
    }

    const albumData = {
      Title: title,
      Description: description,
      UserId: localStorage.getItem("UserId"),
    }

    try {
      console.log("Album data:", albumData)

      const response = await axios.post("https://localhost:7259/api/album/album", albumData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Album created:", response.data)
      setSuccess(true)
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("There was an error creating the album!", error)
      setError("Failed to create album. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" className="add-album-container">
      <Paper elevation={0} className="add-album-paper">
        <Box className="add-album-header">
          <FolderPlusIcon className="add-album-icon" />
          <Typography variant="h4" component="h1" className="add-album-title">
            Create New Album
          </Typography>
          <Typography variant="body1" className="add-album-subtitle">
            Create a new album to organize your photos
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="add-album-alert">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="add-album-alert">
            Album created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Album Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            className="add-album-button"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Album"}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default AddAlbum


