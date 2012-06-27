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


        public ActionResult GetSubtasksByProjectId(int id = -1)
        {
            throw new NotImplementedException();
        }

        public IList<SubTaskViewModel> SubTaskList()
        {
            var subtasks = _db.SubTasks.AsEnumerable();

            var result = subtasks.Select(Mapper.Map<SubTask, SubTaskViewModel>).ToList();
<<<<<<< HEAD
            return result; 
        }


        public JsonResult GetSubTasks()
        {
            var subTasks = new {subtasks = SubTaskList()};

           
         
            return Json(subTasks, JsonRequestBehavior.AllowGet);
        }
 
=======
            return result;
        }

        public ActionResult GetSubTasks(ProjectViewModel project = null)
        {
            var subTasks = _db.SubTasks.ToList();

            if (project == null)
            {
                return Json(subTasks, JsonRequestBehavior.AllowGet);
            }
            var result = subTasks.Where(st => st.SubTaskId == project.ProjectID);
          
            return Json(result, JsonRequestBehavior.AllowGet);
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

>>>>>>> f4dd2f40940616ab3735bb19f4b8188bfe162273
    } // END class SubTaskController : Controller
} // END namespace ProjectManager.Controllers
