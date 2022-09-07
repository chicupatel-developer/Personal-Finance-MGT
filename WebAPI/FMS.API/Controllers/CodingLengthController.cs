using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinesCount;

namespace FMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodingLengthController : ControllerBase
    {
        private readonly ILineCount _lineCount;
       
        public CodingLengthController(ILineCount lineCount)
        {
            _lineCount = lineCount;
        }

        [HttpGet]
        [Route("getAllProjectCodingLength")]
        public IActionResult GetAllProjectCodingLength()
        {
            List<ProjectCodingLength> listProjectCodingLength = new List<ProjectCodingLength>();
            try
            {
                List<string> dirs = _lineCount.GetDirs("C:\\Personal_Finance_MGT\\WebAPI");
                listProjectCodingLength.Add(_lineCount.WebAPI_Report(dirs, "WebAPI"));

                dirs = _lineCount.GetDirs("C:\\Personal_Finance_MGT\\reactapp-pfm");
                listProjectCodingLength.Add(_lineCount.React_Report(dirs, "React"));

                dirs = _lineCount.GetDirs("C:\\Personal_Finance_MGT\\Angular");
                listProjectCodingLength.Add(_lineCount.Angular_Report(dirs, "Angular"));

                return Ok(listProjectCodingLength);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }     
        }

    }
}
