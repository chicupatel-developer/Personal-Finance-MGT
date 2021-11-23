﻿using FMS.Entity.Context.Models;
using FMS.Service.CustomException;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using FMS.Service.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.BankTransactionTest
{
    public class BankTransactionRepositoryFake : IBankTransactionRepository
    {
        private readonly List<CreditCardTransaction> _ccTrans;
        private readonly List<BankTransaction> _trans;
        private readonly List<Account> _accounts;
        private readonly List<Bank> _banks;
        private readonly List<Payee> _payees;
        private readonly List<Source> _sources;
        public BankTransactionRepositoryFake()
        {
            _ccTrans = new List<CreditCardTransaction>();          

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
            _payees = new List<Payee>()
            {
                new Payee() {
                     Balance=0,
                      Description = "Payee - 1",
                       PayeeACNumber = "1234",
                        PayeeId = 1,
                         PayeeName = "Payee - 1",
                          PayeeType = PayeeType.Hydro
                },
                  new Payee() {
                     Balance=0,
                      Description = "Payee - 2",
                       PayeeACNumber = "2345",
                        PayeeId = 2,
                         PayeeName = "Payee - 2",
                          PayeeType = PayeeType.SuperStore
                },
                    new Payee() {
                     Balance=1000,
                      Description = "VISA",
                       PayeeACNumber = "3456",
                        PayeeId = 3,
                         PayeeName = "VISA",
                          PayeeType = PayeeType.CreditCard
                }
            };
            _sources = new List<Source>()
            {
                new Source() {
                     SourceId = 1,
                      SourceName = "CRA",
                       Description="CRA-1"
                }
            };
            _accounts = new List<Account>() {
                new Account()
                {
                      AccountId = 1,
                       AccountNumber = 1234,
                       AccountType = AccountType.Chequing,
                        Balance = 1000,
                        BankId = 1,
                         BankTransactions = _trans.Where(x=>x.BankId==1 && x.AccountId==1).ToList()
                },
                new Account()
                {
                      AccountId = 2,
                       AccountNumber = 2345,
                       AccountType = AccountType.Savings,
                        Balance = 2000,
                         BankId = 2,
                         BankTransactions = new List<BankTransaction>()
                }
            };
        }

        // Test OK
        public BankTransaction AddBankTransaction(BankTransaction bankTransaction)
        {
            // throw new NotImplementedException();
            // 1)
            var account = _accounts.Where(x => x.BankId == bankTransaction.BankId && x.AccountId == bankTransaction.AccountId).ToList().FirstOrDefault();
            var currentBalance = account.Balance;
            account.Balance -= bankTransaction.TransactionAmount;
            if (account.Balance < 0)
            {
                // throw new Exception();
                throw new MinusBankBalance("Transaction Fails ! You can pay maximum of " + currentBalance);
            }

            // 2)
            var refCode = RefCodeGenerator.RandomString(6);
            _trans.Add(new BankTransaction()
            {
                PayeeId = bankTransaction.PayeeId,
                TransactionAmount = bankTransaction.TransactionAmount,
                TransactionDate = bankTransaction.TransactionDate,
                TransactionStatus = TransactionStatus.Success,
                BankId = bankTransaction.BankId,
                AccountId = bankTransaction.AccountId,
                LastBalance = currentBalance,
                CurrentBalance = account.Balance,
                RefCode = refCode,
                TransactionType = TransactionType.Out,

                // Out transaction for bank
                // - bank
                SourceId = 0
            });
          
            // 3
            // check for cc
            // if cc is the payee type, then add amount @ cc Balance of Payee
            var payee = _payees
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
                _ccTrans.Add(new CreditCardTransaction()
                {
                    CreditCardId = payee.PayeeId,
                    TransactionAmount = bankTransaction.TransactionAmount,
                    TransactionDate = bankTransaction.TransactionDate,
                    TransactionStatus = TransactionStatus.Success,
                    PayeeId = payee.PayeeId,
                    LastBalance = ccCurrentBalance,
                    CurrentBalance = payee.Balance,
                    RefCode = refCode,
                    TransactionType = TransactionType.In
                });
            }

            // check last moment exception
            // throw new Exception();

            return bankTransaction;
        }

        // Test OK
        public AccountStatement GetAccountStatementAll(AccountVM accountVM)
        {
            // throw new NotImplementedException();
            AccountStatement accountStatement = new AccountStatement();
            List<Transaction> transactions = new List<Transaction>();
            accountStatement.Transactions = transactions;

            // Accounts
            var account = _accounts
                                .Where(x => x.AccountId == accountVM.AccountId).FirstOrDefault();

            if (account != null)
            {
                accountStatement.AccountId = account.AccountId;
                accountStatement.AccountNumber = account.AccountNumber;
                accountStatement.AccountType = account.AccountType;
                accountStatement.BankId = account.BankId;
                accountStatement.BankName = _banks.Where(x => x.BankId == account.BankId).FirstOrDefault().BankName;
                accountStatement.LastBalance = account.Balance;

                // Transactions
                var bankTransactions = _trans
                                            .Where(a => a.AccountId == accountVM.AccountId);
                if (bankTransactions != null && bankTransactions.Count() >= 1)
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
                            var payee = _payees
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
                            var source = _sources
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

        // Test OK
        public BankStatement GetBankStatement(Bank bank)
        {
            // throw new NotImplementedException();
            BankStatement bankStatement = new BankStatement();
            List<BankAccount> bankAccounts = new List<BankAccount>();
            bankStatement.BankAccounts = bankAccounts;
            List<Transaction> transactions = new List<Transaction>();

            bankStatement.BankId = bank.BankId;
            bankStatement.BankName = bank.BankName;

            // finding accounts of bank
            var accounts = _accounts.Where(x=>x.BankId==bank.BankId);

            if (accounts != null && accounts.Count()>0)
            {
                foreach (var account in accounts)
                {
                    // adding accounts to bank
                    BankAccount bankAccount = new BankAccount();
                    bankAccount.AccountId = account.AccountId;
                    bankAccount.AccountNumber = account.AccountNumber;
                    bankAccount.AccountType = account.AccountType;
                    bankAccount.LastBalance = account.Balance;
                    bankAccount.Transactions = new List<Transaction>();

                    // finding transactions of bank-account
                    if (account.BankTransactions != null && account.BankTransactions.Count() >= 1)
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
                                var payee = _payees
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
                                var source = _sources
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

        // Test OK
        public List<string> GetTransactionStatusTypes()
        {
            // throw new NotImplementedException();
            List<string> transactionStatusTypes = new List<string>();
            foreach (string transactionStatusType in Enum.GetNames(typeof(TransactionStatus)))
            {
                transactionStatusTypes.Add(transactionStatusType);
            }
            return transactionStatusTypes;
        }
    }
}
