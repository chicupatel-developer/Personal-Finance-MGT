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
                // Test Project
                string projectName = "FMS.Test";
                string FMS_Test_path = @"C:\FMSapi\apiFMS\FMS.Test\";
                List<string> FMS_Test_filterDirsName = new List<string>()
                {
                    "obj","Properties","bin"
                };
                listProjectCodingLength.Add(_lineCount.FMS_Test(projectName, FMS_Test_path, FMS_Test_filterDirsName, true));


                projectName = "FMS.API";
                string FMS_API_path = @"C:\FMSapi\apiFMS\FMS.API\";
                List<string> FMS_API_filterDirsName = new List<string>()
                {
                    "obj","Properties","bin"
                };
                listProjectCodingLength.Add(_lineCount.FMS_API(projectName, FMS_API_path, FMS_API_filterDirsName, true));


                projectName = " FMS.ENTITY.CONTEXT";
                string FMS_ENTITY_CONTEXT_path = @"C:\FMSapi\apiFMS\FMS.ENTITY.CONTEXT\";
                List<string> FMS_ENTITY_CONTEXT_filterDirsName = new List<string>()
                {
                    "obj","Migrations","bin"
                };
                listProjectCodingLength.Add(_lineCount.FMS_ENTITY_CONTEXT(projectName, FMS_ENTITY_CONTEXT_path, FMS_ENTITY_CONTEXT_filterDirsName, true));


                projectName = "FMS.SERVICE";
                string FMS_SERVICE_path = @"C:\FMSapi\apiFMS\FMS.SERVICE\";
                List<string> FMS_SERVICE_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(_lineCount.FMS_SERVICE(projectName, FMS_SERVICE_path, FMS_SERVICE_filterDirsName, true));


                projectName = "LINESCOUNT";
                string LINESCOUNT_path = @"C:\FMSapi\apiFMS\LINESCOUNT\";
                List<string> LINESCOUNT_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(_lineCount.LINESCOUNT(projectName, LINESCOUNT_path, LINESCOUNT_filterDirsName, true));


                projectName = "LINESREPORT";
                string LINESREPORT_path = @"C:\FMSapi\apiFMS\LINESREPORT\";
                List<string> LINESREPORT_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(_lineCount.LINESREPORT(projectName, LINESREPORT_path, LINESREPORT_filterDirsName, true));


                projectName = "NGFMS";
                string NGFMS_path = @"C:\FMSng\ngFMS\";
                List<string> NGFMS_filterDirsName = new List<string>()
                {
                    "node_modules","e2e"
                };
                listProjectCodingLength.Add(_lineCount.NGFMS(projectName, NGFMS_path, NGFMS_filterDirsName, true));

                return Ok(listProjectCodingLength);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }     
        }

    }
}
