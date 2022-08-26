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
    public class AccountController : ControllerBase
    {
        private APIResponse _response;
        private readonly IAccountRepository _acRepo;

        public AccountController(IAccountRepository acRepo)
        {
            _acRepo = acRepo;
        }

        // react ok
        [HttpGet]
        [Route("allAccountTypes")]
        public IActionResult GetAllAccountTypes()
        {
            var allAccountTypes = _acRepo.GetAllAccountTypes();
            return Ok(allAccountTypes);
        }

        // react ok
        [HttpGet]
        [Route("allAccounts")]
        public IActionResult GetAllAccounts()
        {
            var allAccounts = _acRepo.GetAllAccounts();
            return Ok(allAccounts);
        }

        // react ok
        [HttpPost]
        [Route("addAccount")]
        public IActionResult AddAccount(Account account)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // account = null;
                if (account == null)
                {
                    return BadRequest("Account Object is Null");
                }

                // check for exception
                // throw new Exception();

                // check for ModelState
                // ModelState.AddModelError("AccountNumber", "ModelState Check!");
                // ModelState.AddModelError("error", "Another ModelState Check!");
                // ModelState.AddModelError("error", "One More Another ModelState Check!");
                              
                if (ModelState.IsValid)
                {
                    _acRepo.AddAccount(account);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Account Added Successfully !";
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

        // react wip
        // edit account
        [HttpGet]
        [Route("getAccount/{selectedAcId}")]
        public IActionResult GetAccount(int selectedAcId)
        {
            try
            {
                var account = _acRepo.GetAccount(selectedAcId);
                // check for null
                // account = null;

                // check for exception
                // throw new Exception();

                if (account == null)
                {
                    return BadRequest();
                }
                else
                {
                    return Ok(account);
                }
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // react wip
        // edit account in action
        [HttpPost]
        [Route("editAccount")]
        public IActionResult EditAccount(Account account)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // account = null;
                if (account == null)
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
                    Account editedAccount = _acRepo.EditAccount(account);
                    // check null output from service
                    // editedAccount = null;

                    if (editedAccount == null)
                    {
                        // account not found
                        // data mis-match either at client or server side
                        _response.ResponseCode = -1;
                        _response.ResponseMessage = "Account Not Found @ Server Side!";
                        _response.ResponseError = "Account Not Found @ Server Side!";
                    }
                    else
                    {
                        // success
                        _response.ResponseCode = 0;
                        _response.ResponseMessage = "Account Edited Successfully!";
                        _response.ResponseError = null;
                    }
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
            }
            return Ok(_response);
        }

        // react ok
        [HttpGet]
        [Route("getBankAccounts/{bankId}")]
        public IActionResult GetBankAccounts(int bankId)
        {
            var bankAccounts = _acRepo.GetBankAccounts(bankId);
            return Ok(bankAccounts);
        }
    }
}
