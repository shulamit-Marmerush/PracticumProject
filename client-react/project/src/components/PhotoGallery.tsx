import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PhotoGallery: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { albumId } = useParams<{ albumId: string }>();
    interface Photo {
        photoId: number;
        albumId: number;
        title: string;
        url: string;
    }
    
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState<string>('');
    const [newUrl, setNewUrl] = useState<string>(''); // הוסף state חדש ל-URL אם צריך

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://localhost:7259/api/photo`);
                setPhotos(response.data);
            } catch (err) {
                setError('שגיאה בטעינת התמונות');
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [albumId]);

    const startEditing = async(photo: any) => {
        const photoDetails = await fetchPhotoDetails(photo.photoId);
        if (photoDetails) {
            setEditingPhotoId(photoDetails.photoId);
            setNewTitle(photoDetails.title);
            // אתה יכול לשמור גם את שאר הפרמטרים אם צריך
            // לדוגמה, אם תרצה לשמור את ה-URL:
            setNewUrl(photoDetails.url); // הוסף state חדש ל-URL אם צריך
        }
    };
    const fetchPhotoDetails = async (photoId: number) => {
        try {
            const response = await axios.get(`https://localhost:7259/api/photo/${photoId}`);
            return response.data; // מחזיר את פרטי התמונה
        } catch (err) {
            setError('שגיאה בטעינת פרטי התמונה');
            return null;
        }
    };
    
    const saveTitle = async (photoId: number) => {
        try {
            const updatedPhoto = {
                photoId: photoId,
                albumId: albumId, // אם אתה צריך לשלוח גם את ה-albumId
                title: newTitle,
                url: newUrl // הוסף את ה-URL המעודכן אם יש צורך
            };
            
            await axios.put(`https://localhost:7259/api/photo/${photoId}`, updatedPhoto);
            setPhotos(prevPhotos => 
                prevPhotos.map(photo => 
                    photo.photoId === photoId ? { ...photo, title: newTitle, url: newUrl } : photo
                )
               
            );
            setEditingPhotoId(null);
            setNewTitle('');
            // אם יש צורך, אפס גם את ה-URL
            setNewUrl(''); // אם יש לך state ל-URL
            alert('תמונה עודכנה בהצלחה!');
        } catch (err) {
            setError('שגיאה בעדכון התמונה');
        }
    };

    const deletePhoto = async (photoId: number) => {
        try {
            await axios.delete(`https://localhost:7259/api/photo/${photoId}`);
            setPhotos(prevPhotos => prevPhotos.filter(photo => photo.photoId !== photoId));
        } catch (err) {
            setError('שגיאה במחיקת התמונה');
        }
    };

    if (loading) return <div>טוען תמונות...</div>;
    if (error) return <div>{error}</div>;

    const albumPhotos = photos.filter((photo: any) => photo.albumId === Number(albumId));

    return (
        <div className="photo-gallery-modal">
            <h2>תמונות מהאלבום</h2>
            <p>אלבום ID: {albumId}</p>
            <div className="photo-gallery">
                <button onClick={onClose}>סגור</button>
                {albumPhotos.length === 0 ? (
                    <div>לא נמצאו תמונות באלבום זה</div>
                ) : (
                    albumPhotos.map((photo: any) => (
                        <div key={photo.photoId} className="photo-item">
                           <img src={photo.url} alt={photo.title} style={{ maxWidth: '100%', height: '100px' }} />
               

                            {editingPhotoId === photo.photoId ? (
                                <>
                                    <input 
                                        value={newTitle} 
                                        onChange={(e) => setNewTitle(e.target.value)} 
                                    />
                                    <button onClick={() => saveTitle(photo.photoId)}>שמור</button>
                                </>
                            ) : (
                                <>
                                    <h3>{photo.title}</h3>
                                    <button onClick={() => startEditing(photo)}>עריכה</button>
                                    <button onClick={() => deletePhoto(photo.photoId)}>מחיקה</button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;
