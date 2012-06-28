using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Text;
using ProjectManager.DataManager;
using ProjectManager.ViewModels;

namespace ProjectManager.Models
{
    public class Project : ISavable
    {
        public int ProjectID { get; set; }

        [Required]
        [Display(Name = "Short Description")]
        public string Title { get; set; }
        public string Detail { get; set; }
        public bool Completed { get; set; }
        public IEnumerable<SubTask> SubTasks { get; set; }
    }
}