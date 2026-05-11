using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameView.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingAndSystemRequirements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "Games",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SystemRequirements",
                table: "Games",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "SystemRequirements",
                table: "Games");
        }
    }
}
