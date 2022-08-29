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
    public class PayeeController : ControllerBase
    {
        private APIResponse _response;
        private readonly IPayeeRepository _payeeRepo;

        public PayeeController(IPayeeRepository payeeRepo)
        {
            _payeeRepo = payeeRepo;
        }

        // react ok
        [HttpGet]
        [Route("allPayeeTypes")]
        public IActionResult GetAllPayeeTypes()
        {
            var allPayeeTypes = _payeeRepo.GetAllPayeeTypes();
            return Ok(allPayeeTypes);
        }

        // react ok
        [HttpGet]
        [Route("allPayees")]
        public IActionResult GetAllPayees()
        {
            var allPayees = _payeeRepo.GetAllPayees();
            return Ok(allPayees);
        }

        // react ok
        [HttpPost]
        [Route("addPayee")]
        public IActionResult AddPayee(Payee payee)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // payee = null;
                if (payee == null)
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
                    _payeeRepo.AddPayee(payee);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Payee Added Successfully !";
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

        // react ok
        [HttpGet]
        [Route("allPayeesCC")]
        public IActionResult GetAllPayeesCC()
        {
            var allPayees = _payeeRepo.GetAllPayeesCC();
            return Ok(allPayees);
        }

        // react ok
        // edit payee
        [HttpGet]
        [Route("getPayee/{selectedPayeeId}")]
        public IActionResult GetPayee(int selectedPayeeId)
        {
            try
            {
                // check for exception
                // throw new Exception();

                var payee = _payeeRepo.GetPayee(selectedPayeeId);
                // check for null
                // payee = null;              

                if (payee == null)
                {
                    return BadRequest("Payee Not Found @ Server Side!");
                }
                else
                {
                    return Ok(payee);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Server Error!");
            }
        }

        // react ok
        // edit payee in action
        [HttpPost]
        [Route("editPayee")]
        public IActionResult EditPayee(Payee payee)
        {
            _response = new APIResponse();
            try
            {
                // check for null
                // payee = null;
                if (payee == null)
                {
                    return BadRequest();
                }

                // check for exception
                // throw new Exception();

                // check for ModelState
                // ModelState.AddModelError("PayeeId", "Payee is Required!");
                // ModelState.AddModelError("error", "Another ModelState Check!");
                // ModelState.AddModelError("error", "One More Another ModelState Check!");
                if (ModelState.IsValid)
                {
                    Payee editedPayee = _payeeRepo.EditPayee(payee);
                    // check null output from service
                    // editedPayee = null;

                    if (editedPayee == null)
                    {
                        // payee not found
                        // data mis-match either at client or server side
                        _response.ResponseCode = -1;
                        _response.ResponseMessage = "Payee Not Found @ Server Side!";
                        _response.ResponseError = "Payee Not Found @ Server Side!";
                    }
                    else
                    {
                        // success
                        _response.ResponseCode = 0;
                        _response.ResponseMessage = "Payee Edited Successfully!";
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

    }
}
