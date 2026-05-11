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

// Убираем HTTPS-редирект, иначе health-check провалится
// app.UseHttpsRedirection(); // Закомментировано
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.MapGet("/", () => "OK");

app.Run();