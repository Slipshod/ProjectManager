using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectManager.ViewModels
{
    public class ProjectModel
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string Detail { get; set; }
        //public DateTime Created { get; set; }
        public bool Completed { get; set; }
    }
}