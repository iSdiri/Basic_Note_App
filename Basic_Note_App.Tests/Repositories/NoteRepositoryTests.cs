using Basic_dotnet_API.Data;
using Basic_dotnet_API.Models;
using Basic_dotnet_API.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Basic_Note_App.Tests.Repositories;

public class NoteRepositoryTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllNotes()
    {
        var context = GetDbContext();
        context.Notes.AddRange(
            new Note { Title = "Note 1", Content = "Content 1", UserId = 1 },
            new Note { Title = "Note 2", Content = "Content 2", UserId = 1 }
        );
        await context.SaveChangesAsync();

        var repo = new NoteRepository(context);
        var result = await repo.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNote_WhenExists()
    {
        var context = GetDbContext();
        var note = new Note { Title = "Test", Content = "Content", UserId = 1 };
        context.Notes.Add(note);
        await context.SaveChangesAsync();

        var repo = new NoteRepository(context);
        var result = await repo.GetByIdAsync(note.Id);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Test");
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        var context = GetDbContext();
        var repo = new NoteRepository(context);

        var result = await repo.GetByIdAsync(999);

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_ShouldAddNote()
    {
        var context = GetDbContext();
        var repo = new NoteRepository(context);
        var note = new Note { Title = "New Note", Content = "Content", UserId = 1 };

        var result = await repo.CreateAsync(note);

        result.Id.Should().BeGreaterThan(0);
        context.Notes.Should().HaveCount(1);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateNote_WhenExists()
    {
        var context = GetDbContext();
        var note = new Note { Title = "Old Title", Content = "Old Content", UserId = 1 };
        context.Notes.Add(note);
        await context.SaveChangesAsync();

        var repo = new NoteRepository(context);
        note.Title = "New Title";
        var result = await repo.UpdateAsync(note.Id, note);

        result.Should().NotBeNull();
        result!.Title.Should().Be("New Title");
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnTrue_WhenExists()
    {
        var context = GetDbContext();
        var note = new Note { Title = "To Delete", Content = "Content", UserId = 1 };
        context.Notes.Add(note);
        await context.SaveChangesAsync();

        var repo = new NoteRepository(context);
        var result = await repo.DeleteAsync(note.Id);

        result.Should().BeTrue();
        context.Notes.Should().BeEmpty();
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenNotExists()
    {
        var context = GetDbContext();
        var repo = new NoteRepository(context);

        var result = await repo.DeleteAsync(999);

        result.Should().BeFalse();
    }
}
