using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface IAccountRepository
    {
        IEnumerable<AccountListVM> GetAllAccounts();
        Account AddAccount(Account account);
        Account GetAccount(int accountId);
        Account EditAccount(Account account);
        BankAccountVM GetBankAccounts(int bankId);
        List<string> GetAllAccountTypes();

    }
}
