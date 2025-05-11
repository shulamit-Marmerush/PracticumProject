using AutoMapper;
using Pictures.Api.Models;
using Pictures.Api.PutModel;
using Pictures.Core.DTOs;
using Pictures.Core.Models;

namespace Pictures.Api
{
    public class MapingProfileApi : Profile
    {
        public MapingProfileApi()
        {
            CreateMap<UserPostModel, User>().ReverseMap();
            CreateMap<AlbumPostModel,Album>().ReverseMap();
      
            CreateMap<PhotoPostModel,Photo>().ReverseMap();
            CreateMap<PhotoPutModel, Photo>().ReverseMap();
        }
    }
}
