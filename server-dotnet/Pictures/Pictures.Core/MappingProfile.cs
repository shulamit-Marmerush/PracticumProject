using AutoMapper;
using Pictures.Core.DTOs;
using Pictures.Core.Models;

namespace Pictures.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<Album, AlbumDto>().ReverseMap();

            // מיפויים חדשים
            CreateMap<ImageProcessingResult, ImageProcessingResultDto>().ReverseMap();
            CreateMap<Collage, CollageResultDto>()
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.CollagePhotos.Select(cp => cp.Photo)))
                .ReverseMap();
            //CreateMap<CollageSettings, CollageSettingsDto>().ReverseMap();
        }
    }
}