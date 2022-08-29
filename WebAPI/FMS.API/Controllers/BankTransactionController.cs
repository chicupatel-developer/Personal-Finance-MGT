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
    public class BankTransactionController : ControllerBase
    {
        private APIResponse _response;
        private readonly IBankTransactionRepository _btranRepo;
        private readonly IPayeeRepository _payeeRepo;

        public BankTransactionController(IBankTransactionRepository btranRepo, IPayeeRepository payeeRepo)
        {
            _btranRepo = btranRepo;
            _payeeRepo = payeeRepo;
        }

        // react ok
        [HttpGet]
        [Route("listOfPayees")]
        public IActionResult ListOfPayees()
        {
            var payees = _payeeRepo.GetAllPayees();
            return Ok(payees);
        }

        [HttpGet]
        [Route("getTransactionStatusTypes")]
        public IActionResult GetTransactionStatusTypes()
        {
            var transactionStatusTypes = _btranRepo.GetTransactionStatusTypes();
            return Ok(transactionStatusTypes);
        }

        // react ok
        [HttpPost]
        [Route("addBankTransaction")]
        public IActionResult AddBankTransaction(BankTransaction bankTransaction)
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
                    _btranRepo.AddBankTransaction(bankTransaction);                    
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Bank-Transaction Added Successfully !";
                    _response.ResponseError = null;
                    return Ok(_response);                 
                }
                else
                {                    
                    return BadRequest(ModelState);
                }
            }
            catch (MinusBankBalance mbb)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = mbb.Message.ToString();
                _response.ResponseError = mbb.Message.ToString();
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error !";
                _response.ResponseError = ex.Message.ToString();
                return Ok(_response);
            }
        }

        // react ok
        [HttpPost]
        [Route("getAccountStatementAll")]
        public IActionResult GetAccountStatementAll(AccountVM accountVM)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // accountVM = null;
                if (accountVM == null)
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
                    return Ok(_btranRepo.GetAccountStatementAll(accountVM));
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }   
            catch(AccountNotFound noAcc)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = noAcc.Message.ToString();
                _response.ResponseError = noAcc.Message.ToString();
                return Ok(_response);
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
        [HttpPost]
        [Route("getBankStatement")]
        public IActionResult GetBankStatement(Bank bank)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // bank = null;
                if (bank == null)
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
                    return Ok(_btranRepo.GetBankStatement(bank));
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (AccountNotFound noAcc)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = noAcc.Message.ToString();
                _response.ResponseError = noAcc.Message.ToString();
                return Ok(_response);
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
