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
    public class CreditcardRepository : ICreditcardRepository
    {
        private readonly FMSContext appDbContext;

        public CreditcardRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<CreditCard> GetAllCCs()
        {
            List<CreditCard> ccs = new List<CreditCard>();
            var payeesDb = appDbContext.Payees
                           .Where(x => x.PayeeType == PayeeType.CreditCard);
            if (payeesDb != null)
            {
                foreach(var payee in payeesDb)
                {
                    ccs.Add(new CreditCard()
                    {
                         Balance = payee.Balance,
                          CreditCardId = payee.PayeeId,
                           CreditCardName = payee.PayeeName,
                            CreditCardNumber = payee.PayeeACNumber,
                             PayeeType = payee.PayeeType
                    });
                }
            }
            return ccs;
        }

        // + cc
        // - bank
        // TransactionType.In
        // AND //
        // - cc
        // TransactionType.Out
        public CreditCardStatement GetCreditCardStatementAll(CreditCard cc)
        {
            CreditCardStatement ccStatement = new CreditCardStatement();
            ccStatement.Transactions = new List<CreditCardStatement.Transaction>();

            // Credit Card
            var creditCard = appDbContext.Payees
                                .Where(x => x.PayeeId == cc.CreditCardId).FirstOrDefault();

            if (creditCard != null)
            {
                ccStatement.Balance = creditCard.Balance;
                ccStatement.CreditCardId = creditCard.PayeeId;
                ccStatement.CreditCardNumber = creditCard.PayeeACNumber;
                ccStatement.PayeeType = creditCard.PayeeType;
                ccStatement.CreditCardName = creditCard.PayeeName;


                // CreditCardTransactions db table
                var ccTrans = appDbContext.CreditCardTransactions
                                .Where(x => x.CreditCardId == cc.CreditCardId);
                if(ccTrans != null && ccTrans.Count() > 0)
                {
                    foreach(var ccTran in ccTrans)
                    {
                        // + cc
                        // - bank
                        // user RefCode to access bank-account
                        if (ccTran.TransactionType == 0)
                        {
                            var bankTran = appDbContext.BankTransactions
                                            .Include(a=>a.Bank)
                                            .Include(b=>b.Account)
                                            .Where(y => y.RefCode == ccTran.RefCode).FirstOrDefault();

                            ccStatement.Transactions.Add(new CreditCardStatement.Transaction()
                            {
                                CreditCardTransactionId = ccTran.CreditCardTransactionId,
                                PayeeId = 0,
                                PayeeName = "N/A",
                                PayeeType = PayeeType.Others,
                                AmountPaid = ccTran.TransactionAmount,
                                TransactionDate = ccTran.TransactionDate,
                                TransactionStatus = ccTran.TransactionStatus,
                                CurrentBalance = ccTran.CurrentBalance,
                                LastBalance = ccTran.LastBalance,
                                BankId = bankTran.BankId,
                                BankName = bankTran.Bank.BankName,
                                AccountId = bankTran.AccountId,
                                AccountNumber = bankTran.Account.AccountNumber,
                                TransactionType = TransactionType.In,
                                RefCode = ccTran.RefCode
                            });
                        }
                        // - cc
                        else
                        {
                            // Payee
                            var payee = appDbContext.Payees
                                            .Where(b => b.PayeeId == ccTran.PayeeId).FirstOrDefault();

                            ccStatement.Transactions.Add(new CreditCardStatement.Transaction()
                            {
                                CreditCardTransactionId = ccTran.CreditCardTransactionId,
                                PayeeId = ccTran.PayeeId,
                                PayeeName = payee.PayeeName,
                                PayeeType = payee.PayeeType,
                                AmountPaid = ccTran.TransactionAmount,
                                TransactionDate = ccTran.TransactionDate,
                                TransactionStatus = ccTran.TransactionStatus,
                                CurrentBalance = ccTran.CurrentBalance,
                                LastBalance = ccTran.LastBalance,
                                BankId = 0,
                                BankName = "N/A",
                                AccountId = 0,
                                AccountNumber = 0,
                                TransactionType = TransactionType.Out,
                                RefCode = ccTran.RefCode
                            });
                        }
                    }
                }
                else
                {
                }

                // order by transaction-id
                if (ccStatement.Transactions.Count() > 1)
                {
                    ccStatement.Transactions = ccStatement.Transactions.OrderBy(x => x.CreditCardTransactionId).ToList();
                }
            }
            else
            {
                throw new CreditCardNotFound("Credit-Card Not Found !");
            }
            return ccStatement;
        }

        // - cc
        // TransactionType.Out
        public CreditCardTransaction AddCCTransaction(CreditCardTransaction ccTransaction)
        {
            // 0)
            // check for Payee and CreditCard Exists or not
            var _payee = appDbContext.Payees.Where(x => x.PayeeId == ccTransaction.PayeeId).FirstOrDefault();
            var _cc = appDbContext.Payees.Where(x => x.PayeeId == ccTransaction.CreditCardId && x.PayeeType == PayeeType.CreditCard).FirstOrDefault();
            if (_payee == null || _cc == null)
                throw new CreditCardNotFound("Unknown Payee Or CreditCard !");

            // 1)
            var cc = appDbContext.Payees.Where(x => x.PayeeId == ccTransaction.CreditCardId).FirstOrDefault();
            var currentBalance = cc.Balance;
            cc.Balance -= ccTransaction.TransactionAmount;
            if (cc.Balance < 0)
            {
                // throw new Exception();
                throw new MinusCCBalance("Transaction Fails ! You can pay maximum of " + currentBalance);
            }

            // 2)
            var result = appDbContext.CreditCardTransactions.Add(new CreditCardTransaction()
            {
                PayeeId = ccTransaction.PayeeId,
                TransactionAmount = ccTransaction.TransactionAmount,
                TransactionDate = ccTransaction.TransactionDate,
                TransactionStatus = TransactionStatus.Success,
                CreditCardId = ccTransaction.CreditCardId,
                LastBalance = currentBalance,
                CurrentBalance = cc.Balance,

                RefCode = RefCodeGenerator.RandomString(6),
                TransactionType = TransactionType.Out
            });

            // check last moment exception
            // throw new Exception();

            appDbContext.SaveChanges();
            return result.Entity;
        }

    }
}