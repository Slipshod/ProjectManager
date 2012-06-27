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

        private IList<Project>GetProjects()
        {
            var projects = _db.Projects.ToList();

            return projects;
        }

        public ActionResult GetProjectsJson(bool asJson = true)
        {
            var projectList = new {projects = GetProjects()};

           return Json(projectList, JsonRequestBehavior.AllowGet);
            
        }

        public ActionResult GetProjectJson(int id = 0)
        {
            var project = _db.Projects.Find(id);
            return Json(project, JsonRequestBehavior.AllowGet);
        }
    }
}