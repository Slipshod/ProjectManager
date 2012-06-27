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

        public IList<SubTaskViewModel> SubTaskList()
        {
            var subtasks = _db.SubTasks.AsEnumerable();

            var result = subtasks.Select(Mapper.Map<SubTask, SubTaskViewModel>).ToList();
            return result; 
        }


        public JsonResult GetSubTasks()
        {
            var subTasks = new {subtasks = SubTaskList()};

           
         
            return Json(subTasks, JsonRequestBehavior.AllowGet);
        }
 
    } // END class SubTaskController : Controller
} // END namespace ProjectManager.Controllers
