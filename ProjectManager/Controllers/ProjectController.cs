using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using AutoMapper;
using ProjectManager.Models;
using ProjectManager.DataManager;
using System.Json;
using ProjectManager.ViewModels;

namespace ProjectManager.Controllers
{
    public class ProjectController : Controller
    {
        private readonly ProjectManagerDbContext _db = new ProjectManagerDbContext();

        //
        // GET: /Project/

        public ActionResult Index()
        {
            ViewBag.Project = new Project();
            return View(GetProjects());
        }

        //
        // GET: /Project/Details/5

        public ActionResult Details(int id = 0)
        {
            var project = _db.Projects.Find(id);
            if (project == null)
            {
                return HttpNotFound();
            }
            return View(project);
        }

        //
        // GET: /Project/Create

        public ActionResult Create()
        {
            var project = new Project();
            return View(project);
        }

        [ChildActionOnly]
        public ViewResult CreatePartial()
        {
            var project = new Project();
            return View(project);
        }
        


        //
        // POST: /Project/Create

        [HttpPost]
        public ActionResult Create(ProjectModel model)
        {
            if (ModelState.IsValid)
            {
                var project = Mapper.Map<ProjectModel, Project>(model);
                _db.Projects.Add(project);
                _db.SaveChanges();
                return Json(new
                                {
                                    Success = true,
                                    RedirectUrl = "/"
                                });
            }

            return Json(new
                            {
                                Success = false
                            });
        }

        //
        // GET: /Project/Edit/5

        public ActionResult Edit(int id = 0)
        {
            var project = _db.Projects.Find(id);
            if (project == null)
            {
                return HttpNotFound();
            }
            return View(project);
        }

        //
        // POST: /Project/Edit/5

        [HttpPost]
        public ActionResult Edit(ProjectModel model)
        {
            if (ModelState.IsValid)
            {
                var project = Mapper.Map<ProjectModel, Project>(model);
                _db.Entry(project).State = EntityState.Modified;
                _db.SaveChanges();
                return Redirect("/Project");
            }
            return View("Index");
        }

        //
        // GET: /Project/Delete/5

        public ActionResult Delete(int id = 0)
        {
            var project = _db.Projects.Find(id);
            if (project == null)
            {
                return RedirectToAction("Index");
            }
            return View(project);
        }

        //
        // POST: /Project/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(ProjectModel model)
        {
            var project = Mapper.Map<ProjectModel, Project>(model);
            project = _db.Projects.Find(project.ProjectID);
            _db.Projects.Remove(project);
            _db.SaveChanges();
            return RedirectToAction("Index");
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

        private ICollection<Project> GetProjects()
        {
            return (_db.Projects.ToList());
        } 

    }
}