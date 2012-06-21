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
                                  new Project {Title = "MVC Breakable Toy", Detail = "Build a breakable toy", Completed = true },
                                  new Project {Title = "Implement WebParts", Detail = "After the toy is built, implement WebParts" },
                                  new Project {Title = "Implement partial views", Detail = "Add the use of partial views to the Project Manager", Completed = false  },
                                  new Project {Title = "Get some snacks", Detail = "Cheetos.", Completed = true },
                                  new Project {Title = "The model has changed", Detail = "This is just to know that the database was recreated due to the model changing", Completed = true }
                              };
            
            

            var subtask = new List<SubTask>
                              {
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "It's Alive!",
                                          ProjectID = 1
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get the breakable toy working",
                                          Title = "Bring me a shrubbery!",
                                          ProjectID = 1
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get the WebParts toy working",
                                          Title = "YOU shall not pass!",
                                          ProjectID = 2
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the WebParts toy working",
                                          Title = "You can't just Telnet into Mordor",
                                          ProjectID = 2
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get partial views working",
                                          Title = "There once one a man from Nantucket",
                                          ProjectID = 3                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get partial views working",
                                          Title = "Curse your sudden but inevitable betrayal!",
                                          ProjectID = 3
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "Cheetos",
                                          ProjectID = 4
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "Snickers",
                                          ProjectID = 4                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "some more default entries",
                                          Title = "Delete the default entries",
                                          ProjectID = 5                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "These are defaults entries",
                                          Title = "They're everywhere",
                                          ProjectID = 5
                                      }
                              };

            project.ForEach(p => context.Projects.Add(p));
            context.SaveChanges();

            subtask.ForEach(st => context.SubTasks.Add(st));
            context.SaveChanges();
        }
    }
}