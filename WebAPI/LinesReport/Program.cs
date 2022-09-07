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
                List<string> dirs = lineCount.GetDirs("C:\\Personal_Finance_MGT\\WebAPI");
                var reportData = lineCount.WebAPI_Report(dirs, "WebAPI");
                foreach(var report in reportData.FileCharts)
                {
                    Console.WriteLine(report.FileName + "..." + report.FileLineCount);
                }
                dirs = lineCount.GetDirs("C:\\Personal_Finance_MGT\\reactapp-pfm");
                reportData = lineCount.React_Report(dirs, "React");
                foreach (var report in reportData.FileCharts)
                {
                    Console.WriteLine(report.FileName + "..." + report.FileLineCount);
                }
                dirs = lineCount.GetDirs("C:\\Personal_Finance_MGT\\Angular");
                reportData = lineCount.Angular_Report(dirs, "Angular");
                foreach (var report in reportData.FileCharts)
                {
                    Console.WriteLine(report.FileName + "..." + report.FileLineCount);
                }
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
