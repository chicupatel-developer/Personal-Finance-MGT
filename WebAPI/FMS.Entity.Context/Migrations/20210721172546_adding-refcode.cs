using Microsoft.EntityFrameworkCore.Migrations;

namespace FMS.Entity.Context.Migrations
{
    public partial class addingrefcode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefCode",
                table: "CreditCardTransactions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TransactionType",
                table: "CreditCardTransactions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RefCode",
                table: "BankTransactions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TransactionType",
                table: "BankTransactions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefCode",
                table: "CreditCardTransactions");

            migrationBuilder.DropColumn(
                name: "TransactionType",
                table: "CreditCardTransactions");

            migrationBuilder.DropColumn(
                name: "RefCode",
                table: "BankTransactions");

            migrationBuilder.DropColumn(
                name: "TransactionType",
                table: "BankTransactions");
        }
    }
}
