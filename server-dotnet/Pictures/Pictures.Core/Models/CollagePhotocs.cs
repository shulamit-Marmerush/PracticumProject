using System;

namespace Pictures.Core.Models
{
    /// <summary>
    /// טבלת קשר בין קולאז' לתמונות
    /// </summary>
    public class CollagePhoto
    {
        public int CollagePhotoId { get; set; }
        public int CollageId { get; set; }
        public int PhotoId { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int ZIndex { get; set; }
        public double Rotation { get; set; }

        // קשרים
        public Collage Collage { get; set; }
        public Photo Photo { get; set; }

        public CollagePhoto()
        {
            
        }

        public CollagePhoto(int collagePhotoId, int collageId, int photoId, int positionX, int positionY, int width, int height, int zIndex, double rotation)
        {
            CollagePhotoId = collagePhotoId;
            CollageId = collageId;
            PhotoId = photoId;
            PositionX = positionX;
            PositionY = positionY;
            Width = width;
            Height = height;
            ZIndex = zIndex;
            Rotation = rotation;
          
        }
    }
}