using FMS.Entity.Context.Models;
using FMS.Service.CustomException;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.EntityMonitorTest
{
    public class EntityMonitorRepositoryFake : IEntityMonitorRepository
    {
        private readonly List<Account> _accounts;
        private readonly List<Bank> _banks;
        private readonly List<BankTransaction> _trans;
        public EntityMonitorRepositoryFake()
        {
            _banks = new List<Bank>()
            {
                new Bank() { 
                     // BankId = rnd.Next(1, 10),
                     BankId = 1,
                      BankName = "CIBC"
                },
                new Bank() {
                     // BankId = rnd.Next(1, 10),
                     BankId = 2,
                      BankName = "TD"
                },
                new Bank() {
                     // BankId = rnd.Next(1, 10),
                     BankId = 3,
                      BankName = "RBC"
                }
            };
            _accounts = new List<Account>() {
                new Account()
                {
                      AccountId = 1,
                       AccountNumber = 1234,
                       AccountType = AccountType.Chequing,
                        Balance = 1000,
                         BankId = 1
                },
                new Account()
                {
                      AccountId = 2,
                       AccountNumber = 2345,
                       AccountType = AccountType.Savings,
                        Balance = 2000,
                         BankId = 2
                },
                new Account()
                {
                      AccountId = 3,
                       AccountNumber = 3456,
                       AccountType = AccountType.TFSA,
                        Balance = 3000,
                         BankId = 3
                }
            };
            _trans = new List<BankTransaction>()
            {
                // OUT
                // to payee or CC-payee
                new BankTransaction() {
                    AccountId = 1,
                     BankId = 1,
                      BankTransactionId = 1,
                       CurrentBalance = 1000,
                        LastBalance = 2000,
                         PayeeId = 1,
                          RefCode = "1234",
                           SourceId = 0,
                            TransactionAmount = 1000,
                             TransactionDate = DateTime.Now,
                              TransactionStatus = TransactionStatus.Success,
                               TransactionType = TransactionType.Out
                },
                // IN
                // from source
                  new BankTransaction() {
                    AccountId = 1,
                     BankId = 1,
                      BankTransactionId = 2,
                       CurrentBalance = 1500,
                        LastBalance = 1000,
                         PayeeId = 0,
                          RefCode = "2345",
                           SourceId = 1,
                            TransactionAmount = 500,
                             TransactionDate = DateTime.Now,
                              TransactionStatus = TransactionStatus.Success,
                               TransactionType = TransactionType.In
                }
            };
        }

        public IEnumerable<AccountMonthly> MonitorAccountMonthly(AccountMonthlyRequest accountMonthlyRequest)
        {
            List<AccountMonthly> accountMonthly = new List<AccountMonthly>();

            // check for Bank and Account Exists or not
            var _bankAndAccount = _accounts.Where(x => x.BankId == accountMonthlyRequest.BankId && x.AccountId == accountMonthlyRequest.AccountId).FirstOrDefault();
            if (_bankAndAccount == null)
                throw new AccountNotFound("Unknown Bank/Account !");
                 
            var accountMonthlyData =
            (from d in _trans
                .Where(x => x.AccountId == accountMonthlyRequest.AccountId && x.BankId == accountMonthlyRequest.BankId)
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

            var bankAccount = _accounts
                            .Where(x => x.BankId == accountMonthlyRequest.BankId && x.AccountId == accountMonthlyRequest.AccountId).FirstOrDefault();
            var bank = _banks
                            .Where(x => x.BankId == accountMonthlyRequest.BankId).FirstOrDefault();

            foreach (var data in accountMonthlyData)
            {
                accountMonthly.Add(new AccountMonthly()
                {
                    BankName = bank.BankName,
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
