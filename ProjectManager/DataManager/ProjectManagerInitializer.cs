using System;
using System.Collections.Generic;
using ProjectManager.Models;
using System.Data.Entity;

namespace ProjectManager.DataManager
{
    public class ProjectManagerInitializer : DropCreateDatabaseIfModelChanges<ProjectManagerDbContext>
    {
        
        protected override void Seed(ProjectManagerDbContext context)
        {
            var project = new List<Project>
                              {
                                  new Project {Title = "MVC Breakable Toy", Detail = "Build a breakable toy", Completed = true},
                                  new Project {Title = "Implement WebParts", Detail = "After the toy is built, implement WebParts", Completed = false, },
                                  new Project {Title = "Implement partial views", Detail = "Add the use of partial views to the Project Manager", Completed = false },
                                  new Project {Title = "Get some snacks", Detail = "Cheetos.", Completed = true },
                                  new Project {Title = "The model has changed", Detail = "This is just to know that the database was recreated due to the model changing", Completed = true }
                              };
            project.ForEach(p=> context.Projects.Add(p));
            context.SaveChanges();
        }
    }
}