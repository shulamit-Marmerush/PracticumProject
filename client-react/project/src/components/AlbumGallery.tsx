import React, { useState, useEffect } from 'react';
import "../styles/AlbumGallery.css";
import FolderList from './Albums';
import axios from 'axios';

type Folder = {
    albumId: number;
    title: string;
    userId: number;
    description: string;
};

const AlbumModal: React.FC<{ 
    albums: Folder[]; 
    onClose: () => void; 
    onUpload: (file: File, albumId: number) => void; 
    onSelectAlbum: (album: number) => void; 
    selectedFiles: File[]; // קלט חדש
}> = ({ albums = [], onClose, onUpload, onSelectAlbum, selectedFiles }) => {
    const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    const handleToggleSelect = (albumId: number) => {
        setSelectedAlbums((prev) => 
            prev.includes(albumId) ? prev.filter(id => id !== albumId) : [...prev, albumId]
        );
        onSelectAlbum(albumId);
    };

    const handleSave = () => {
        if (selectedFiles.length > 0 && selectedAlbums.length > 0) {
            const albumId = selectedAlbums[0];
            selectedFiles.forEach(file => {
                onUpload(file, albumId);
            });
            // localStorage.setItem('selectedAlbums', JSON.stringify(selectedAlbums));
        } else {
            alert("נא לבחור קובץ להעלאה ולבחור אלבום.");
        }
    };

    const fetchPhotos = async (albumId: number) => {
        try {
            const response = await axios.get(`https://localhost:7259/api/Albums/${albumId}/photos`);
            setPhotos(response.data);
        } catch (error) {
            console.error('שגיאה בטעינת התמונות:', error);
        }
    };

    useEffect(() => {
        if (selectedAlbums.length > 0) {
            fetchPhotos(selectedAlbums[0]);
        }
    }, [selectedAlbums]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                
                <div>
                    <h3>בחר אלבום</h3> {/* כותרת "בחר אלבום" */}
                    <FolderList 
                        albums={albums} 
                        onSelectAlbum={onSelectAlbum} 
                        showCheckboxes={true} 
                        selectedAlbums={selectedAlbums} 
                        onToggleSelect={handleToggleSelect} 
                    />
                </div>
                
                <div className="photos-gallery">
                    {photos.map(photo => (
                        <img key={photo.id} src={photo.url} alt={photo.title} className="photo" />
                    ))}
                    {selectedFiles.map(file => (
                        <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} className="photo" />
                    ))}
                </div>

                {selectedFiles.length > 0 && (
                    <div>
                       
                        {selectedFiles.map(file => (
                            <p key={file.name}>{file.name}</p>
                        ))}
                    </div>
                )}
                <button onClick={handleSave}>שמור</button>
            </div>
        </div>
    );
};

export default AlbumModal;
