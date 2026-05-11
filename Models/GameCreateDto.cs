namespace GameView.Server.Models
{
    public class GameCreateDto
    {
        public string Title { get; set; } = "";
        public string Developer { get; set; } = "";
        public string? Publisher { get; set; }
        public List<string> Genres { get; set; } = new();
        public DateTime ReleaseDate { get; set; }
        public decimal Price { get; set; }
        public string Summary { get; set; } = "";
        public string Description { get; set; } = "";
        public List<string> Platforms { get; set; } = new();
        public List<string> Modes { get; set; } = new();
        public IFormFile? Cover { get; set; }
        public List<IFormFile>? Screenshots { get; set; }

        public decimal? Rating { get; set; }
        public string? SystemRequirements { get; set; } // можно собирать из полей формы и добавлять в БД
    }
}