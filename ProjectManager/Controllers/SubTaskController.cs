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
    } // END class SubTaskController : Controller
} // END namespace ProjectManager.Controllers
