using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameView.Server.Data;
using GameView.Server.Models;

namespace GameView.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _context;
    public GamesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetGames(
        [FromQuery] string? platform,
        [FromQuery] string? genre,
        [FromQuery] string? year,
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 6)
    {
        var query = _context.Games.AsQueryable();

        if (!string.IsNullOrEmpty(platform))
            query = query.Where(g => g.Platforms.Contains(platform));
        if (!string.IsNullOrEmpty(genre))
            query = query.Where(g => g.Genres.Contains(genre));
        if (!string.IsNullOrEmpty(year) && int.TryParse(year, out int y))
            query = query.Where(g => g.ReleaseDate.Year == y);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(g => g.Title.Contains(search) || g.Summary.Contains(search));

        query = sortBy?.ToLower() switch
        {
            "price" => query.OrderBy(g => g.Price),
            "year" => query.OrderByDescending(g => g.ReleaseDate.Year),
            _ => query.OrderBy(g => g.Title)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { totalCount, games = items });
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromQuery] string q)
    {
        if (string.IsNullOrEmpty(q)) return Ok(Array.Empty<string>());
        var suggestions = await _context.Games
            .Where(g => g.Title.Contains(q))
            .OrderBy(g => g.Title)
            .Take(10)
            .Select(g => g.Title)
            .ToListAsync();
        return Ok(suggestions);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGame([FromForm] GameCreateDto dto)
    {
        // Валидация обязательных полей
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length < 2 || dto.Title.Length > 100)
            return BadRequest(new { errors = new { Title = "Название должно быть от 2 до 100 символов" } });
        if (string.IsNullOrWhiteSpace(dto.Developer) || dto.Developer.Length < 2 || dto.Developer.Length > 50)
            return BadRequest(new { errors = new { Developer = "Разработчик от 2 до 50 символов" } });
        if (dto.Price < 0 || dto.Price > 100000)
            return BadRequest(new { errors = new { Price = "Цена от 0 до 100 000" } });
        if (dto.ReleaseDate > DateTime.Now)
            return BadRequest(new { errors = new { ReleaseDate = "Дата не может быть в будущем" } });
        if (string.IsNullOrWhiteSpace(dto.Summary) || dto.Summary.Length < 10 || dto.Summary.Length > 40)
            return BadRequest(new { errors = new { Summary = "Краткое описание 10-40 символов" } });
        if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length < 70)
            return BadRequest(new { errors = new { Description = "Полное описание минимум 70 символов" } });
        if (dto.Genres == null || !dto.Genres.Any())
            return BadRequest(new { errors = new { Genres = "Выберите хотя бы один жанр" } });
        if (dto.Platforms == null || !dto.Platforms.Any())
            return BadRequest(new { errors = new { Platforms = "Выберите хотя бы одну платформу" } });
        if (dto.Modes == null || !dto.Modes.Any())
            return BadRequest(new { errors = new { Modes = "Выберите хотя бы один режим" } });
        if (dto.Rating.HasValue && (dto.Rating.Value < 0 || dto.Rating.Value > 10))
            return BadRequest(new { errors = new { Rating = "Рейтинг должен быть от 0 до 10" } });

        // Валидация файлов
        if (dto.Cover == null || dto.Cover.Length == 0)
            return BadRequest(new { errors = new { Cover = "Обложка обязательна" } });
        if (dto.Screenshots == null || dto.Screenshots.Count < 3 || dto.Screenshots.Count > 10)
            return BadRequest(new { errors = new { Screenshots = "Загрузите от 3 до 10 скриншотов" } });

        // Сохранение файлов
        string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/games");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        string coverFileName = await SaveFile(dto.Cover, uploadsFolder);
        List<string> screenshotNames = new List<string>();
        foreach (var file in dto.Screenshots)
        {
            string fileName = await SaveFile(file, uploadsFolder);
            screenshotNames.Add(fileName);
        }

        // Создание игры
        var game = new Game
        {
            Title = dto.Title.Trim(),
            Developer = dto.Developer.Trim(),
            Publisher = dto.Publisher?.Trim(),
            Genres = string.Join(",", dto.Genres),
            ReleaseDate = dto.ReleaseDate,
            Price = dto.Price,
            Summary = dto.Summary.Trim(),
            Description = dto.Description.Trim(),
            Platforms = string.Join(" ", dto.Platforms),
            Modes = string.Join(",", dto.Modes),
            CoverPath = $"/images/games/{coverFileName}",
            Screenshots = string.Join(",", screenshotNames),
            Rating = dto.Rating,
            SystemRequirements = dto.SystemRequirements
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGames), new { id = game.Id }, game);
    }

    private async Task<string> SaveFile(IFormFile file, string folder)
    {
        string uniqueName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        string filePath = Path.Combine(folder, uniqueName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        return uniqueName;
    }

    [HttpGet("genres")]
    public async Task<IActionResult> GetGenres()
    {
        var games = await _context.Games.ToListAsync();
        var genres = games.SelectMany(g => g.Genres.Split(',', StringSplitOptions.RemoveEmptyEntries))
                        .Select(g => g.Trim())
                        .Distinct()
                        .OrderBy(g => g);
        return Ok(genres);
    }

    [HttpGet("years")]
    public async Task<IActionResult> GetYears()
    {
        var years = await _context.Games.Select(g => g.ReleaseDate.Year).Distinct().OrderByDescending(y => y).ToListAsync();
        return Ok(years);
    }
}