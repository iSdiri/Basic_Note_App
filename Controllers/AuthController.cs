using Basic_dotnet_API.Data;
using Basic_dotnet_API.DTOs;
using Basic_dotnet_API.Models;
using Basic_dotnet_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Basic_dotnet_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext context, TokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await context.AppUsers.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already in use.");

        var user = new AppUser
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        context.AppUsers.Add(user);
        await context.SaveChangesAsync();

        var token = tokenService.CreateToken(user);
        return Ok(new AuthResponseDto(token, user.Username, user.Email));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await context.AppUsers.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user is null) return Unauthorized("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        var token = tokenService.CreateToken(user);
        return Ok(new AuthResponseDto(token, user.Username, user.Email));
    }
}