using FMS.Entity.Context;
using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using FMS.Service.DTOs;
using FMS.Service.CustomException;
using FMS.Service.Utility;

namespace FMS.Service.Repositories
{
    public class EntityMonitorRepository : IEntityMonitorRepository
    {
        private readonly FMSContext appDbContext;

        public EntityMonitorRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<AccountMonthly> MonitorAccountMonthly(AccountMonthlyRequest accountMonthlyRequest)
        {
            List<AccountMonthly> accountMonthly = new List<AccountMonthly>();

            // check for Bank and Account Exists or not
            var _bankAndAccount = appDbContext.Accounts.Where(x => x.BankId == accountMonthlyRequest.BankId && x.AccountId == accountMonthlyRequest.AccountId).FirstOrDefault();
            if (_bankAndAccount == null)
                throw new AccountNotFound("Unknown Bank/Account !");

            var accountMonthlyData =
            (from d in appDbContext.BankTransactions
                .Where(x => x.AccountId == accountMonthlyRequest.AccountId && x.BankId == accountMonthlyRequest.BankId && x.TransactionDate.Year==DateTime.Now.Year)
                // .Where(x => x.AccountId == accountMonthlyRequest.AccountId && x.BankId == accountMonthlyRequest.BankId && x.TransactionDate.Year == 2023)
             group d by new
                         {                    
                             Year = d.TransactionDate.Year,
                             Month = d.TransactionDate.Month,
                             TranType = d.TransactionType
                     } into g
                         select new
                         {                         
                             Year = g.Key.Year,
                             Month = g.Key.Month,
                             TranType = g.Key.TranType,
                             Total = g.Sum(x => x.TransactionAmount)
                         }
                   ).AsEnumerable()
                    .Select(g => new {                    
                        Period = g.Year + "-" + g.Month,
                        Year = g.Year.ToString(),
                        Month = g.Month.ToString(),
                        TranType = g.TranType,
                        Total = g.Total
                    });

            var bankAccount = appDbContext.Accounts
                            .Include(x=>x.Bank)
                            .Where(x => x.BankId == accountMonthlyRequest.BankId && x.AccountId==accountMonthlyRequest.AccountId).FirstOrDefault();

            foreach(var data in accountMonthlyData)
            {
                accountMonthly.Add(new AccountMonthly()
                {            
                    BankName = bankAccount.Bank.BankName,
                    AccountNumber = bankAccount.AccountNumber.ToString(),
                    AccountType = bankAccount.AccountType,
                    Period = data.Period,
                    Year = data.Year,
                    Month = data.Month,
                    TranType = data.TranType,
                    Total = data.Total
                });
            }
            return accountMonthly;
        }
    }
}
