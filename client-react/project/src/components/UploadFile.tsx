import React, { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AlbumModal from './ImagesGallery';

const FileUploader: React.FC = () => {
  const closeModal = () => {
    setShowModal(false);
  };
  
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const albumName = "default-album"; // כאן תוכל לשים שם אלבום ברירת מחדל או לקבל אותו מהמשתמש
      await uploadFile(file, albumName);
    }
  };

  const uploadFile = async (file: File, albumName: string) => {
    if (!token) {
        alert("you must login to upload");
        return; 
    }

    try {
        const response = await axios.get('https://localhost:7259/api/UploadFile/presigned-url', {
            params: { 
                fileName: file.name,
                albumName: albumName, // הוסף את שם האלבום כאן
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // בדוק אם התגובה מכילה את השדות הנדרשים
        if (!response.data.uploadUrl || !response.data.fileUrl) {
            throw new Error('Missing uploadUrl or fileUrl in response');
        }

        const presignedUrl = response.data.uploadUrl;
        const fileUrl = response.data.fileUrl;

        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
                'x-amz-acl': 'bucket-owner-full-control',
            },
        });

        const photoData = {
            Url: fileUrl,
            Title: file.name,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_PHOTO', payload: photoData });
        alert('הקובץ הועלה בהצלחה!');
        setShowModal(true);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('שגיאה בהעלאה:', error.response?.data || error.message);
        } else {
            console.error('שגיאה בהעלאה:', error);
        }
    }
};

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {showModal && (
        <AlbumModal 
          onClose={closeModal} 
          onUpload={() => { /* לוגיקה נוספת אם צריך */ }} 
        />
      )}
    </div>
  );
};

export default FileUploader;
