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

namespace FMS.Test.EntityMonitorTest
{
    public class EntityMonitorControllerTests
    {

        private readonly EntityMonitorController _sut;
        private readonly Mock<IEntityMonitorRepository> _entityMonitorRepoMock = new Mock<IEntityMonitorRepository>();

        EntityMonitorController _controller;
        IEntityMonitorRepository _service;

        public EntityMonitorControllerTests()
        {
            _sut = new EntityMonitorController(_entityMonitorRepoMock.Object);


            _service = new EntityMonitorRepositoryFake();
            _controller = new EntityMonitorController(_service);
        }    

        [Fact]
        public void MonitorAccountMonthly_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var accountIdMissingItem = new AccountMonthlyRequest()
            {
                 BankId = 1
            };
            // Act
            var badResponse = _controller.MonitorAccountMonthly(accountIdMissingItem) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void MonitorAccountMonthly_ObjectPassedButNotFound_ReturnsBadRequest()
        {
            // Arrange
            var notFoundItem = new AccountMonthlyRequest()
            {
                BankId = 111,
                  AccountId = 111
            };
            // Act
            var badResponse = _controller.MonitorAccountMonthly(notFoundItem) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void MonitorAccountMonthly_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            AccountMonthlyRequest acMonthlyReqObj = null;

            // Act
            var badResponse = _controller.MonitorAccountMonthly(acMonthlyReqObj) as BadRequestObjectResult;

            // Assert
            Assert.Null(badResponse);
        }

        [Fact]
        public void MonitorAccountMonthly_WhenCalledWithSuccess_ReturnsOkResult()
        {
            // Arrange
            var acMonthlyReqItem = new AccountMonthlyRequest()
            {
                BankId = 1,
                AccountId = 1
            };
            // Act
            var okResult = _controller.MonitorAccountMonthly(acMonthlyReqItem) as OkObjectResult;
            // Assert
            var accountData = Assert.IsType<List<AccountMonthly>>(okResult.Value);
            Assert.Equal(2, accountData.Count());
            Assert.Equal(1000, accountData.Where(x=>x.TranType==TransactionType.Out).FirstOrDefault().Total);
            Assert.Equal(500, accountData.Where(x => x.TranType == TransactionType.In).FirstOrDefault().Total);
        }

    }
}
