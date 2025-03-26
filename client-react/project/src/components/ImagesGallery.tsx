import React, { useState } from 'react';
import '../styles/ImagesGallery.css';

interface Photo {
  Url: string;
  Title: string;
}

interface AlbumModalProps {
  uploadedPhotos: Photo[];
  onClose: () => void;
  onUpload: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ uploadedPhotos, onClose, onUpload }) => {
  const [albumName, setAlbumName] = useState<string>('');
  const [albumDescription, setAlbumDescription] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handleCreateAlbum = () => {
    console.log("Album Created: ", albumName, albumDescription);
    
    console.log("Uploaded Photos: ", uploadedPhotos); // הוסף את השורה הזו

    onUpload(); // קריאה לפונקציה להעלאת התמונות
    onClose(); // סגירת המודאל
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
    console.error(`Failed to load image: ${uploadedPhotos[index].Url}`);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>בחר תמונות לאלבום</h2>
        <div className="image-gallery">
          {uploadedPhotos.map((photo, index) => (
            <div className="image-container" key={index}>
              <img 
                src={imageErrors[index] ? 'C:\Users\User\Saved Games\Desktop\פונטים חינמיים להעברה לתלמידות קבוצות פרימיום\Pictures\\888-10.jpg' : photo.Url} 
                alt={photo.Title} 
                className="gallery-image"
                onError={() => handleImageError(index)} 
              />
              <div className="image-title">{photo.Title}</div>
            </div>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="שם האלבום" 
          value={albumName} 
          onChange={(e) => setAlbumName(e.target.value)} 
          className="album-input"
        />
        <textarea 
          placeholder="תיאור האלבום" 
          value={albumDescription} 
          onChange={(e) => setAlbumDescription(e.target.value)} 
          className="album-textarea"
        />
        <button onClick={handleCreateAlbum} className="create-album-button">צור אלבום</button>
      </div>
    </div>
  );
};

export default AlbumModal;