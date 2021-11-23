﻿using FMS.Entity.Context.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Entity.Context
{
    public class FMSContext : DbContext
    {
        public FMSContext(DbContextOptions<FMSContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // configure FK-RK (BankTransactions-Banks) here
            modelBuilder
            .Entity<BankTransaction>()
            .HasOne(e => e.Bank)
            .WithMany(e => e.BankTransactions)
            .OnDelete(DeleteBehavior.ClientCascade);
        }

        public DbSet<Payee> Payees { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<BankTransaction> BankTransactions { get; set; }
        public DbSet<CreditCardTransaction> CreditCardTransactions { get; set; }
        public DbSet<Source> Sources { get; set; }
    }
}