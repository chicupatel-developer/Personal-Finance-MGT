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

namespace FMS.Test.AccountTest
{
    public class AccountControllerTests
    {

        private readonly AccountController _sut;
        private readonly Mock<IAccountRepository> _accountRepoMock = new Mock<IAccountRepository>();

        AccountController _controller;
        IAccountRepository _service;

        public AccountControllerTests()
        {
            _sut = new AccountController(_accountRepoMock.Object);


            _service = new AccountRepositoryFake();
            _controller = new AccountController(_service);
        }

        [Fact]
        public void GetAllAccounts_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.GetAllAccounts();
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }

        [Fact]
        public void GetAllAccounts_WhenCalled_ReturnsAllAccountsOfAllBanks()
        {
            // Act
            var okResult = _controller.GetAllAccounts() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<AccountListVM>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }

        [Fact]
        public void GetAccount_UnknownAccountPassed_ReturnsBadRequest()
        {
            // Act
            var badRequestResult = _controller.GetAccount(11);
            // Assert
            Assert.IsType<BadRequestResult>(badRequestResult);
        }

        [Fact]
        public void GetAccount_ExistingAccountPassed_ReturnsOkResult()
        {
            var accountId = 1;
            // Act
            var okResult = _controller.GetAccount(accountId);
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }

        [Fact]
        public void GetAccount_ExistingAccountPassed_ReturnsRightAccount()
        {
            // Arrange
            var accountId = 1;
            var accountNumber = 1234;
            // Act
            var okResult = _controller.GetAccount(accountId) as OkObjectResult;
            // Assert
            Assert.IsType<Account>(okResult.Value);
            Assert.Equal(accountId, (okResult.Value as Account).AccountId);
            Assert.Equal(accountNumber, (okResult.Value as Account).AccountNumber);
        }

        [Fact]
        public void AddAccount_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var accountNumberMissingItem = new Account()
            {
                AccountId = 4,
                 AccountType = AccountType.Chequing,
                  Balance = 4000                   
            };
            _controller.ModelState.AddModelError("AccountNumber", "Required");
            // Act
            var badResponse = _controller.AddAccount(accountNumberMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void AddAccount_ValidObjectPassed_ReturnsCreatedResponse()
        {
            // Arrange
            var testAccount = new Account()
            {
                AccountId = 4,
                AccountType = AccountType.Chequing,
                Balance = 4000,
                 AccountNumber = 4567
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.AddAccount(testAccount) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void EditAccount_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var accountNumberMissingItem = new Account()
            {
                AccountId = 1,
                AccountType = AccountType.Savings,
                Balance = 100
            };
            _controller.ModelState.AddModelError("AccountNumber", "Required");
            // Act
            var badResponse = _controller.EditAccount(accountNumberMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void EditAccount_ValidObjectPassedButNotFound_ReturnsOKMinusOne()
        {
            // Arrange
            var editingAccount = new Account()
            {
                AccountId = 4,
                AccountType = AccountType.Chequing,
                Balance = 4000,
                AccountNumber = 4567
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.EditAccount(editingAccount) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void EditBank_ValidObjectPassed_ReturnsOKZero()
        {
            // Arrange
            var editingAccount = new Account()
            {
                AccountId = 1,
                AccountType = AccountType.Chequing,
                Balance = 4000,
                AccountNumber = 1234
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.EditAccount(editingAccount) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void GetBankAccounts_WhenCalled_ReturnsAllAccountsOfSelectedBank()
        {
            // Arrange
            var bankId = 1;
            // Act
            var okResult = _controller.GetBankAccounts(bankId) as OkObjectResult;
            // Assert
            var bankAccountVM = Assert.IsType<BankAccountVM>(okResult.Value);
            Assert.Single(bankAccountVM.Accounts);
        }

        [Fact]
        public void GetBankAccounts_BankNotFound_ReturnsNull()
        {
            // Arrange
            var bankId = 4;
            // Act
            var okResult = _controller.GetBankAccounts(bankId) as OkObjectResult;
            // Assert
            var bankAccountVM = Assert.IsType<BankAccountVM>(okResult.Value);
            Assert.Empty(bankAccountVM.Accounts);
        }

        [Fact]
        public void GetAllAccountTypes_WhenCalled_ReturnsListOfAccountTypes()
        {
            // Act
            var okResult = _controller.GetAllAccountTypes() as OkObjectResult;
            // Assert
            var listOfAccountTypes = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(3, listOfAccountTypes.Count());
        }

    }
}
