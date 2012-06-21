using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectManager.ViewModels
{
    public class SubTaskViewModel
    {
        public int SubTaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public virtual int ProjectId { get; set; }
//        public DateTime Created { get; set; }
    }
}