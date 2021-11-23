using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface IBankTransactionRepository
    {
        BankTransaction AddBankTransaction(BankTransaction bankTransaction);
        List<string> GetTransactionStatusTypes();
        AccountStatement GetAccountStatementAll(AccountVM account);       
        BankStatement GetBankStatement(Bank bank);
    }
}
