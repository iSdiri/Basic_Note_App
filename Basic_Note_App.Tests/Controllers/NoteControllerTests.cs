using Basic_dotnet_API.Controllers;
using Basic_dotnet_API.DTOs;
using Basic_dotnet_API.Models;
using Basic_dotnet_API.Repositories.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Basic_Note_App.Tests.Controllers;

public class NoteControllerTests
{
    private readonly Mock<INoteRepository> _mockRepo = new();

    [Fact]
    public async Task GetAll_ShouldReturn200_WithNotes()
    {
        var notes = new List<Note>
        {
            new() { Id = 1, Title = "Note 1", Content = "Content 1", UserId = 1 },
            new() { Id = 2, Title = "Note 2", Content = "Content 2", UserId = 1 }
        };
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(notes);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.GetAll();

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetById_ShouldReturn404_WhenNotFound()
    {
        _mockRepo.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Note?)null);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.GetById(999);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetById_ShouldReturn200_WhenFound()
    {
        var note = new Note { Id = 1, Title = "Test", Content = "Content", UserId = 1 };
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(note);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.GetById(1);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Create_ShouldReturn201()
    {
        var dto = new CreateNoteDto("New Note", "Content", 1, null);
        var note = new Note { Id = 1, Title = "New Note", Content = "Content", UserId = 1 };
        _mockRepo.Setup(r => r.CreateAsync(It.IsAny<Note>())).ReturnsAsync(note);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.Create(dto);

        result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturn204_WhenExists()
    {
        _mockRepo.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.Delete(1);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturn404_WhenNotExists()
    {
        _mockRepo.Setup(r => r.DeleteAsync(999)).ReturnsAsync(false);

        var controller = new NoteController(_mockRepo.Object);
        var result = await controller.Delete(999);

        result.Should().BeOfType<NotFoundResult>();
    }
}
