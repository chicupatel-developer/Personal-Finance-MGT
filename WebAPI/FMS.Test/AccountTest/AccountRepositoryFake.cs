using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.AccountTest
{
    public class AccountRepositoryFake : IAccountRepository
    {
        private readonly List<Account> _accounts;
        private readonly List<Bank> _banks;
        public AccountRepositoryFake()
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
        }
        public IEnumerable<AccountListVM> GetAllAccounts()
        {
            List<AccountListVM> accounts = new List<AccountListVM>();
            var accountsDb = _accounts;
            if (accountsDb != null)
            {
                foreach (var ac in accountsDb)
                {
                    accounts.Add(new AccountListVM()
                    {
                        AccountId = ac.AccountId,
                        AccountType = ac.AccountType,
                        AccountNumber = ac.AccountNumber,
                        Balance = ac.Balance,
                        BankId = ac.BankId,
                        BankName = _banks.Where(x=>x.BankId==ac.BankId).FirstOrDefault().BankName
                    });
                }
            }
            return accounts;
        }
        public Account AddAccount(Account account)
        {
            _accounts.Add(account);
            return account;
        }
        public Account GetAccount(int accountId)
        {
            return _accounts.Where(a => a.AccountId == accountId)
                .FirstOrDefault();
        }
        public Account EditAccount(Account account)
        {
            var result = _accounts.Where(x => x.AccountId == account.AccountId).FirstOrDefault();
            if (result != null)
            {
                result.AccountNumber = account.AccountNumber;
                result.AccountType = account.AccountType;
                result.Balance = account.Balance;
                result.BankId = account.BankId;

                return account;
            }
            else
            {
                return null;
            }
        }

        public BankAccountVM GetBankAccounts(int bankId)
        {
            BankAccountVM bankAccountVM = new BankAccountVM();
            List<AccountVM> accounts = new List<AccountVM>();
            bankAccountVM.Accounts = accounts;
            bankAccountVM.BankId = bankId;
            var bankDb = _banks.Where(x => x.BankId == bankId).FirstOrDefault();

            if (bankDb != null)
            {
                bankAccountVM.BankName = bankDb.BankName;

                var accountsDb = _accounts.Where(x => x.BankId == bankId);
                if (accountsDb != null)
                {
                    foreach (var ac in accountsDb)
                    {
                        accounts.Add(new AccountVM()
                        {
                            AccountId = ac.AccountId,
                            AccountType = ac.AccountType,
                            AccountNumber = ac.AccountNumber,
                            Balance = ac.Balance
                        });
                    }
                }
                return bankAccountVM;
            }
            else
            {
                return bankAccountVM;
            }
        }

        public List<string> GetAllAccountTypes()
        {
            List<string> accountTypes = new List<string>();
            foreach (string accountType in Enum.GetNames(typeof(AccountType)))
            {
                accountTypes.Add(accountType);
            }
            return accountTypes;
        }
    }
}
