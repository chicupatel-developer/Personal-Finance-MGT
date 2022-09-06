using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using LinesCount;

namespace LinesReport
{
    class Program
    {
        static void Main(string[] args)
        {
            LineCount lineCount = new LineCount();
            List<ProjectCodingLength> listProjectCodingLength = new List<ProjectCodingLength>();
            
            try
            {

                Console.WriteLine("searching,,,");

                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\FMS.Service");
                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\FMS.Test");
                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\FMS.Entity.Context");
                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\FMS.API");
                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\LinesCount");
                // lineCount.DirSearch("C:\\Personal_Finance_MGT\\WebAPI\\LinesReport");
                
                lineCount.WebAPI_DirFileCount("C:\\Personal_Finance_MGT\\WebAPI");
                // lineCount.React_DirFileCount("C:\\Personal_Finance_MGT\\reactapp-pfm");
                // lineCount.NG_DirFileCount("C:\\Personal_Finance_MGT\\Angular");






                /*
                string projectName = "FMS.API";
                string FMS_API_path = @"C:\FMSapi\apiFMS\FMS.API\";             
                List<string> FMS_API_filterDirsName = new List<string>()
                {
                    "obj","Properties","bin"
                };
                listProjectCodingLength.Add(lineCount.FMS_API(projectName, FMS_API_path, FMS_API_filterDirsName, true));

                projectName = " FMS.ENTITY.CONTEXT";
                string FMS_ENTITY_CONTEXT_path = @"C:\FMSapi\apiFMS\FMS.ENTITY.CONTEXT\";
                List<string> FMS_ENTITY_CONTEXT_filterDirsName = new List<string>()
                {
                    "obj","Migrations","bin"
                };
                listProjectCodingLength.Add(lineCount.FMS_ENTITY_CONTEXT(projectName, FMS_ENTITY_CONTEXT_path, FMS_ENTITY_CONTEXT_filterDirsName, true));

                projectName = "FMS.SERVICE";
                string FMS_SERVICE_path = @"C:\FMSapi\apiFMS\FMS.SERVICE\";
                List<string> FMS_SERVICE_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(lineCount.FMS_SERVICE(projectName, FMS_SERVICE_path, FMS_SERVICE_filterDirsName, true));

                projectName = "LINESCOUNT";
                string LINESCOUNT_path = @"C:\FMSapi\apiFMS\LINESCOUNT\";
                List<string> LINESCOUNT_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(lineCount.LINESCOUNT(projectName, LINESCOUNT_path, LINESCOUNT_filterDirsName, true));

                projectName = "LINESREPORT";
                string LINESREPORT_path = @"C:\FMSapi\apiFMS\LINESREPORT\";
                List<string> LINESREPORT_filterDirsName = new List<string>()
                {
                    "obj","bin"
                };
                listProjectCodingLength.Add(lineCount.LINESREPORT(projectName, LINESREPORT_path, LINESREPORT_filterDirsName, true));

                projectName = "NGFMS";
                string NGFMS_path = @"C:\FMSng\ngFMS\";
                List<string> NGFMS_filterDirsName = new List<string>()
                {
                    "node_modules","e2e"
                };
                listProjectCodingLength.Add(lineCount.NGFMS(projectName, NGFMS_path, NGFMS_filterDirsName, true));

                // testing
                foreach(var projectCodingLength in listProjectCodingLength)
                {
                    Console.WriteLine("#########"+projectCodingLength.ProjectName+ "#########");
                    foreach(var fileChart in projectCodingLength.FileCharts)
                    {
                        Console.WriteLine(fileChart.FileName + " : " + fileChart.FileLineCount);
                    }
                    Console.WriteLine("---------"+ projectCodingLength.ProjectName + "---------");
                }    
                */
            }
            catch (UnauthorizedAccessException uAEx)
            {
                Console.WriteLine(uAEx.Message);
            }
            catch (PathTooLongException pathEx)
            {
                Console.WriteLine(pathEx.Message);
            }
        }
    }
}
