using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.Features;
using GameView.Server.Data;
using GameView.Server.Models;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 60_000_000;
});

// Регистрация DbContext для PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Убираем HTTPS-редирект
// app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.MapGet("/", () => "OK");

// === Блок инициализации базы данных с миграциями ===
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Применить все миграции (создать таблицы, если их нет)
    db.Database.Migrate();

    // Если таблица пуста, добавить начальные данные
    // if (!db.Games.Any())
    // {
    //     db.Games.AddRange(
    //         new Game
    //         {
    //             Title = "The Witcher 3: Wild Hunt",
    //             Developer = "CD PROJEKT RED",
    //             Publisher = "CD PROJEKT",
    //             Genres = "RPG",
    //             ReleaseDate = new DateTime(2015, 5, 19),
    //             Price = 1999.99m,
    //             Summary = "Эталонная RPG с глубоким сюжетом и открытым миром.",
    //             Description = "Полное описание The Witcher 3...",
    //             Platforms = "PC PlayStation Xbox Nintendo",
    //             Modes = "single",
    //             CoverPath = "/images/witcher3.webp",
    //             Screenshots = "/images/witcher_3_screenshot.jpeg,/images/witcher_3_fight.jpg",
    //             Rating = 9.8m,
    //             SystemRequirements = "CPU: Intel Core i5-2500K; RAM: 8 GB; GPU: GTX 770; Storage: 50 GB"
    //         },
    //         new Game
    //         {
    //             Title = "Cyberpunk 2077",
    //             Developer = "CD PROJEKT RED",
    //             Publisher = "CD PROJEKT",
    //             Genres = "Action RPG",
    //             ReleaseDate = new DateTime(2020, 12, 10),
    //             Price = 2999.99m,
    //             Summary = "Найт-Сити после крупных обновлений — яркий и живой.",
    //             Description = "Полное описание Cyberpunk...",
    //             Platforms = "PC PlayStation Xbox",
    //             Modes = "single",
    //             CoverPath = "/images/cyberpunk2077.webp",
    //             Screenshots = "/images/witcher_3_screenshot.jpeg,/images/witcher_3_fight.jpg",
    //             Rating = 9.2m,
    //             SystemRequirements = "CPU: Intel Core i5-3570K; RAM: 8 GB; GPU: GTX 780; Storage: 70 GB"
    //         },
    //         new Game
    //         {
    //             Title = "God of War",
    //             Developer = "SIE Santa Monica Studio",
    //             Publisher = "Sony",
    //             Genres = "Action",
    //             ReleaseDate = new DateTime(2018, 4, 20),
    //             Price = 2499.99m,
    //             Summary = "Кинематографичный экшен с выдающимся саунд-дизайном.",
    //             Description = "Полное описание God of War...",
    //             Platforms = "PC PlayStation",
    //             Modes = "single",
    //             CoverPath = "/images/god-of-war.webp",
    //             Screenshots = "/images/witcher_3_screenshot.jpeg,/images/witcher_3_fight.jpg",
    //             Rating = 9.1m,
    //             SystemRequirements = "CPU: Intel Core i5-2500K; RAM: 8 GB; GPU: GTX 960; Storage: 70 GB"
    //         },
    //         new Game
    //         {
    //             Title = "Baldur's Gate 3",
    //             Developer = "Larian Studios",
    //             Publisher = "Larian Studios",
    //             Genres = "RPG",
    //             ReleaseDate = new DateTime(2023, 8, 3),
    //             Price = 3999.99m,
    //             Summary = "CRPG нового уровня с вниманием к выбору и последствиям.",
    //             Description = "Полное описание Baldur's Gate 3...",
    //             Platforms = "PC PlayStation Xbox",
    //             Modes = "single,cooperative",
    //             CoverPath = "/images/baldurs-gate-3.webp",
    //             Screenshots = "/images/witcher_3_screenshot.jpeg,/images/witcher_3_fight.jpg",
    //             Rating = 9.4m,
    //             SystemRequirements = "CPU: Intel Core i5-4690; RAM: 8 GB; GPU: GTX 970; Storage: 150 GB"
    //         }
    //     );
    //     db.SaveChanges();
    // }
}

app.Run();