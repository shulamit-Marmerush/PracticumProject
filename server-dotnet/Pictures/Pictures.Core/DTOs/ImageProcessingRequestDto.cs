namespace Pictures.Core.DTOs
{
    /// <summary>
    /// בקשה לעיבוד תמונה
    /// </summary>
    public class ImageProcessingRequestDto
    {
        public int? PhotoId { get; set; }
        public bool DetectObjects { get; set; } = true;
        public bool DetectColors { get; set; } = true;
        public bool GenerateCaption { get; set; } = true;
        public bool EnhanceImage { get; set; } = false;
        public bool UseFallback { get; set; } = true;
    }
}
