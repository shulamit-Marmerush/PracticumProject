import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/ImagesGallery.css';

const AlbumModal: React.FC<{ onClose: () => void; onUpload: () => void; }> = ({ onClose, onUpload }) => {
  const uploadedPhotos = useSelector((state: any) => state.uploadedPhotos);
  const [albumName, setAlbumName] = useState<string>('');
  const [albumDescription, setAlbumDescription] = useState<string>('');

  const handleCreateAlbum = () => {
    console.log("Album Created: ", albumName, albumDescription);
    console.log("Uploaded Photos: ", uploadedPhotos);
    onUpload();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>בחר תמונות לאלבום</h2>
        <div className="image-gallery">
          {uploadedPhotos.map((photo: any, index: number) => (
              console.log(photo.Url),
            <div className="image-container" key={index}>
              <img src={photo.Url} alt={photo.Title} className="gallery-image" />
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
