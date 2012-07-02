using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using AutoMapper;
using ProjectManager.DataManager;
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

        public void Create(ProjectManagerDbContext db)
        {
            var project = Mapper.Map<ProjectViewModel, Project>(this);
            db.Projects.Add(project);
            db.SaveChanges();
        }

        public void Edit(ProjectManagerDbContext db)
        {
            var project = Mapper.Map<ProjectViewModel, Project>(this);
            db.Entry(project).State = EntityState.Modified;
            db.SaveChanges();
        }
    }
}