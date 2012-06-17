using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Data.Entity.ModelConfiguration.Conventions;
using ProjectManager.Models;

namespace ProjectManager.DataManager
{
    public class ProjectManagerDbContext : DbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<SubTask> SubTasks { get; set; }
    }
}