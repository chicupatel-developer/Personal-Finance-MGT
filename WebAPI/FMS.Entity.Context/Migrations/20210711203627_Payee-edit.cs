using Microsoft.EntityFrameworkCore.Migrations;

namespace FMS.Entity.Context.Migrations
{
    public partial class Payeeedit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Balance",
                table: "Payees",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Balance",
                table: "Payees");
        }
    }
}
