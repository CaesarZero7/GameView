using Microsoft.AspNetCore.Mvc;
using GameView.Server.Data;
using System.Text;
using GameView.Server.Models;
namespace GameView.Server.Controllers;

public class GamePageController : Controller
{
    private readonly AppDbContext _context;
    public GamePageController(AppDbContext context)
    {
        _context = context;
    }

    [Route("/game/{id}")]
    public async Task<IActionResult> Index(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null) return NotFound("Игра не найдена");

        var html = GenerateGamePageHtml(game);
        return Content(html, "text/html");
    }

    private string GenerateGamePageHtml(Game game)
    {
        var genresDisplay = string.IsNullOrEmpty(game.Genres) ? "" : string.Join(", ", game.Genres.Split(',').Select(g => g.Trim()));
        var platformsDisplay = string.IsNullOrEmpty(game.Platforms) ? "" : string.Join(", ", game.Platforms.Split(' ', StringSplitOptions.RemoveEmptyEntries));

        var modeTranslations = new Dictionary<string, string>
        {
            ["single"] = "Одиночная",
            ["multiplayer"] = "Многопользовательская",
            ["cooperative"] = "Кооператив"
        };
        var modesDisplay = string.IsNullOrEmpty(game.Modes) ? "" : string.Join(", ", game.Modes.Split(',').Select(m => modeTranslations.TryGetValue(m.Trim(), out var ru) ? ru : m.Trim()));

        string[] months = { "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" };
        string releaseDateRu = $"{game.ReleaseDate.Day} {months[game.ReleaseDate.Month - 1]} {game.ReleaseDate.Year}";

        // Парсинг системных требований
        var sysReqs = new List<(string param, string value)>();
        if (!string.IsNullOrEmpty(game.SystemRequirements))
        {
            var parts = game.SystemRequirements.Split(';', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                int colonIndex = part.IndexOf(':');
                if (colonIndex > 0)
                {
                    string param = part.Substring(0, colonIndex).Trim();
                    string value = part.Substring(colonIndex + 1).Trim();
                    if (!string.IsNullOrEmpty(param) && !string.IsNullOrEmpty(value))
                        sysReqs.Add((param, value));
                }
            }
        }

        var screenshots = string.IsNullOrEmpty(game.Screenshots) ? new List<string>() : game.Screenshots.Split(',').Select(s => s.Trim()).ToList();

        var sb = new StringBuilder();
        sb.Append("<!DOCTYPE html><html lang=\"ru\"><head>");
        sb.Append("<meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>");
        sb.Append($"<title>{HtmlEncode(game.Title)} — GameView</title>");
        sb.Append("<link rel=\"stylesheet\" href=\"/css/styles.css\"/>");
        sb.Append("<link rel=\"stylesheet\" href=\"/css/game-page.css\"/>");
        sb.Append("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">");
        sb.Append("</head><body>");
        sb.Append("<site-header base=\"\"></site-header>");
        sb.Append("<div class=\"container\" style=\"padding:24px 0 36px;\"><main class=\"panel\" role=\"main\">");
        sb.Append($"<header><h1>{HtmlEncode(game.Title)}</h1><p class=\"muted\">Подробное описание, характеристики, галерея и обзор.</p></header>");

        // Основная таблица
        sb.Append("<section aria-labelledby=\"specs\"><p id=\"specs\">Характеристики</p>");
        sb.Append("<table><tbody>");
        sb.Append("<tr><th scope=\"row\">Цена</th><td>" + game.Price.ToString("F2") + " руб.</td></tr>");
        sb.Append("<tr><th scope=\"row\">Разработчик</th><td>" + HtmlEncode(game.Developer) + "</td></tr>");
        if (!string.IsNullOrEmpty(game.Publisher))
            sb.Append("<tr><th scope=\"row\">Издатель</th><td>" + HtmlEncode(game.Publisher) + "</td></tr>");
        sb.Append("<tr><th scope=\"row\">Жанр</th><td>" + HtmlEncode(genresDisplay) + "</td></tr>");
        sb.Append("<tr><th scope=\"row\">Платформы</th><td>" + HtmlEncode(platformsDisplay) + "</td></tr>");
        sb.Append("<tr><th scope=\"row\">Дата выхода</th><td>" + HtmlEncode(releaseDateRu) + "</td></tr>");
        sb.Append("<tr><th scope=\"row\">Режим</th><td>" + HtmlEncode(modesDisplay) + "</td></tr>");
        if (game.Rating.HasValue)
            sb.Append("<tr><th scope=\"row\">Оценка от GameView</th><td>" + game.Rating.Value.ToString("F1") + " / 10</td></tr>");
        sb.Append("</tbody></table></section>");

        // Системные требования таблицей
        if (game.Platforms.Contains("PC") && sysReqs.Any())
        {
            sb.Append("<section aria-labelledby=\"sysreq\"><p id=\"sysreq\">Системные требования (PC)</p>");
            sb.Append("<table><thead><tr><th>Параметр</th><th>Значение</th></tr></thead><tbody>");
            foreach (var req in sysReqs)
                sb.Append($"<tr><td>{HtmlEncode(req.param)}</td><td>{HtmlEncode(req.value)}</td></tr>");
            sb.Append("</tbody></table></section>");
        }

        // Галерея
        if (screenshots.Any())
        {
            sb.Append("<section aria-labelledby=\"gallery\"><p id=\"gallery\">Галерея</p><div class=\"gallery\">");
            foreach (var sc in screenshots)
                sb.Append($"<img src=\"/images/games/{sc}\" alt=\"Скриншот\" loading=\"lazy\"/>");
            sb.Append("</div></section>");
        }

        // Описание и краткий обзор
        sb.Append("<section aria-labelledby=\"story\"><p id=\"story\">Описание</p>");
        sb.Append($"<p>{HtmlEncode(game.Description)}</p></section>");
        sb.Append("<section aria-labelledby=\"review\"><p id=\"review\">Краткий обзор</p><div class=\"panel\">");
        sb.Append($"<p>{HtmlEncode(game.Summary)}</p></div></section>");

        sb.Append("</main></div><site-footer base=\"\"></site-footer>");
        sb.Append("<script src=\"/js/components.js\" defer></script></body></html>");
        return sb.ToString();
    }

    private string HtmlEncode(string input) => string.IsNullOrEmpty(input) ? "" : input.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;");
}