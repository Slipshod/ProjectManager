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
                                  new Project {Title = "MVC Breakable Toy", Detail = "Build a breakable toy", Completed = true, Created = new DateTime(1975, 12, 27) },
                                  new Project {Title = "Implement WebParts", Detail = "After the toy is built, implement WebParts", Completed = false, Created = new DateTime(1975, 12, 27) },
                                  new Project {Title = "Implement partial views", Detail = "Add the use of partial views to the Project Manager", Completed = false, Created = new DateTime(1975, 12, 27) },
                                  new Project {Title = "Get some snacks", Detail = "Cheetos.", Completed = true },
                                  new Project {Title = "The model has changed", Detail = "This is just to know that the database was recreated due to the model changing", Completed = true, Created = new DateTime(1975, 12, 27) }
                              };
            
            

            var subtask = new List<SubTask>
                              {
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "It's Alive!",
                                          ProjectId = 1,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get the breakable toy working",
                                          Title = "Bring me a shrubbery!",
                                          ProjectId = 1,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get the WebParts toy working",
                                          Title = "YOU shall not pass!",
                                          ProjectId = 2,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the WebParts toy working",
                                          Title = "You can't just Telnet into Mordor",
                                          ProjectId = 2,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get partial views working",
                                          Title = "There once one a man from Nantucket",
                                          ProjectId = 3,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "Get partial views working",
                                          Title = "Curse your sudden but inevitable betrayal!",
                                          ProjectId = 3,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "Cheetos",
                                          ProjectId = 4,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "Get the breakable toy working",
                                          Title = "Snickers",
                                          ProjectId = 4,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = true,
                                          Description = "some more default entries",
                                          Title = "Delete the default entries",
                                          ProjectId = 5,
                                          Created = new DateTime(1975, 12, 27)
                                      },
                                  new SubTask
                                      {
                                          Completed = false,
                                          Description = "These are defaults entries",
                                          Title = "They're everywhere",
                                          ProjectId = 5,
                                          Created = new DateTime(1975, 12, 27)
                                      },

                              };

            project.ForEach(p => context.Projects.Add(p));
            subtask.ForEach(st => context.SubTasks.Add(st));
            context.SaveChanges();
        }
    }
}