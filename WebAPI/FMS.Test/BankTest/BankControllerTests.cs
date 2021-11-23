using System;
using Xunit;
using Moq;
using FMS.API.Controllers;
using FMS.Service.Interfaces;
using FMS.Entity.Context.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using FMS.Service.DTOs;

namespace FMS.Test.BankTest
{
    public class BankControllerTests
    {

        private readonly BankController _sut;
        private readonly Mock<IBankRepository> _bankRepoMock = new Mock<IBankRepository>();

        BankController _controller;
        IBankRepository _service;

        public BankControllerTests()
        {
            _sut = new BankController(_bankRepoMock.Object);


            _service = new BankRepositoryFake();
            _controller = new BankController(_service);
        }

        [Fact]
        public void GetBank_ShouldReturnBankForNextEditOperation_WhenBankExists()
        {
            // Arrange
            Random rnd = new Random();
            var bankId = rnd.Next(1, 10);
            var bankName = "CIBC";
            var bank = new Bank()
            {
                 BankId = bankId,
                 BankName = bankName
            };
            _bankRepoMock.Setup(x => x.GetBank(bankId))
                            .Returns(bank);

            // Act
            var okResult = _sut.GetBank(bankId) as OkObjectResult;

            // Assert
            Assert.Equal(bankId, (okResult.Value as Bank).BankId);
        }

        [Fact]
        public void GetAllBanks_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.GetAllBanks();
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }

        [Fact]
        public void GetAllBanks_WhenCalled_ReturnsAllBanks()
        {
            // Act
            var okResult = _controller.GetAllBanks() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<Bank>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }

        [Fact]
        public void GetBank_UnknownBankPassed_ReturnsBadRequest()
        {
            // Act
            var badRequestResult = _controller.GetBank(11);
            // Assert
            // Assert.IsType<NotFoundResult>(badRequestResult);
            Assert.IsType<BadRequestResult>(badRequestResult);
        }

        [Fact]
        public void GetBank_ExistingBankPassed_ReturnsOkResult()
        {
            var bankId = 1;
            // Act
            var okResult = _controller.GetBank(bankId);
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }

        [Fact]
        public void GetBank_ExistingBankPassed_ReturnsRightBank()
        {
            // Arrange
            var bankId = 1;
            var bankName = "CIBC";
            // Act
            var okResult = _controller.GetBank(bankId) as OkObjectResult;
            // Assert
            Assert.IsType<Bank>(okResult.Value);
            Assert.Equal(bankId, (okResult.Value as Bank).BankId);
            Assert.Equal(bankName, (okResult.Value as Bank).BankName);
        }

        [Fact]
        public void AddBank_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var bankNameMissingItem = new Bank()
            {
                BankId = 4
            };
            _controller.ModelState.AddModelError("BankName", "Required");
            // Act
            var badResponse = _controller.AddBank(bankNameMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void AddBank_ValidObjectPassed_ReturnsCreatedResponse()
        {
            // Arrange
            Bank testBank = new Bank()
            {
               BankId = 4,
                BankName = "Scotia"
            };
            var apiResponse = new APIResponse();

            // Act
            // var createdResponse = _controller.AddBank(testBank);
            var okResult = _controller.AddBank(testBank) as OkObjectResult;

            // Assert
            // Assert.IsType<CreatedAtActionResult>(createdResponse);
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
        }


        [Fact]
        public void EditBank_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var bankNameMissingItem = new Bank()
            {
                BankId = 4
            };
            _controller.ModelState.AddModelError("BankName", "Required");
            // Act
            var badResponse = _controller.EditBank(bankNameMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void EditBank_ValidObjectPassedButNotFound_ReturnsOKMinusOne()
        {
            // Arrange
            var editingBank = new Bank()
            {
                BankId = 4,
                 BankName = "New CIBC"
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.EditBank(editingBank) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void EditBank_ValidObjectPassed_ReturnsOKZero()
        {
            // Arrange
            var editingBank = new Bank()
            {
                BankId = 1,
                BankName = "New CIBC"
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.EditBank(editingBank) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
        }

    }
}
