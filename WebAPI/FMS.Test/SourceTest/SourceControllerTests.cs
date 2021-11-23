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

namespace FMS.Test.SourceTest
{
    public class SourceControllerTests
    {

        private readonly SourceController _sut;
        private readonly Mock<ISourceRepository> _sourceRepoMock = new Mock<ISourceRepository>();

        SourceController _controller;
        ISourceRepository _service;

        public SourceControllerTests()
        {
            _sut = new SourceController(_sourceRepoMock.Object);


            _service = new SourceRepositoryFake();
            _controller = new SourceController(_service);
        }

        [Fact]
        public void GetAllSources_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.GetAllSources();
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }

        [Fact]
        public void GetAllSources_WhenCalled_ReturnsAllSources()
        {
            // Act
            var okResult = _controller.GetAllSources() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<Source>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }    

        [Fact]
        public void BankInputFromSource_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var bankIdMissingItem = new BankTransaction()
            {
                 AccountId = 1 
            };
            _controller.ModelState.AddModelError("BankId", "Required");
            // Act
            var badResponse = _controller.BankInputFromSource(bankIdMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void BankInputFromSource_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            BankTransaction bankTrObj = null;

            // Act
            var badResponse = _controller.BankInputFromSource(bankTrObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void BankInputFromSource_ValidObjectPassed_ReturnsAPIResponseZero()
        {
            // Arrange
            var bankTrObj = new BankTransaction()
            {
                 AccountId = 1,
                  BankId = 1,
                   SourceId = 1,
                    TransactionAmount = 1000,
                     TransactionDate = DateTime.Now
            };

            // Act
            var okResult = _controller.BankInputFromSource(bankTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Source To Bank Transaction Added Successfully !", (okResult.Value as APIResponse).ResponseMessage);
        }

        [Fact]
        public void BankInputFromSource_ObjectPassedButExceptionThrows_ReturnsAPIResponseMinusOne()
        {
            // Arrange
            var bankTrObj = new BankTransaction()
            {
                AccountId = 1111,
                BankId = 1111,
                SourceId = 1,
                TransactionAmount = 1000,
                TransactionDate = DateTime.Now
            };

            // Act
            var okResult = _controller.BankInputFromSource(bankTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Server Error !", (okResult.Value as APIResponse).ResponseMessage);
        }


    }
}
