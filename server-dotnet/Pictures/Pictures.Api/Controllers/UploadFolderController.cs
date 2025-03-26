using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Api.Controllers
{
    [Route("api/UploadFolder")]
    [ApiController]
    public class UploadFolderController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public UploadFolderController(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
        }
        [HttpPost("presigned-urls")]
        public async Task<IActionResult> GetPresignedUrls([FromBody] UploadRequest request)
        {
            if (string.IsNullOrEmpty(request.FolderName) || request.FileNames == null || request.FileNames.Count == 0)
                return BadRequest("שם תיקיה ושמות קבצים נדרשים");

            var urls = new List<string>();

            foreach (var fileName in request.FileNames)
            {
                var urlRequest = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = $"{request.FolderName}/{fileName}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    ContentType = "image/jpeg"
                };

                urlRequest.Headers["x-amz-acl"] = "bucket-owner-full-control";

                try
                {
                    string url = _s3Client.GetPreSignedURL(urlRequest);
                    urls.Add(url);
                }
                catch (AmazonS3Exception ex)
                {
                    return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות עבור {fileName}: {ex.Message}");
                }
            }

            return Ok(urls);
        }
    }
}
public class UploadRequest
{
    public string FolderName { get; set; }
    public List<string> FileNames { get; set; }
}