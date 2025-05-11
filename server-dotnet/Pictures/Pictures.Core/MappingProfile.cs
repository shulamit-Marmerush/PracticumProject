using AutoMapper;
using Pictures.Core.DTOs;
using Pictures.Core.models;
using Pictures.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace Pictures.Core
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<User,UserDto>().ReverseMap();
            CreateMap<Photo,PhotoDto>().ReverseMap();
            CreateMap<Album, AlbumDto>().ReverseMap();



        }
    }
}
