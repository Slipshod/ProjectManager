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
            ViewBag.Message = "Personal Project Manager";
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

    }
}
