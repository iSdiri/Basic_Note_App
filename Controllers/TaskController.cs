using Basic_dotnet_API.DTOs;
using Basic_dotnet_API.Mappers;
using Basic_dotnet_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Basic_dotnet_API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TaskController(ITaskRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok((await repo.GetAllAsync()).Select(TaskMapper.ToDto));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await repo.GetByIdAsync(id);
        return task is null ? NotFound() : Ok(TaskMapper.ToDto(task));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskDto dto)
    {
        var task = await repo.CreateAsync(TaskMapper.ToModel(dto));
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, TaskMapper.ToDto(task));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTaskDto dto)
    {
        var task = await repo.GetByIdAsync(id);
        if (task is null) return NotFound();

        TaskMapper.UpdateModel(task, dto);
        var updated = await repo.UpdateAsync(id, task);
        return Ok(TaskMapper.ToDto(updated!));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
