namespace GameView.Server.Models;

public class Game
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Developer { get; set; } = string.Empty;
    public string? Publisher { get; set; }
    public string Genres { get; set; } = string.Empty;      // "RPG,Action"
    public DateTime ReleaseDate { get; set; }
    public decimal Price { get; set; }
    public string Summary { get; set; } = string.Empty;     // краткое описание
    public string Description { get; set; } = string.Empty; // полное описание
    public string Platforms { get; set; } = string.Empty;   // "PC,PlayStation"
    public string Modes { get; set; } = string.Empty;       // "single,multiplayer"
    public string CoverPath { get; set; } = string.Empty;   // относительный путь
    public string Screenshots { get; set; } = string.Empty; // имена файлов через запятую
    public decimal? Rating { get; set; }      // рейтинг от 0 до 10, например 8.5
    public string? SystemRequirements { get; set; } // строковое представление требований
}