using System.Data.Entity;

namespace ProjectManager.DataManager
{
    public class DropCreateDatabaseTables :IDatabaseInitializer<ProjectManagerDbContext>
    {
        public void InitializeDatabase(ProjectManagerDbContext context)
        {
            bool dbExists;
        }
    }
}