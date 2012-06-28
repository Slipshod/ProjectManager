using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using ProjectManager.Models;

namespace ProjectManager.DataManager
{
    public static class ModelExtensions
    {
        private static bool Save(this ISavable obj, ProjectManagerDbContext db)
        {
            db.Entry(obj).State = EntityState.Modified;
            return db.SaveChanges() > 0;
        }

        public static bool Save(this Project project, ProjectManagerDbContext db)
        {
            //project.Detail = "Asfad";
            return Save((ISavable)project, db);
        }

        public static bool Save(this SubTask subtask, ProjectManagerDbContext db)
        {
            return Save((ISavable)subtask, db);
        }
    }
}