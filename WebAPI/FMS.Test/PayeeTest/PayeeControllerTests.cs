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

namespace FMS.Test.PayeeTest
{
    public class PayeeControllerTests
    {

        private readonly PayeeController _sut;
        private readonly Mock<IPayeeRepository> _payeeRepoMock = new Mock<IPayeeRepository>();

        PayeeController _controller;
        IPayeeRepository _service;

        public PayeeControllerTests()
        {
            _sut = new PayeeController(_payeeRepoMock.Object);


            _service = new PayeeRepositoryFake();
            _controller = new PayeeController(_service);
        }
             
        [Fact]
        public void GetAllPayeeTypes_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.GetAllPayeeTypes() as OkObjectResult;
            // Assert
            var listOfPayeeTypes = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(13, listOfPayeeTypes.Count());

        }

        [Fact]
        public void GetAllPayees_WhenCalled_ReturnsAllPayees()
        {
            // Act
            var okResult = _controller.GetAllPayees() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<Payee>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }
            
        [Fact]
        public void AddPayee_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var payeeACNumberMissingItem = new Payee()
            {
                 Balance = 0,
                  Description = "Payee - 4",
                   PayeeType = PayeeType.CanadianTire,
                    PayeeId = 4,
                     PayeeName = "Payee - 4"                             
            };
            _controller.ModelState.AddModelError("PayeeAccountNumber", "Required");
            // Act
            var badResponse = _controller.AddPayee(payeeACNumberMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }

        [Fact]
        public void AddPayee_ValidObjectPassed_ReturnsCreatedResponse()
        {
            // Arrange
            var testPayee = new Payee()
            {
                Balance = 0,
                Description = "Payee - 4",
                PayeeType = PayeeType.CanadianTire,
                PayeeId = 4,
                PayeeName = "Payee - 4",
                 PayeeACNumber = "4567"
            };
            var apiResponse = new APIResponse();

            // Act
            var okResult = _controller.AddPayee(testPayee) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as APIResponse).ResponseCode);
        }
    
        [Fact]
        public void GetAllPayeesCC_WhenCalled_ReturnsAllCreditCardTypeOfPayee()
        {           
            // Act
            var okResult = _controller.GetAllPayeesCC() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<Payee>>(okResult.Value);
            Assert.Equal(1, items.Count);
        }
    }
}
