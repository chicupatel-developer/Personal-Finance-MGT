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
    public class SourceRepository :ISourceRepository
    {
        private readonly FMSContext appDbContext;

        public SourceRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Source> GetAllSources()
        {
            return appDbContext.Sources;
        }

        // + bank from source
        // TransactionType.In
        public BankTransaction BankInputFromSource(BankTransaction bankTransaction)
        {
            // 1)
            var account = appDbContext.Accounts.Where(x => x.BankId == bankTransaction.BankId && x.AccountId == bankTransaction.AccountId).FirstOrDefault();
            var currentBalance = account.Balance;
            account.Balance += bankTransaction.TransactionAmount;

            // 2)
            var result = appDbContext.BankTransactions.Add(new BankTransaction()
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

            // check last moment exception
            // throw new Exception();

            appDbContext.SaveChanges();
            return result.Entity;
        }
    }
}
