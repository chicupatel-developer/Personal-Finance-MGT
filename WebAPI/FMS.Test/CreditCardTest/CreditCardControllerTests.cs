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

namespace FMS.Test.CreditCardTest
{
    public class CreditCardControllerTests
    {

        private readonly CreditCardController _sut;
        private readonly Mock<ICreditcardRepository> _ccRepoMock = new Mock<ICreditcardRepository>();

        CreditCardController _controller;
        ICreditcardRepository _serviceCC;

        public CreditCardControllerTests()
        {
            _sut = new CreditCardController(_ccRepoMock.Object);

            _serviceCC = new CreditcardRepositoryFake();
            _controller = new CreditCardController(_serviceCC);
        }

        [Fact]
        public void GetAllCCs_WhenCalled_ReturnsListOfCreditCards()
        {           
            // Act
            var okResult = _controller.GetAllCCs() as ObjectResult;

            // Assert
            var ccCount = Assert.IsType<List<CreditCard>>(okResult.Value);
            Assert.Single(ccCount);
        }

        [Fact]
        public void GetCreditCardStatementAll_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            CreditCard ccObj = null;

            // Act
            var badResponse = _controller.GetCreditCardStatementAll(ccObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void GetCreditCardStatementAll_ModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange         
            var missingCreditCardIdObj = new CreditCard()
            {
                 Balance = 1000
            };
            // model state validation is only triggered during runtime. 
            _controller.ModelState.AddModelError("CreditCardId", "Required");

            // Act
            var badResponse = _controller.GetCreditCardStatementAll(missingCreditCardIdObj);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void GetCreditCardStatementAll_NotFoundObjectPassed_ReturnsAPIResponseMinusOne()
        {
            // Arrange         
            var creditCardObj = new CreditCard()
            {
                Balance = 1000,
                 CreditCardId = 11,
                  CreditCardName = "VISA",
                   CreditCardNumber="1234"
            };          

            // Act
            var okResult = _controller.GetCreditCardStatementAll(creditCardObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void GetCreditCardStatementAll_ValidObjectPassed_ReturnsOK()
        {
            // Arrange         
            var creditCardcObj = new CreditCard()
            {
                CreditCardId = 3
            };

            // Act
            var okResult = _controller.GetCreditCardStatementAll(creditCardcObj) as OkObjectResult;
            // Assert
            Assert.IsType<CreditCardStatement>(okResult.Value);            
            Assert.Equal("VISA", (okResult.Value as CreditCardStatement).CreditCardName);
            Assert.Equal("3456",(okResult.Value as CreditCardStatement).CreditCardNumber);
            Assert.Equal(1000, (okResult.Value as CreditCardStatement).Balance);
            Assert.Empty((okResult.Value as CreditCardStatement).Transactions);           
        }

        [Fact]
        public void AddCCTransaction_ValidObjectPassed_ReturnsAPIResponseZero()
        {
            // Arrange
            var ccTrObj = new CreditCardTransaction()
            {
                 CreditCardId = 3,
                  TransactionAmount = 1000,
                   TransactionDate = DateTime.Now,
                    PayeeId = 1  
            };

            // Act
            var okResult = _controller.AddCCTransaction(ccTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Credit-Card-Transaction Added Successfully !", (okResult.Value as APIResponse).ResponseMessage);
        }

        [Fact]
        public void AddCCTransaction_MinusCCBalancePassed_ReturnsAPIResponseMinusOne()
        {
            // Arrange
            var ccTrObj = new CreditCardTransaction()
            {
                CreditCardId = 3,
                TransactionAmount = 2000,
                TransactionDate = DateTime.Now,
                PayeeId = 1
            };

            // Act
            var okResult = _controller.AddCCTransaction(ccTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
        }

        [Fact]
        public void AddCCTransaction_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            CreditCardTransaction ccTrObj = null;

            // Act
            var badResponse = _controller.AddCCTransaction(ccTrObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void AddCCTransaction_ModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange         
            var missingCreditCardIdCCTrObj = new CreditCardTransaction()
            {
                 PayeeId=1
            };
            // model state validation is only triggered during runtime. 
            _controller.ModelState.AddModelError("CreditCardId", "Required");

            // Act
            var badResponse = _controller.AddCCTransaction(missingCreditCardIdCCTrObj);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void AddCCTransaction_NotFoundObjectPassed_ReturnsAPIResponseMinusOne()
        {
            // Arrange         
            var creditCardTrObj = new CreditCardTransaction()
            {
                 CreditCardId = 1111,
                  PayeeId = 1111
            };

            // Act
            var okResult = _controller.AddCCTransaction(creditCardTrObj) as ObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as APIResponse).ResponseCode);
            Assert.Equal("Unknown Payee Or CreditCard !", (okResult.Value as APIResponse).ResponseMessage);
        }


    }
}
