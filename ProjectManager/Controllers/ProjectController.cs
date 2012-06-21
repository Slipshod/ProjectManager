﻿using System;
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

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Create()
        {
            var project = new Project();
            return Json(project, JsonRequestBehavior.AllowGet);
        }

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
                                    Success = true
                                });
            }

            return Json(new
                            {
                                Success = false
                            });
        }
        public ActionResult Edit(ProjectModel model)
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


        public ActionResult Delete(ProjectModel model)
        {
            return GetProjectJson(model.ProjectID);
        }

        [HttpPost, ActionName("Delete")]
        public ActionResult ConfirmDelete(ProjectModel model)
        {
            var project = _db.Projects.Find(model.ProjectID);
            if (ModelState.IsValid)
            {
                //var project = Mapper.Map<ProjectModel, Project>(model);
                _db.Projects.Remove(project);
                _db.SaveChanges();
            }
            return Json(new {Success = true});
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