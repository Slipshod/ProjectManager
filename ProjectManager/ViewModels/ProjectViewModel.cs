using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ProjectManager.Models;

namespace ProjectManager.ViewModels
{
    public class ProjectViewModel
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string Detail { get; set; }
        public bool Completed { get; set; }
        public string Stool { get; set; }
        public IEnumerable<SubTaskViewModel> SubTasks { get; set; } 
    }
}