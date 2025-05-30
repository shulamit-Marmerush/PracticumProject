//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Pictures.Core.DTOs;
//using Pictures.Core.Services;
//using System;
//using System.IO;
//using System.Threading.Tasks;

//namespace Pictures.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ImageProcessingController : ControllerBase
//    {
//        private readonly IImageProcessingService _imageProcessingService;

//        public ImageProcessingController(IImageProcessingService imageProcessingService)
//        {
//            _imageProcessingService = imageProcessingService;
//        }

//        [HttpPost("process")]
//        public async Task<ActionResult<ImageProcessingResultDto>> ProcessImage([FromBody] ImageProcessingRequestDto request)
//        {
//            if (request.PhotoId == null)
//            {
//                return BadRequest("PhotoId is required");
//            }

//            try
//            {
//                var result = await _imageProcessingService.ProcessImageAsync(request.PhotoId.Value, request);
//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { error = "Error processing image", message = ex.Message });
//            }
//        }

//        [HttpPost("upload-and-process")]
//        public async Task<ActionResult<ImageProcessingResultDto>> UploadAndProcessImage(
//            [FromForm] IFormFile file,
//            [FromQuery] bool detectObjects = true,
//            [FromQuery] bool detectColors = true,
//            [FromQuery] bool generateCaption = true,
//            [FromQuery] bool enhanceImage = false,
//            [FromQuery] bool useFallback = true)
//        {
//            if (file == null || file.Length == 0)
//            {
//                return BadRequest("No file uploaded");
//            }

//            try
//            {
//                // קריאת הקובץ למערך בתים
//                using var memoryStream = new MemoryStream();
//                await file.CopyToAsync(memoryStream);
//                var imageData = memoryStream.ToArray();

//                var request = new ImageProcessingRequestDto
//                {
//                    DetectObjects = detectObjects,
//                    DetectColors = detectColors,
//                    GenerateCaption = generateCaption,
//                    EnhanceImage = enhanceImage,
//                    UseFallback = useFallback
//                };

//                var result = await _imageProcessingService.UploadAndProcessImageAsync(imageData, file.FileName, request);
//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { error = "Error uploading and processing image", message = ex.Message });
//            }
//        }
//    }
//}
