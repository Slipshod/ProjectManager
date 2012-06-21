﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ProjectManager.Models
{
    public class Project
    {
        public int ProjectID { get; set; }

        [Required]
        [Display(Name = "Short Description")]
        public string Title { get; set; }
        public string Detail { get; set; }
        public bool Completed { get; set; }
//        public DateTime Created { get; set; }
        public ICollection<SubTask> SubTasks { get; set; } 

    }
}