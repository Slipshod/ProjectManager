using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using ProjectManager.Models;
using ProjectManager.DataManager;
using ProjectManager.ViewModels;

namespace ProjectManager.Controllers
{
    public class ProjectController : Controller
    {
        private readonly ProjectManagerDbContext _db = new ProjectManagerDbContext();

        public JsonResult Create()
        {
            var project = new Project();
            return Json(project, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Create(ProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                var project = Mapper.Map<ProjectViewModel, Project>(model);
                _db.Projects.Add(project);
                _db.SaveChanges();
                return Json(new
                                {
                                    Success = true
                                });
            }

            return Json(new
                            {
                                Success = false
                            });
        }
        public ActionResult Edit(ProjectViewModel model)
        {
            return GetProjectJson(model.ProjectID);
        }

        [HttpPost, ActionName("Edit")]
        public ActionResult ConfirmEdit(Project model)
        {
            if (ModelState.IsValid)
            {
                _db.Entry(model).State = EntityState.Modified;
                _db.SaveChanges();
                
            }
            return Json(new { Success = true });
        }

        public ActionResult Delete(ProjectViewModel model)
        {
            return GetProjectJson(model.ProjectID);
        }

       [HttpPost, ActionName("Delete")]
        public ActionResult ConfirmDelete(ProjectViewModel model)
        {
            var project = _db.Projects.Find(model.ProjectID);
            if (ModelState.IsValid)
            {
                _db.Projects.Remove(project);
                _db.SaveChanges();
            }
            return Json(new {Success = true});

           //Delete will also have to recursively delete all related subtask records since we don't want to rely on the database to do that.
        }

        public ActionResult ProjectEditorFields()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }

        [ChildActionOnly]
        public ActionResult ProjectList()
        {
            var projects = GetProjects();
            return PartialView(projects);
        }



        private IList<Project> GetProjects()
        {
            var projects = _db.Projects.ToList();
            return projects;
        }

//        private JsonResult GetProjects()
//        {
//
//            // Get the records
//            // Get all subtasks per record
//            // Populate each project.SubTasks
//            // return the projects list as Json
//
//            var proj = (from p in _db.Projects
//                        select new
//                                   {
//                                       Project = p,
//                                       Tasks = _db.SubTasks.Where(t => t.ProjectID == p.ProjectID)
//                                   }).ToList();
//
//            _db.Configuration.LazyLoadingEnabled = true;
//            var projects = _db.Projects.ToList();
//
//            var allSubtasks = _db.SubTasks.ToList();
//
//            foreach (var project in projects)
//            {
//                project.SubTasks = _db.SubTasks.Where(t => t.ProjectID == project.ProjectID);
//            }
//
//
//
//
//            return Json(projects, JsonRequestBehavior.AllowGet);
//
//        }


        public ActionResult GetProjectsJson()
        {
            var projectList = new {projects = GetProjects()};
            return Json(projectList, JsonRequestBehavior.AllowGet);
            
        }

        public ActionResult GetProjectJson(int id)
        {
            
            var project = _db.Projects.Find(id);
            project.SubTasks = _db.SubTasks.Where(st => st.ProjectID == project.ProjectID);

            return Json(project, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ProjectListJson()
        {
            var projectList = new { projects = _db.Projects.ToList() };


            return Json(projectList, JsonRequestBehavior.AllowGet);
            
        }
    }
}