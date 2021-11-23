using FMS.Entity.Context.Models;
using FMS.Service.CustomException;
using FMS.Service.DTOs;
using FMS.Service.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntityMonitorController : ControllerBase
    {        
        private readonly IEntityMonitorRepository _eMonitorRepo;

        public EntityMonitorController(IEntityMonitorRepository eMonitorRepo)
        {
            _eMonitorRepo = eMonitorRepo;
        }

        [HttpPost]
        [Route("monitorAccountMonthly")]
        public IActionResult MonitorAccountMonthly(AccountMonthlyRequest accountMonthlyRequest)
        {
            try
            {
                if (accountMonthlyRequest == null)
                {
                    return BadRequest();
                }
                if (ModelState.IsValid)
                {
                    var accountData = _eMonitorRepo.MonitorAccountMonthly(accountMonthlyRequest);
                    return Ok(accountData);
                }
                else
                {
                    return BadRequest(ModelState);
                }             
            }   
            catch(AccountNotFound acnf)
            {
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
