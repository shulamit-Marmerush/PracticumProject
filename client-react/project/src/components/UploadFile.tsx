// import React, { useState, ChangeEvent } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import AlbumModal from './AlbumGallery';

// const FileUploader: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
//   const dispatch = useDispatch();
//   const token = localStorage.getItem('token');
//   const albums = useSelector((state: any) => state.albums);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setSelectedFiles(files);
//       setShowModal(true);
//     }
//   };

//   const uploadFile = async (file: File, albumId: number) => {
//     const token = localStorage.getItem('token');

//     if (!albumId || !token) {
//         alert("נא לבחור אלבום ולהיכנס למערכת");
//         return; 
//     }

//     try {
//         const response = await axios.get(`https://localhost:7259/api/album/${albumId}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (response.status !== 200) {
//             alert("שגיאה בהעלאת התמונה, נסה שוב מאוחר יותר");
//             return;
//         }

//         const albumName = response.data.title;


//         const presignedResponse = await axios.get('https://localhost:7259/api/UploadFile/presigned-url', {
//             params: { 
//                 fileName: file.name,
//                 albumName: albumName,
//             },
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         const presignedUrl = presignedResponse.data.uploadUrl;
//         const fileUrl = presignedResponse.data.fileUrl;

//         await axios.put(presignedUrl, file, {
//             headers: {
//                 'Content-Type': file.type,
//                 'x-amz-acl': 'bucket-owner-full-control',
//             },
//         });

//         // נתוני התמונה לשליחה ל-API
//         const photoData = {
//             AlbumId: albumId, // הוספת מזהה האלבום
//             UserId: localStorage.getItem('UserId'), // הוספת מזהה המשתמש
//             Url: fileUrl,
//             Title: file.name,
//             CreatedAt: new Date().toISOString(),
//             UpdatedAt: new Date().toISOString(),
//         };

//         // קריאת POST ל-API כדי לעדכן את הדאטה ב-database
//         try{
//           await axios.post('https://localhost:7259/api/photo', photoData, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         }
//         catch (error) {
//             console.error('שגיאה בשליחת תמונה ל-API:');
//         }
       

//         dispatch({ type: 'ADD_PHOTO', payload: photoData });
//         alert('הקובץ הועלה בהצלחה!');
//         console.log('File uploaded successfully:', fileUrl);
        
//         setShowModal(false);
//     } catch (error) {
//         console.error('שגיאה בהעלאה:', error);
//     }
// };


//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} multiple />
//       {showModal && (
//         <AlbumModal 
//         albums={albums}
//         onClose={() => setShowModal(false)} 
//         onUpload={(file: File) => uploadFile(file, selectedAlbum!)}  
//         onSelectAlbum={(albumId: number) => setSelectedAlbum(albumId)} // כאן אתה מעביר מספר
//         selectedFiles={selectedFiles} 
      
//         />
//       )}
//     </div>
//   );
// };

// export default FileUploader;
import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AlbumModal from './AlbumGallery';
import "../styles/UploadFile.css";

const FileUploader: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const albums = useSelector((state: any) => state.albums);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setShowModal(true);
    }
  };

  const uploadFile = async (file: File, albumId: number) => {
    const token = localStorage.getItem('token');

    if (!albumId || !token) {
        alert("נא לבחור אלבום ולהיכנס למערכת");
        return; 
    }

    try {
        const response = await axios.get(`https://localhost:7259/api/album/${albumId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status !== 200) {
            alert("שגיאה בהעלאת התמונה, נסה שוב מאוחר יותר");
            return;
        }

        const albumName = response.data.title;


        const presignedResponse = await axios.get('https://localhost:7259/api/UploadFile/presigned-url', {
            params: { 
                fileName: file.name,
                albumName: albumName,
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const presignedUrl = presignedResponse.data.uploadUrl;
        const fileUrl = presignedResponse.data.fileUrl;

        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
                'x-amz-acl': 'bucket-owner-full-control',
            },
        });

        // נתוני התמונה לשליחה ל-API
        const photoData = {
            AlbumId: albumId, // הוספת מזהה האלבום
            UserId: localStorage.getItem('UserId'), // הוספת מזהה המשתמש
            Url: fileUrl,
            Title: file.name,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        };

        // קריאת POST ל-API כדי לעדכן את הדאטה ב-database
        try{
          await axios.post('https://localhost:7259/api/photo', photoData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        }
        catch (error) {
            console.error('שגיאה בשליחת תמונה ל-API:');
        }
       

        dispatch({ type: 'ADD_PHOTO', payload: photoData });
        alert('הקובץ הועלה בהצלחה!');
        console.log('File uploaded successfully:', fileUrl);
        
        setShowModal(false);
    } catch (error) {
        console.error('שגיאה בהעלאה:', error);
    }
};


  return (
    <div className="upload-container">
    <div className="upload-circle">
      <div className="upload-tip">
        Click or drag your files here<br />up to <strong>2GB</strong> for free
      </div>
  
      <div className="upload-icon">
        <img src="https://resources.jumbomail.me/assets/icons/upload-home.svg" alt="Upload Icon" />
      </div>
  
      <div className="upload-buttons">
        <label className="upload-label">
          Select Files
          <input type="file" multiple onChange={handleFileChange} />
        </label>
  
        <label className="upload-label">
          Select Folder
          <input type="file" webkitdirectory="true" mozdirectory="true" directory="" {...({} as any)} />
        </label>
      </div>
    </div>
  
    {showModal && (
      <AlbumModal
        albums={albums}
        onClose={() => setShowModal(false)}
        onUpload={(file: File) => uploadFile(file, selectedAlbum!)}
        onSelectAlbum={(albumId: number) => setSelectedAlbum(albumId)}
        selectedFiles={selectedFiles}
      />
    )}
  </div>
  
  );
};

export default FileUploader;


