import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import AlbumModal from './ImagesGallery';

const FileUploader: React.FC = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const handleFolderChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const folderFiles = Array.from(e.target.files);
      await uploadFolder(folderFiles);
    }
  };

  const uploadFile = async (file: File) => {
    if (!token) {
      alert("you must login to upload");
      return; 
    }

    try {
      const response = await axios.get('https://localhost:7259/api/UploadFile/presigned-url', {
        params: { 
          fileName: file.name,
          contentType: file.type 
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const presignedUrl = response.data.url;
      const fileUrl = response.data.fileUrl; // ה-URL הקבוע של הקובץ

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

      setUploadedPhotos(prev => [...prev, photoData]);
      alert('הקובץ הועלה בהצלחה!');
      setShowModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('שגיאה בהעלאה:', error.response?.data || error.message);
      } else {
        console.error('שגיאה בלתי צפויה:', error);
      }
    }
  };

  const uploadFolder = async (folderFiles: File[]) => {
    if (!token) {
      alert("you must login to upload");
      return; 
    }

    const folderName = "images"; 

    try {
      const response = await axios.post('https://localhost:7259/api/UploadFolder/presigned-urls', {
        folderName: folderName,
        fileNames: folderFiles.map(file => file.name)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const presignedUrls = response.data.urls;
      const fileUrls = response.data.fileUrls; // ה-URL הקבוע של הקבצים

      for (let i = 0; i < folderFiles.length; i++) {
        const presignedUrl = presignedUrls[i];
        const fileUrl = fileUrls[i];

        await axios.put(presignedUrl, folderFiles[i], {
          headers: {
            'Content-Type': folderFiles[i].type,
            'x-amz-acl': 'bucket-owner-full-control',
          },
        });

        const photoData = {
          Url: fileUrl,
          Title: folderFiles[i].name,
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString(),
        };

        setUploadedPhotos(prev => [...prev, photoData]);
      }
      alert('כל הקבצים הועלו בהצלחה!');
      setShowModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('שגיאה בהעלאה:', error.response?.data || error.message);
      } else {
        console.error('שגיאה בלתי צפויה:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input type="file" multiple ref={input => { if (input) input.webkitdirectory = true; }} onChange={handleFolderChange} />
      
      {showModal && (
        <AlbumModal 
          uploadedPhotos={uploadedPhotos} 
          onClose={closeModal} 
          onUpload={() => { /* לוגיקה נוספת אם צריך */ }} 
        />
      )}
    </div>
  );
};

export default FileUploader;
// import React, { useState, ChangeEvent } from 'react';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
// import AlbumModal from './ImagesGallery';


// const FileUploader: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const dispatch = useDispatch();
//   const token = localStorage.getItem('token');

//   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const file = e.target.files[0];
//       await uploadFile(file);
//     }
//   };

//   const uploadFile = async (file: File) => {
//     if (!token) {
//       alert("you must login to upload");
//       return; 
//     }

//     try {
//       const response = await axios.get('https://localhost:7259/api/UploadFile/presigned-url', {
//         params: { 
//           fileName: file.name,
//           contentType: file.type 
//         },
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const presignedUrl = response.data.url;
//       const fileUrl = response.data.fileUrl;

//       await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//           'x-amz-acl': 'bucket-owner-full-control',
//         },
//       });

//       const photoData = {
//         Url: fileUrl,
//         Title: file.name,
//         CreatedAt: new Date().toISOString(),
//         UpdatedAt: new Date().toISOString(),
//       };

//       dispatch({ type: 'ADD_PHOTO', payload: photoData });
//       alert('הקובץ הועלה בהצלחה!');
//       setShowModal(true);
//     } catch (error) {
//       console.error('שגיאה בהעלאה:', error);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {showModal && (
//         <AlbumModal 
//           onClose={closeModal} 
//           onUpload={() => { /* לוגיקה נוספת אם צריך */ }} 
//         />
//       )}
//     </div>
//   );
// };

// export default FileUploader;
