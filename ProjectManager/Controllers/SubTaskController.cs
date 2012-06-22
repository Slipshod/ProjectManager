﻿using System;
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
        public ActionResult SubTaskList()
        {
            var subTasks = _db.SubTasks.ToList();
            return View(subTasks);
        }

        public ActionResult GetSubTasks(int? projectId)
        {
            var subTasks = _db.SubTasks.ToList();

            if (projectId == null)
            {
                return Json(subTasks, JsonRequestBehavior.AllowGet);
            }
            var result = subTasks.Where(st => st.ProjectID == projectId);
          
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [HttpPost] // Post
        public ActionResult Create(SubTaskViewModel model)
        {
            if (ModelState.IsValid)
            {
                var subtask = Mapper.Map<SubTaskViewModel, SubTask>(model);
                _db.SubTasks.Add(subtask);
                _db.SaveChanges();
                return Json(new {Success = true});
            }
            return Json(new {Success = false});
        }


        [HttpPost, ActionName("Delete")]
        public ActionResult Delete(SubTaskViewModel model)
        {
            if(ModelState.IsValid)
            {
                var subtask = _db.SubTasks.Find(model.SubTaskId);
                _db.SubTasks.Remove(subtask);
                _db.SaveChanges();
                return Json(new {Success = true});
            }
             

            return Json(new {Success = false});
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
