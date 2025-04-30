import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, CircularProgress, Typography, Button, TextField, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

interface Folder {
    albumId: number;
    title: string;
    userId: number;
    description: string;
}

interface FolderListProps {
    albums: Folder[];
    onSelectAlbum: (albumId: number) => void;
    showCheckboxes: boolean;
    selectedAlbums: number[];
    onToggleSelect: (albumId: number) => void;
}

const FolderList: React.FC<FolderListProps> = ({ onSelectAlbum, showCheckboxes, selectedAlbums, onToggleSelect }) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState<string>('');
    const [currentDescription, setCurrentDescription] = useState<string>('');
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            const token = localStorage.getItem('token');
            const userId = Number(localStorage.getItem('UserId'));

            if (!token) {
                setError("User is not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://localhost:7259/api/album', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userFolders = response.data.filter((folder: Folder) => {
                    return Number(folder.userId) === userId;
                });
                setFolders(userFolders);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.message) {
                    setError(err.message);
                } else {
                    setError('שגיאה לא ידועה');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <div>שגיאה: {error}</div>;

    const openFolder = (albumId: number) => {
        navigate(`/PhotoGallery/${albumId}`); // Navigate to the PhotoGallery component with the selected album ID
    };

    const deleteFolder = async (folderId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User is not authenticated. Please log in.");
            return;
        }

        try {
            await axios.delete(`https://localhost:7259/api/album/${folderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setFolders(prevFolders => prevFolders.filter(folder => folder.albumId !== folderId));
            alert("התיקיה נמחקה בהצלחה.");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.message) {
                alert(`שגיאה במחיקת תיקיה: ${err.message}`);
            } else {
                alert('שגיאה לא ידועה');
            }
        }
    };

    const startEditing = (folder: Folder) => {
        setEditingFolderId(folder.albumId);
        setNewTitle(folder.title);
        setCurrentDescription(folder.description);
    };

    const saveTitle = async (folderId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User is not authenticated. Please log in.");
            return;
        }

        try {
            await axios.put(`https://localhost:7259/api/album/${folderId}`, { 
                albumId: folderId, 
                title: newTitle, 
                userId: localStorage.getItem('UserId'), 
                description: currentDescription 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setFolders(prevFolders => 
                prevFolders.map(folder => 
                    folder.albumId === folderId ? { ...folder, title: newTitle, description: currentDescription } : folder
                )
            );
            setEditingFolderId(null);
            setNewTitle('');
            setCurrentDescription('');
            alert("שם התיקיה עודכן בהצלחה.");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.message) {
                alert(`שגיאה בעדכון שם התיקיה: ${err.message}`);
            } else {
                alert('שגיאה לא ידועה');
            }
        }
    };

    return (
        <div>
            <h1>אלבומים של המשתמש</h1>
            <Grid container spacing={2}>
                {folders.map((folder, index) => (
                    <Grid key={index}>
                        <div 
                            style={{ 
                                cursor: 'pointer', 
                                textAlign: 'center', 
                                border: '1px solid #ccc', 
                                borderRadius: '5px', 
                                padding: '10px', 
                                backgroundColor: '#f7f7f7', 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s',
                            }}
                          
                        >
                            {showCheckboxes && (
                                <Checkbox
                                    checked={selectedAlbums.includes(folder.albumId)}
                                    onChange={() => onToggleSelect(folder.albumId)}
                                />
                            )}
                            <img 
                                src="./images/folder.jpg" 
                                alt={`תיקיה בשם ${folder.title}`} 
                                style={{ width: '60px', height: '60px' }} 
                                onClick={() => openFolder(folder.albumId)}
                            />
                            {editingFolderId === folder.albumId ? (
                                <>
                                    <TextField 
                                        value={newTitle} 
                                        onChange={(e) => setNewTitle(e.target.value)} 
                                        variant="outlined" 
                                        size="small" 
                                        style={{ marginTop: '8px' }} 
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => saveTitle(folder.albumId)} 
                                        style={{ marginTop: '8px' }}
                                    >
                                        שמור
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" style={{ marginTop: '8px' }}>
                                        {folder.title}
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => startEditing(folder)}  
                                        style={{ marginTop: '8px', minWidth: '40px' }}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFolder(folder.albumId);
                                        }}
                                        style={{ marginTop: '8px', minWidth: '40px' }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </>
                            )}
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default FolderList;
