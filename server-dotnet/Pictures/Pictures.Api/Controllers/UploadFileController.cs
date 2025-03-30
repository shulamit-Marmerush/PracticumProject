using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System.Threading.Tasks;

namespace Pictures.Api.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public UploadFileController(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string albumName)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(albumName))

            {
                fileName = "file";
                albumName = "default-album"; // החלף בשם ברירת המחדל שתרצה
            }


            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = $"{albumName}/{fileName}", // קבצים נשמרים בתיקיית האלבום
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = "image/jpeg"
            };

            request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {

                string url = _s3Client.GetPreSignedURL(request);
                string fileUrl = $"https://{_bucketName}.s3.amazonaws.com/{albumName}/{fileName}"; // URL להורדת התמונה

                return Ok(new { uploadUrl = url, fileUrl = fileUrl });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות: {ex.Message}");
            }
        }

    }
}

