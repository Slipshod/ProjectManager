using ProjectManager.Models;
using ProjectManager.ViewModels;

namespace ProjectManager.Maps
{
    public class SubTaskMap
    {
        public static void Init()
        {
            AutoMapper.Mapper.CreateMap<SubTask, SubTaskViewModel>();
            AutoMapper.Mapper.CreateMap<SubTaskViewModel, SubTask>();            
        }

    }
}