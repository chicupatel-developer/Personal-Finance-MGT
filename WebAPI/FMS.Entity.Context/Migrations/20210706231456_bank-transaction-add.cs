using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FMS.Entity.Context.Migrations
{
    public partial class banktransactionadd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BankTransactions",
                columns: table => new
                {
                    BankTransactionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PayeeId = table.Column<int>(nullable: false),
                    TransactionAmount = table.Column<decimal>(nullable: false),
                    TransactionDate = table.Column<DateTime>(nullable: false),
                    TransactionStatus = table.Column<int>(nullable: false),
                    BankId = table.Column<int>(nullable: true),
                    AccountId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankTransactions", x => x.BankTransactionId);
                    table.ForeignKey(
                        name: "FK_BankTransactions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BankTransactions_Banks_BankId",
                        column: x => x.BankId,
                        principalTable: "Banks",
                        principalColumn: "BankId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BankTransactions_AccountId",
                table: "BankTransactions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_BankTransactions_BankId",
                table: "BankTransactions",
                column: "BankId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BankTransactions");
        }
    }
}
