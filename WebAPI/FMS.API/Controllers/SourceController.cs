using FMS.Entity.Context.Models;
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
    public class SourceController : ControllerBase
    {
        private APIResponse _response;
        private readonly ISourceRepository _sourceRepo;

        public SourceController(ISourceRepository sourceRepo)
        {
            _sourceRepo = sourceRepo;
        }

        // react ok
        [HttpGet]
        [Route("allSources")]
        public IActionResult GetAllSources()
        {
            var allSources = _sourceRepo.GetAllSources();
            return Ok(allSources);
        }

        // react ok
        [HttpPost]
        [Route("bankInputFromSource")]
        public IActionResult BankInputFromSource(BankTransaction bankTransaction)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // bankTransaction = null;
                if (bankTransaction == null)
                {
                    return BadRequest();
                }

                // check for exception
                // throw new Exception();

                // check for ModelState
                // ModelState.AddModelError("error", "ModelState Check!");
                // ModelState.AddModelError("error", "Another ModelState Check!");
                // ModelState.AddModelError("error", "One More Another ModelState Check!");

                if (ModelState.IsValid)
                {
                    _sourceRepo.BankInputFromSource(bankTransaction);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Source To Bank Transaction Added Successfully !";
                    _response.ResponseError = null;
                    return Ok(_response);
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }        
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error !";
                _response.ResponseError = ex.Message.ToString();
                return Ok(_response);
            }
        }

    }
}
