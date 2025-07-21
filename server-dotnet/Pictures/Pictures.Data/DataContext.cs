//using Microsoft.EntityFrameworkCore;
//using Pictures.Core.Models;

//namespace Pictures.Data
//{
//    public class DataContext : DbContext
//    {
//        public DbSet<User> Users { get; set; }
//        public DbSet<Album> Albums { get; set; }
//        public DbSet<Photo> Photos { get; set; } // שונה ל-Photos

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            optionsBuilder.UseMySql(
//                  @"Server=b2nl5fr4mcjonzrlfjas-mysql.services.clever-cloud.com;
//         Port=3306;
//         Database=b2nl5fr4mcjonzrlfjas;
//         User=urek2spyk00apjg3;
//         Password=xfGNbfI7BnCGOsksCHKF",
//                new MySqlServerVersion(new Version(9, 0, 0))
//            );
//        }
//    }
//}
using Microsoft.EntityFrameworkCore;
using Pictures.Core.Models;
using System;
using static Pictures.Core.Models.Collage;

namespace Pictures.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<ImageProcessingResult> ImageProcessingResults { get; set; }
        public DbSet<Collage> Collages { get; set; }
        public DbSet<CollagePhoto> CollagePhotos { get; set; }
        public DbSet<EmailVerificationModel> EmailVerifications { get; set; }



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

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    // הגדרת קשרים
        //    modelBuilder.Entity<ImageProcessingResult>()
        //        .HasOne(ipr => ipr.Photo)
        //        .WithMany()
        //        .HasForeignKey(ipr => ipr.PhotoId);

        //    modelBuilder.Entity<Collage>()
        //        .HasOne(c => c.User)
        //        .WithMany()
        //        .HasForeignKey(c => c.UserId);

        //    modelBuilder.Entity<Collage>()
        //        .HasOne(c => c.Album)
        //        .WithMany()
        //        .HasForeignKey(c => c.AlbumId)
        //        .IsRequired(false);

        //    modelBuilder.Entity<CollagePhoto>()
        //        .HasOne(cp => cp.Collage)
        //        .WithMany(c => c.CollagePhotos)
        //        .HasForeignKey(cp => cp.CollageId);

        //    modelBuilder.Entity<CollagePhoto>()
        //        .HasOne(cp => cp.Photo)
        //        .WithMany()
        //        .HasForeignKey(cp => cp.PhotoId);
        //}
    }
}
