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
    public class BankTransactionRepository : IBankTransactionRepository
    {
        private readonly FMSContext appDbContext;

        public BankTransactionRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }      

        // - bank
        // + cc
        // TransactionType.Out
        public BankTransaction AddBankTransaction(BankTransaction bankTransaction)
        {      
            // 1)
            var account = appDbContext.Accounts.Where(x => x.BankId == bankTransaction.BankId && x.AccountId==bankTransaction.AccountId).FirstOrDefault();
            var currentBalance = account.Balance;
            account.Balance -= bankTransaction.TransactionAmount;
            if (account.Balance < 0)
            {
                // throw new Exception();
                throw new MinusBankBalance("Transaction Fails ! You can pay maximum of " + currentBalance);
            }

            // 2)
            var result = appDbContext.BankTransactions.Add(new BankTransaction()
            {
                PayeeId = bankTransaction.PayeeId,
                TransactionAmount = bankTransaction.TransactionAmount,
                TransactionDate = bankTransaction.TransactionDate,
                TransactionStatus = TransactionStatus.Success,
                BankId = bankTransaction.BankId,
                AccountId = bankTransaction.AccountId,
                LastBalance = currentBalance,
                CurrentBalance = account.Balance,

                RefCode = RefCodeGenerator.RandomString(6),
                TransactionType = TransactionType.Out,

                // Out transaction for bank
                // - bank
                SourceId = 0
            }); 

            // 3
            // check for cc
            // if cc is the payee type, then add amount @ cc Balance of Payee
            var payee = appDbContext.Payees
                            .Where(c => c.PayeeId == bankTransaction.PayeeId).FirstOrDefault();
            if (payee.PayeeType == PayeeType.CreditCard)
            {
                var ccCurrentBalance = payee.Balance;
                payee.Balance += bankTransaction.TransactionAmount;

                // 4
                // check for cc
                // if cc is the payee type, then add transaction @ CreditCardTransactions db table
                // with same RefCode generated @ BankTransactions db table
                // with transaction type In
                appDbContext.CreditCardTransactions.Add(new CreditCardTransaction()
                {
                    CreditCardId = payee.PayeeId,
                    TransactionAmount = bankTransaction.TransactionAmount,
                    TransactionDate = bankTransaction.TransactionDate,
                    TransactionStatus = TransactionStatus.Success,
                    PayeeId = payee.PayeeId,
                    LastBalance = ccCurrentBalance,
                    CurrentBalance = payee.Balance,
                    RefCode = result.Entity.RefCode,
                    TransactionType = TransactionType.In
                });
            }

            // check last moment exception
            // throw new Exception();

            appDbContext.SaveChanges();
            return result.Entity;
        }      

        public List<string> GetTransactionStatusTypes()
        {
            List<string> transactionStatusTypes = new List<string>();
            foreach (string transactionStatusType in Enum.GetNames(typeof(TransactionStatus)))
            {
                transactionStatusTypes.Add(transactionStatusType);
            }
            return transactionStatusTypes;
        }

        // - bank
        // TransactionType.Out
        // + bank from source
        // TransactionType.In
        public AccountStatement GetAccountStatementAll(AccountVM accountVM)
        {
            AccountStatement accountStatement = new AccountStatement();
            List<Transaction> transactions = new List<Transaction>();
            accountStatement.Transactions = transactions;

            // Accounts
            
            var account = appDbContext.Accounts
                                .Include(x=>x.Bank)
                                .Where(x => x.AccountId == accountVM.AccountId).FirstOrDefault();
       
            if (account != null)
            {
                accountStatement.AccountId = account.AccountId;
                accountStatement.AccountNumber = account.AccountNumber;
                accountStatement.AccountType = account.AccountType;
                accountStatement.BankId = account.BankId;
                accountStatement.BankName = account.Bank.BankName;
                accountStatement.LastBalance = account.Balance;

                // Transactions
                var bankTransactions = appDbContext.BankTransactions
                                            .Where(a => a.AccountId == accountVM.AccountId);
                if (bankTransactions != null && bankTransactions.Count()>=1)
                {
                    // -/+ bank
                    // Transactions
                    foreach (var transaction in bankTransactions)
                    {
                        // - bank
                        // payee
                        if (transaction.SourceId == 0)
                        {
                            // Payee
                            var payee = appDbContext.Payees
                                            .Where(b => b.PayeeId == transaction.PayeeId).FirstOrDefault();

                            transactions.Add(new Transaction()
                            {
                                BankTransactionId = transaction.BankTransactionId,
                                PayeeId = transaction.PayeeId,
                                PayeeName = payee.PayeeName,
                                PayeeType = payee.PayeeType,
                                AmountPaid = transaction.TransactionAmount,
                                TransactionDate = transaction.TransactionDate,
                                TransactionStatus = transaction.TransactionStatus,
                                CurrentBalance = transaction.CurrentBalance,
                                LastBalance = transaction.LastBalance,
                                RefCode = transaction.RefCode,
                                TransactionType = transaction.TransactionType,
                                SourceId = transaction.SourceId,
                                SourceName = "N/A"
                            });
                        }
                        // + bank
                        // source
                        else
                        {
                            // Source
                            var source = appDbContext.Sources
                                            .Where(b => b.SourceId == transaction.SourceId).FirstOrDefault();

                            transactions.Add(new Transaction()
                            {
                                BankTransactionId = transaction.BankTransactionId,
                                PayeeId = 0,
                                PayeeName = "N/A",
                                PayeeType = PayeeType.Others,
                                AmountPaid = transaction.TransactionAmount,
                                TransactionDate = transaction.TransactionDate,
                                TransactionStatus = transaction.TransactionStatus,
                                CurrentBalance = transaction.CurrentBalance,
                                LastBalance = transaction.LastBalance,
                                RefCode = transaction.RefCode,
                                TransactionType = transaction.TransactionType,
                                SourceId = transaction.SourceId,
                                SourceName = source.SourceName
                            });
                        }                       
                    }
                }
                else
                {                    
                }
            }
            else
            {
                throw new AccountNotFound("Account Not Found !");
            }         
            return accountStatement;
        }
                    
        // returns for all accounts of selected bank
        // - bank
        // TransactionType.Out
        // + bank from source
        // TransactionType.In
        public BankStatement GetBankStatement(Bank bank)
        {
            BankStatement bankStatement = new BankStatement();
            List<BankAccount> bankAccounts = new List<BankAccount>();
            bankStatement.BankAccounts = bankAccounts;
            List<Transaction> transactions = new List<Transaction>();

            bankStatement.BankId = bank.BankId;
            bankStatement.BankName = bank.BankName;

            // finding accounts of bank
            var accounts = appDbContext.Accounts
                                .Include(y=>y.BankTransactions)
                                .Where(x => x.BankId == bank.BankId);

            if (accounts != null)
            {
                foreach(var account in accounts)
                {
                    // adding accounts to bank
                    BankAccount bankAccount = new BankAccount();
                    bankAccount.AccountId = account.AccountId;
                    bankAccount.AccountNumber = account.AccountNumber;
                    bankAccount.AccountType = account.AccountType;
                    bankAccount.LastBalance = account.Balance;
                    bankAccount.Transactions = new List<Transaction>();

                    // finding transactions of bank-account
                    if (account.BankTransactions != null && account.BankTransactions.Count()>=1)
                    {
                        // -/+ bank
                        // Transactions
                        foreach (var transaction in account.BankTransactions)
                        {
                            // - bank
                            // payee
                            if (transaction.SourceId == 0)
                            {
                                // Payee
                                var payee = appDbContext.Payees
                                                .Where(b => b.PayeeId == transaction.PayeeId).FirstOrDefault();

                                bankAccount.Transactions.Add(new Transaction()
                                {
                                    BankTransactionId = transaction.BankTransactionId,
                                    PayeeId = transaction.PayeeId,
                                    PayeeName = payee.PayeeName,
                                    PayeeType = payee.PayeeType,
                                    AmountPaid = transaction.TransactionAmount,
                                    TransactionDate = transaction.TransactionDate,
                                    TransactionStatus = transaction.TransactionStatus,
                                    CurrentBalance = transaction.CurrentBalance,
                                    LastBalance = transaction.LastBalance,
                                    RefCode = transaction.RefCode,
                                    TransactionType = transaction.TransactionType,
                                    SourceId = transaction.SourceId,
                                    SourceName = "N/A"
                                });
                            }
                            // + bank
                            // source
                            else
                            {
                                // Source
                                var source = appDbContext.Sources
                                                .Where(b => b.SourceId == transaction.SourceId).FirstOrDefault();

                                bankAccount.Transactions.Add(new Transaction()
                                {
                                    BankTransactionId = transaction.BankTransactionId,
                                    PayeeId = 0,
                                    PayeeName = "N/A",
                                    PayeeType = PayeeType.Others,
                                    AmountPaid = transaction.TransactionAmount,
                                    TransactionDate = transaction.TransactionDate,
                                    TransactionStatus = transaction.TransactionStatus,
                                    CurrentBalance = transaction.CurrentBalance,
                                    LastBalance = transaction.LastBalance,
                                    RefCode = transaction.RefCode,
                                    TransactionType = transaction.TransactionType,
                                    SourceId = transaction.SourceId,
                                    SourceName = source.SourceName
                                });
                            }
                        }
                    }
                    bankAccounts.Add(bankAccount);
                }
            }
            else
            {
                throw new AccountNotFound("Bank has No Account Yet !");
            }
            return bankStatement;
        }

    }
}
