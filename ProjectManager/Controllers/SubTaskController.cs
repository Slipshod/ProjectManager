using System;
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
    public class SubTaskController : Controller
    {
        private readonly ProjectManagerDbContext _db = new ProjectManagerDbContext();


        public ActionResult GetSubtasksByProjectId(int id = -1)
        {
            var subtasks = _db.SubTasks.ToList();
            var results = subtasks.Where(st => st.ProjectID == id);
            return Json(results, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSubtasksJson(int id = -1)
        {
            if (id >= 0)
            {
                var subTask = _db.SubTasks.Find(id);
                return subTask == null ? (Json(new { Success = false }, JsonRequestBehavior.AllowGet)) : (Json(subTask, JsonRequestBehavior.AllowGet));
            }
            
            var subtasks = _db.SubTasks.ToList();
            return Json(subtasks, JsonRequestBehavior.AllowGet);
        }

    } // END class SubTaskController : Controller
} // END namespace ProjectManager.Controllers
