using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ProjectManager.Models;
using ProjectManager.ViewModels;

namespace ProjectManager.Maps
{
    public class ProjectMap
    {
        public static void Init()
        {
            AutoMapper.Mapper.CreateMap<Project, ProjectModel>();
            AutoMapper.Mapper.CreateMap<ProjectModel, Project>();
            AutoMapper.Mapper.CreateMap<SubTask, SubTaskViewModel>();
            AutoMapper.Mapper.CreateMap<SubTaskViewModel, SubTask>();
        }
    }
}