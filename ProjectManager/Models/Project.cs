using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using ProjectManager.DataManager;
using ProjectManager.ViewModels;

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
        public virtual IEnumerable<SubTask> SubTasks { get; set; }

        public IList<Project> GetProjects(ProjectManagerDbContext _db)
        {
            var projects = _db.Projects.ToList();
            foreach (var project in projects)
            {
                var id = project.ProjectID;
                project.SubTasks = _db.SubTasks.Where(t => t.ProjectID == id);
            }

            return projects;
        }


    }
}