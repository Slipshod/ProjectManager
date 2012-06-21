using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProjectManager.Models;
using ProjectManager.DataManager;

namespace ProjectManager.Controllers
{
    public class HomeController : Controller
    {
       
        public ActionResult Index()
        {
            var  db = new ProjectManagerDbContext();
            var projects = db.Projects.ToList();

            ViewBag.Message = "Personal Project Manager";
            return View(projects);
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Tasklist()
        {
            return View();
        }

        public ActionResult JsSelector()
        {
            return View();
        }
    }
}
