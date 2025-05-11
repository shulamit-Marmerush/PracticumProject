// import React, { useState } from 'react';

// // הגדרת טיפוס מותאם אישית עבור input
// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//     webkitdirectory?: boolean;
// }

// function App() {
//     const [files, setFiles] = useState<File[]>([]);

//     const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = Array.from(event.target.files || []);
//         setFiles(selectedFiles);
//     };

//     const uploadFiles = async () => {
//         if (files.length === 0) {
//             alert('Please select a folder to upload.');
//             return;
//         }

//         const formData = new FormData();
//         files.forEach(file => {
//             formData.append('files[]', file);
//         });

//         try {
//             const response = await fetch('https://your-api-endpoint/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();
//             console.log('Success:', data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div>
//             <input 
//                 type="file" 
//                 webkitdirectory 
//                 multiple 
//                 onChange={handleFolderChange} 
//             />
//             <button onClick={uploadFiles}>Upload</button>
//         </div>
//     );
// }

// export default App;
