using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using FMS.Service.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.SourceTest
{
    public class SourceRepositoryFake : ISourceRepository
    {
        private readonly List<Account> _accounts;
        private readonly List<Source> _sources;
        private readonly List<BankTransaction> _trans;

        public SourceRepositoryFake()
        {
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
            _sources = new List<Source>() {
                new Source()
                {
                     SourceId =1,
                      Description = "CRA - Tax Returns",
                       SourceName = "CRA"
                },
                 new Source()
                {
                     SourceId =2,
                      Description = "Service Canada - EI",
                       SourceName = "Service Canada"
                },
                   new Source()
                {
                     SourceId =1,
                      Description = "Pay - CTD",
                       SourceName = "CTD"
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

        public BankTransaction BankInputFromSource(BankTransaction bankTransaction)
        {
            // throw new Exception();
            // 1)
            var account = _accounts.Where(x => x.BankId == bankTransaction.BankId && x.AccountId == bankTransaction.AccountId).FirstOrDefault();
            var currentBalance = account.Balance;
            account.Balance += bankTransaction.TransactionAmount;

            // 2)
            _trans.Add(new BankTransaction()
            {
                // + bank
                // so payeeId = 0
                PayeeId = 0,

                TransactionAmount = bankTransaction.TransactionAmount,
                TransactionDate = bankTransaction.TransactionDate,
                TransactionStatus = TransactionStatus.Success,
                BankId = bankTransaction.BankId,
                AccountId = bankTransaction.AccountId,
                LastBalance = currentBalance,
                CurrentBalance = account.Balance,
                RefCode = RefCodeGenerator.RandomString(6),
                TransactionType = TransactionType.In,

                // In transaction for bank
                // + bank
                SourceId = bankTransaction.SourceId
            });

            return bankTransaction;
        }

        public IEnumerable<Source> GetAllSources()
        {
            // throw new NotImplementedException();
            return _sources;
        }
    }
}
