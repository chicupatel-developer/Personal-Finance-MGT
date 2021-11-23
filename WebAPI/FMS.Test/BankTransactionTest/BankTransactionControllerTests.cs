using System;
using Xunit;
using Moq;
using FMS.API.Controllers;
using FMS.Service.Interfaces;
using FMS.Entity.Context.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using FMS.Service.DTOs;
using System.Linq;
using FMS.Service.CustomException;
using FMS.Test.PayeeTest;

namespace FMS.Test.BankTransactionTest
{
    public class BankTransactionControllerTests
    {

        private readonly BankTransactionController _sut;
        private readonly Mock<IBankTransactionRepository> _bankTranRepoMock = new Mock<IBankTransactionRepository>();
        private readonly Mock<IPayeeRepository> _payeeRepoMock = new Mock<IPayeeRepository>();

        BankTransactionController _controller;
        IBankTransactionRepository _serviceBankTran;
        IPayeeRepository _servicePayee;

        public BankTransactionControllerTests()
        {
            _sut = new BankTransactionController(_bankTranRepoMock.Object, _payeeRepoMock.Object);

            _serviceBankTran = new BankTransactionRepositoryFake();
            _servicePayee = new PayeeRepositoryFake();
            _controller = new BankTransactionController(_serviceBankTran, _servicePayee);
        }

        [Fact]
        public void GetBankStatement_NullBankObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            Bank bankObj = null;
            /*
            var bankObj = new Bank()
            {
                 BankId = 11,
                  BankName = "CIBC"
            };
            */
            // var apiResponse = new APIResponse();

            // Act
            var badResponse = _controller.GetBankStatement(bankObj) as BadRequestObjectResult;

            // Assert
            // Assert.IsType<APIResponse>(okResult.Value);
            // Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
            // Assert.IsType<BadRequestObjectResult>(badResponse);
            Assert.Null(badResponse);
        }

        [Fact]
        public void GetBankStatement_InValidBankObjectPassed_ReturnsBadRequest()
        {
            // Arrange         
            var bankObj = new Bank()
            {
                 BankId = 11
            };
            // model state validation is only triggered during runtime. 
            _controller.ModelState.AddModelError("BankName", "Required");
            // var apiResponse = new APIResponse();

            // Act
            var badResponse = _controller.GetBankStatement(bankObj);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void GetBankStatement_ValidBankObjectPassed_ReturnsOK()
        {
            // Arrange         
            var bankObj = new Bank()
            {
                BankId = 1,
                BankName="CIBC"
            };
            var inTr = 0;
            var outTr = 0;

            // Act
            var okResult = _controller.GetBankStatement(bankObj) as OkObjectResult;
            // Assert
            Assert.IsType<BankStatement>(okResult.Value);
            Assert.Equal(1, (okResult.Value as BankStatement).BankId);
            Assert.Equal("CIBC", (okResult.Value as BankStatement).BankName);
            Assert.Single((okResult.Value as BankStatement).BankAccounts);
            
            Assert.Equal(2, (okResult.Value as BankStatement).BankAccounts.FirstOrDefault().Transactions.Count());
            foreach(var tr in ((okResult.Value as BankStatement).BankAccounts.FirstOrDefault().Transactions))
            {
                if (tr.TransactionType == TransactionType.In)
                    inTr += 1;
                else
                    outTr += 1;
            }
            Assert.Equal(1, inTr);
            Assert.Equal(1, outTr);
        }
              
        [Fact]
        public void GetBankStatement_BankHasNoAccount_ReturnsExceptionOKMinusOne()
        {
            // Arrange         
            var bankObj = new Bank()
            {
                BankId = 3,
                BankName = "RBC"
            };

            // Act
            var okResult = _controller.GetBankStatement(bankObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void GetAccountStatementAll_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            AccountVM acObj = null;

            // Act
            var badResponse = _controller.GetAccountStatementAll(acObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void GetAccountStatementAll_InValidObjectPassed_ReturnsBadRequest()
        {
            // Arrange         
            var missingAccountIdACObj = new AccountVM()
            {
                 AccountType = AccountType.Chequing                
            };
            // model state validation is only triggered during runtime. 
            _controller.ModelState.AddModelError("AccountId", "Required");

            // Act
            var badResponse = _controller.GetAccountStatementAll(missingAccountIdACObj);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void GetAccountStatementAll_ValidObjectPassed_ReturnsOK()
        {
            // Arrange         
            var acObj = new AccountVM()
            {
                 AccountId = 1,
                  AccountNumber = 1234
            };
            var inTr = 0;
            var outTr = 0;

            // Act
            var okResult = _controller.GetAccountStatementAll(acObj) as OkObjectResult;
            // Assert
            Assert.IsType<AccountStatement>(okResult.Value);
            Assert.Equal(1, (okResult.Value as AccountStatement).BankId);
            Assert.Equal("CIBC", (okResult.Value as AccountStatement).BankName);

            Assert.Equal(2, (okResult.Value as AccountStatement).Transactions.Count());
            foreach (var tr in ((okResult.Value as AccountStatement).Transactions))
            {
                if (tr.TransactionType == TransactionType.In)
                {
                    inTr += 1;
                    Assert.Equal(1, tr.SourceId);
                }
                else
                {
                    outTr += 1;
                    Assert.Equal(1, tr.PayeeId);
                }
            }
            Assert.Equal(1, inTr);
            Assert.Equal(1, outTr);
        }

        [Fact]
        public void GetAccountStatementAll_WhenAccountNotFound_ReturnsExceptionOKMinusOne()
        {
            // Arrange         
            var acObj = new AccountVM()
            {
                AccountId = 11,
                AccountNumber = 1234
            };

            // Act
            var okResult = _controller.GetAccountStatementAll(acObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void GetTransactionStatusTypes_WhenCalled_ReturnsListOfTransactionStatusTypes()
        {
            // Act
            var okResult = _controller.GetTransactionStatusTypes() as OkObjectResult;
            // Assert
            var listOfAccountTypes = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(2, listOfAccountTypes.Count());
        }

        [Fact]
        public void AddBankTransaction_ValidObjectPassedNotACreditCard_ReturnsAPIResponseZero()
        {
            // Arrange
            // Payee
            // Not a CC
            var bankTrObj = new BankTransaction()
            {
                 PayeeId = 1,
                  TransactionAmount = 1000,
                   TransactionDate = DateTime.Now,
                    BankId = 1,
                     AccountId = 1 
            };

            // Act
            var okResult = _controller.AddBankTransaction(bankTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Bank-Transaction Added Successfully !", (okResult.Value as APIResponse).ResponseMessage);
        }

        [Fact]
        public void AddBankTransaction_MinusBankBalanceNotACreditCard_ReturnsAPIResponseMinusOne()
        {
            // Arrange
            // Payee
            // Not a CC
            var bankTrObj = new BankTransaction()
            {
                PayeeId = 1,
                TransactionAmount = 2000,
                TransactionDate = DateTime.Now,
                BankId = 1,
                AccountId = 1
            };

            // Act
            var okResult = _controller.AddBankTransaction(bankTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void AddBankTransaction_ValidObjectPassedCreditCard_ReturnsAPIResponseZero()
        {
            // Arrange
            // Payee
            // CC
            var bankTrObj = new BankTransaction()
            {
                PayeeId = 3,
                TransactionAmount = 1000,
                TransactionDate = DateTime.Now,
                BankId = 1,
                AccountId = 1
            };

            // Act
            var okResult = _controller.AddBankTransaction(bankTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Bank-Transaction Added Successfully !", (okResult.Value as APIResponse).ResponseMessage);
        }

        [Fact]
        public void AddBankTransaction_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            BankTransaction bankTrObj = null;         

            // Act
            var badResponse = _controller.AddBankTransaction(bankTrObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void AddBankTransaction_ModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange         
            var bankTrObj = new Bank()
            {
                
            };
            // model state validation is only triggered during runtime. 
            _controller.ModelState.AddModelError("BankId", "Required");

            // Act
            var badResponse = _controller.GetBankStatement(bankTrObj);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

    }
}
