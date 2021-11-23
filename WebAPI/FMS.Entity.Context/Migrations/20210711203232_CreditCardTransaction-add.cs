using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FMS.Entity.Context.Migrations
{
    public partial class CreditCardTransactionadd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CreditCardTransactions",
                columns: table => new
                {
                    CreditCardTransactionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreditCardId = table.Column<int>(nullable: false),
                    TransactionAmount = table.Column<decimal>(nullable: false),
                    TransactionDate = table.Column<DateTime>(nullable: false),
                    TransactionStatus = table.Column<int>(nullable: false),
                    PayeeId = table.Column<int>(nullable: false),
                    LastBalance = table.Column<decimal>(nullable: false),
                    CurrentBalance = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditCardTransactions", x => x.CreditCardTransactionId);
                    table.ForeignKey(
                        name: "FK_CreditCardTransactions_Payees_PayeeId",
                        column: x => x.PayeeId,
                        principalTable: "Payees",
                        principalColumn: "PayeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CreditCardTransactions_PayeeId",
                table: "CreditCardTransactions",
                column: "PayeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CreditCardTransactions");
        }
    }
}
