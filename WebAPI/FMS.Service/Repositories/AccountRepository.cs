using FMS.Entity.Context;
using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using FMS.Service.DTOs;

namespace FMS.Service.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly FMSContext appDbContext;

        public AccountRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<AccountListVM> GetAllAccounts()
        {
            List<AccountListVM> accounts = new List<AccountListVM>();
            var accountsDb = appDbContext.Accounts.Include(x => x.Bank);
            if (accountsDb != null)
            {
                foreach(var ac in accountsDb)
                {
                    accounts.Add(new AccountListVM()
                    {
                        AccountId = ac.AccountId,
                        AccountType = ac.AccountType,
                        AccountNumber = ac.AccountNumber,
                        Balance = ac.Balance,
                        BankId = ac.BankId,
                        BankName = ac.Bank.BankName
                    });
                }
            }
            return accounts;
        }

        public Account AddAccount(Account account)
        {
            var result = appDbContext.Accounts.Add(account);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        public Account GetAccount(int accountId)
        {
            return appDbContext.Accounts.Where(x => x.AccountId == accountId).FirstOrDefault();
        }

        public Account EditAccount(Account account)
        {
            var result = appDbContext.Accounts.Where(x => x.AccountId == account.AccountId).FirstOrDefault();
            if (result != null)
            {
                result.AccountNumber = account.AccountNumber;
                result.AccountType = account.AccountType;
                result.Balance = account.Balance;
                result.BankId = account.BankId;              

                appDbContext.SaveChanges();
                return account;

                // check for null
                // return null;
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
            var bankDb = appDbContext.Banks.Where(x => x.BankId == bankId).FirstOrDefault();

            if (bankDb != null)
            {
                bankAccountVM.BankName = bankDb.BankName;

                var accountsDb = appDbContext.Accounts.Where(x => x.BankId == bankId).Include(y => y.Bank);
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
