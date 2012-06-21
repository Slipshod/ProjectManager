using ProjectManager.Models;
using ProjectManager.ViewModels;

namespace ProjectManager.Maps
{
    public class ProjectMap
    {
        public static void Init()
        {
            AutoMapper.Mapper.CreateMap<Project, ProjectViewModel>();
            AutoMapper.Mapper.CreateMap<ProjectViewModel, Project>();

        }
    }
}