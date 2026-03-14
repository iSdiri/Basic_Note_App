using Basic_dotnet_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Basic_dotnet_API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
}