// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [albumId, setAlbumId] = useState<number>(0);
//     const [userId, setUserId] = useState<number>(0);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setSelectedFile(event.target.files[0]);
//         }
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) {
//             console.error("No file selected");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         formData.append('albumId', albumId.toString());
//         formData.append('userId', userId.toString());

//         try {
//             const response = await axios.post('http://localhost:5000/api/upload/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.log('File uploaded successfully:', response.data);
//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} />
//             <input type="number" placeholder="Album ID" onChange={(e) => setAlbumId(Number(e.target.value))} />
//             <input type="number" placeholder="User ID" onChange={(e) => setUserId(Number(e.target.value))} />
//             <button onClick={handleUpload}>Upload</button>
//         </div>
//     );
// };

// export default FileUpload;
