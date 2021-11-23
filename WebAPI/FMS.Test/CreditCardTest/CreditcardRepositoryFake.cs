using FMS.Entity.Context.Models;
using FMS.Service.CustomException;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using FMS.Service.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.CreditCardTest
{
    public class CreditcardRepositoryFake : ICreditcardRepository
    {
        private readonly List<BankTransaction> _trans;
        private readonly List<CreditCardTransaction> _ccTrans;
        private readonly List<Payee> _payees;
        public CreditcardRepositoryFake()
        {
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
            _ccTrans = new List<CreditCardTransaction>();    
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
        }

        public CreditCardTransaction AddCCTransaction(CreditCardTransaction ccTransaction)
        {
            // 0)
            // check for Payee and CreditCard Exists or not
            var _payee = _payees.Where(x => x.PayeeId == ccTransaction.PayeeId).FirstOrDefault();
            var _cc = _payees.Where(x => x.PayeeId == ccTransaction.CreditCardId && x.PayeeType == PayeeType.CreditCard).FirstOrDefault();

            if (_payee == null || _cc == null)
                throw new CreditCardNotFound("Unknown Payee Or CreditCard !");

            // 1)
            var cc = _payees.Where(x => x.PayeeId == ccTransaction.CreditCardId).FirstOrDefault();
            var currentBalance = cc.Balance;
            cc.Balance -= ccTransaction.TransactionAmount;
            if (cc.Balance < 0)
            {
                // throw new Exception();
                throw new MinusCCBalance("Transaction Fails ! You can pay maximum of " + currentBalance);
            }

            // 2)            
            _ccTrans.Add(new CreditCardTransaction()
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

            return ccTransaction;
        }

        public IEnumerable<CreditCard> GetAllCCs()
        {
            List<CreditCard> ccs = new List<CreditCard>();
            var payeesDb = _payees
                           .Where(x => x.PayeeType == PayeeType.CreditCard);
            if (payeesDb != null)
            {
                foreach (var payee in payeesDb)
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
            var creditCard = _payees
                                .Where(x => x.PayeeId == cc.CreditCardId).FirstOrDefault();

            if (creditCard != null)
            {
                ccStatement.Balance = creditCard.Balance;
                ccStatement.CreditCardId = creditCard.PayeeId;
                ccStatement.CreditCardNumber = creditCard.PayeeACNumber;
                ccStatement.PayeeType = creditCard.PayeeType;
                ccStatement.CreditCardName = creditCard.PayeeName;


                // CreditCardTransactions db table
                var ccTrans = _ccTrans
                                .Where(x => x.CreditCardId == cc.CreditCardId);
                if (ccTrans != null && ccTrans.Count() > 0)
                {
                    foreach (var ccTran in ccTrans)
                    {
                        // + cc
                        // - bank
                        // user RefCode to access bank-account
                        if (ccTran.TransactionType == 0)
                        {
                            var bankTran = _trans
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
                            var payee = _payees
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

    }
}
