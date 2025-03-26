using Microsoft.AspNetCore.Mvc;
using Pictures.Service;
using System.Threading.Tasks;

using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3.Model;


namespace Pictures.Api.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    //    public class UploadFileController : ControllerBase
    //    {
    //        private readonly S3Service _s3Service;

    //        public UploadFileController(S3Service s3Service)
    //        {
    //            _s3Service = s3Service;
    //        }

    //        // שלב 1: קבלת URL להעלאת קובץ ל-S3
    //        [HttpGet("upload-url")]
    //        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
    //        {
    //            if (string.IsNullOrEmpty(fileName))
    //                return BadRequest("Missing file name");

    //            try
    //            {
    //                var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);
    //                return Ok(new { url });
    //            }
    //            catch (Exception ex)
    //            {
    //                return StatusCode(500, $"Internal server error: {ex.Message}");
    //            }
    //        }

    //        // שלב 2: קבלת URL להורדת קובץ מה-S3
    //        [HttpGet("download-url/{fileName}")]
    //        public async Task<IActionResult> GetDownloadUrl(string fileName)
    //        {
    //            try
    //            {
    //                var url = await _s3Service.GetDownloadUrlAsync(fileName);
    //                return Ok(new { downloadUrl = url });
    //            }
    //            catch (Exception ex)
    //            {
    //                return StatusCode(500, $"Internal server error: {ex.Message}");
    //            }
    //        }
    //    }
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
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("שם הקובץ נדרש");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = $"Images/{fileName}", // קבצים נשמרים בתיקיית exams
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = "image/jpeg"
            };

            //  הוספת כותרת ACL כדי לוודא שהבאקט הוא הבעלים
            request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {
                //Response.Headers.Append("Access-Control-Allow-Origin", "*");
                //Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT");
                //Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type");

                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות: {ex.Message}");
            }
        }


    }

}
