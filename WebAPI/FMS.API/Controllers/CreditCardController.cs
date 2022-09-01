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
    public class CreditCardController : ControllerBase
    {
        private APIResponse _response;
        private readonly ICreditcardRepository _ccRepo;

        public CreditCardController(ICreditcardRepository ccRepo)
        {
            _ccRepo = ccRepo;
        }

        // react ok
        [HttpGet]
        [Route("allCCs")]
        public IActionResult GetAllCCs()
        {
            var allCCs = _ccRepo.GetAllCCs();
            return Ok(allCCs);
        }

        // react wip
        [HttpPost]
        [Route("getCCStatementAll")]
        public IActionResult GetCreditCardStatementAll(CreditCard cc)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // cc = null;
                if (cc == null)
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
                    return Ok(_ccRepo.GetCreditCardStatementAll(cc));
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (CreditCardNotFound noCc)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = noCc.Message.ToString();
                _response.ResponseError = noCc.Message.ToString();
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
        [Route("addCCTransaction")]
        public IActionResult AddCCTransaction(CreditCardTransaction ccTransaction)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // ccTransaction = null;
                if (ccTransaction == null)
                {
                    return BadRequest();
                }

                // check for exception
                // throw new Exception();

                // check for ModelState
                // ModelState.AddModelError("CreditCardId", "CreditCardId is Required!");
                // ModelState.AddModelError("error", "Another ModelState Check!");
                // ModelState.AddModelError("error", "One More Another ModelState Check!");

                if (ModelState.IsValid)
                {
                    _ccRepo.AddCCTransaction(ccTransaction);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Credit-Card-Transaction Added Successfully !";
                    _response.ResponseError = null;
                    return Ok(_response);
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (CreditCardNotFound ccnf)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Unknown Payee Or CreditCard !";
                _response.ResponseError = ccnf.Message.ToString();
                return Ok(_response);
            }
            catch (MinusCCBalance mccb)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = mccb.Message.ToString();
                _response.ResponseError = mccb.Message.ToString();
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
