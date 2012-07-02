using System;
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

    // Current work scope: Remove database cues out of the controller to abstract the storage engine / Data Access Layer from the controller.
    // This will mean figuring out how to get the reference to ProjectManagerDbContext out of the controller as well.  IoC? Dependancy Injection? I don't know yet.
    // Other tasks: While refactoring, start working on the Interface, and figure out how to implement an interface for the server (eg, make a solid API).
    // Start implementing Unit Tests and start working from a TDD perspective
{
    public class ProjectController : Controller 
    {
        private readonly ProjectManagerDbContext _db;

        public ProjectController()
        {
            _db = new ProjectManagerDbContext();

        }

        public ProjectController(ProjectManagerDbContext db)

        {
            _db = db;
        }

        [HttpPost]
        public ActionResult Create(ProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                model.Create(_db);
                return Json(new { Success = true } );
            }

            return Json(new { Success = false });
        }

        [HttpGet]
        public ActionResult Edit(ProjectViewModel model)
        {
            return GetProjectJson(model.ProjectID);
        }

        [HttpPost, ActionName("Edit")]
        public ActionResult ConfirmEdit(ProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                model.Edit(_db);
                return Json(new { Success = true });    
            }
            return Json(new {Success = false });
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

           // Delete will also have to recursively delete all related subtask records since we don't want to rely on the database to do that.
           // Or not.  Do I need to care about if I may (though i AM planning on) move to a different storage engine?  Possibly RavenDB.
           // Either way Subtasks are currently being orphaned in the database and that needs to be corrected one way or another.
           // With the understanding that THAT specific logic would absolutely not live in the controller
        }


        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }

      
        public ActionResult GetProjectsJson()
        {
            var project = new Project();
            return Json(new { projects = project.GetProjects(_db) }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetProjectJson(int id) 
        {
            var project = _db.Projects.Find(id);
            project.SubTasks = _db.SubTasks.Where(st => st.ProjectID == project.ProjectID);

            return Json(project, JsonRequestBehavior.AllowGet);
        }

        [ChildActionOnly]
        public ActionResult List()
        {
            return PartialView(GetProjectsJson());
        }

    }
}