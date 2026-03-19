using Basic_dotnet_API.Data;
using Basic_dotnet_API.Models;
using Basic_dotnet_API.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Basic_Note_App.Tests.Repositories;

public class FolderRepositoryTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllFolders()
    {
        var context = GetDbContext();
        context.Folders.AddRange(
            new Folder { Name = "Work", UserId = 1 },
            new Folder { Name = "Sport", UserId = 1 }
        );
        await context.SaveChangesAsync();

        var repo = new FolderRepository(context);
        var result = await repo.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByUserIdAsync_ShouldReturnOnlyUserFolders()
    {
        var context = GetDbContext();
        context.Folders.AddRange(
            new Folder { Name = "Work", UserId = 1 },
            new Folder { Name = "Sport", UserId = 2 }
        );
        await context.SaveChangesAsync();

        var repo = new FolderRepository(context);
        var result = await repo.GetByUserIdAsync(1);

        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Work");
    }

    [Fact]
    public async Task CreateAsync_ShouldAddFolder()
    {
        var context = GetDbContext();
        var repo = new FolderRepository(context);
        var folder = new Folder { Name = "Tasks", UserId = 1 };

        var result = await repo.CreateAsync(folder);

        result.Id.Should().BeGreaterThan(0);
        context.Folders.Should().HaveCount(1);
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnTrue_WhenExists()
    {
        var context = GetDbContext();
        var folder = new Folder { Name = "To Delete", UserId = 1 };
        context.Folders.Add(folder);
        await context.SaveChangesAsync();

        var repo = new FolderRepository(context);
        var result = await repo.DeleteAsync(folder.Id);

        result.Should().BeTrue();
        context.Folders.Should().BeEmpty();
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenNotExists()
    {
        var context = GetDbContext();
        var repo = new FolderRepository(context);

        var result = await repo.DeleteAsync(999);

        result.Should().BeFalse();
    }
}
