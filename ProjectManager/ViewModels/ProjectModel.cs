using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ProjectManager.Models;

namespace ProjectManager.ViewModels
{
    public class ProjectModel
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string Detail { get; set; }
        public bool Completed { get; set; }
        public ICollection<SubTask> SubTasks { get; set; } 
    }
}