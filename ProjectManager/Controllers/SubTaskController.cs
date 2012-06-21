using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProjectManager.Models;
using AutoMapper;
using ProjectManager.DataManager;
using System.Json;
using ProjectManager.ViewModels;

namespace ProjectManager.Controllers
{
    public class SubTaskController : Controller
    {
        private readonly ProjectManagerDbContext _db = new ProjectManagerDbContext();
        public ActionResult SubTaskList()
        {
            var subTasks = _db.SubTasks.ToList();
            return View(subTasks);
        }

        public ActionResult GetSubTasks( int? projectId)
        {
            var subTasks = _db.SubTasks.ToList();

            if (projectId == null)
            {
                return Json(subTasks, JsonRequestBehavior.AllowGet);
            }
            var result = subTasks.Where(st => st.ProjectID == projectId);
          
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        public ActionResult Create(SubTaskViewModel subTask)
        {

            throw new NotImplementedException();
        }

        public ActionResult Delete(SubTaskViewModel model)
        {
            //var subTask = Mapper.Map<SubTaskViewModel, Project>(model);
            var subTask = _db.SubTasks.Find(model.SubTaskId);
            if (!ModelState.IsValid || subTask == null)
            {
                return Json(new {Success = false}, JsonRequestBehavior.AllowGet);
            }

            _db.SubTasks.Remove(subTask);
            _db.SaveChanges();
            Redirect("/SubTask/SubTaskList");
            return Json(new {Success = true}, JsonRequestBehavior.AllowGet);
        }

        private ActionResult GetSubTaskJson(int subTaskId)
        {
            var subtask = _db.SubTasks.Find(subTaskId);
            return Json(subtask, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(SubTaskViewModel subTask)
        {
            throw new NotImplementedException();
        }


    } // END class SubTaskController : Controller
} // END namespace ProjectManager.Controllers
