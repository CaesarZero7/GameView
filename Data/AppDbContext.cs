using Microsoft.EntityFrameworkCore;
using GameView.Server.Models;

namespace GameView.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Game> Games { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            // Для PostgreSQL используем timestamp without time zone
            entity.Property(e => e.ReleaseDate)
                  .HasColumnType("timestamp without time zone");
            // Для цены зададим точность
            entity.Property(e => e.Price)
                  .HasPrecision(18, 2);
        });
    }
}