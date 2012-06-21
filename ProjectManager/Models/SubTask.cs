using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectManager.Models
{
    public class SubTask
    {
        public int SubTaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public virtual int ProjectId { get; set; }
//        public DateTime Created { get; set; }
    }
}
