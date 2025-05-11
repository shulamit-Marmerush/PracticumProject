using Microsoft.EntityFrameworkCore;
using Pictures.Core.Models;

namespace Pictures.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Photo> Photos { get; set; } // שונה ל-Photos

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                  @"Server=b2nl5fr4mcjonzrlfjas-mysql.services.clever-cloud.com;
         Port=3306;
         Database=b2nl5fr4mcjonzrlfjas;
         User=urek2spyk00apjg3;
         Password=xfGNbfI7BnCGOsksCHKF",
                new MySqlServerVersion(new Version(9, 0, 0))
            );
        }
    }
}
