using System;
using System.Collections.Generic;
using System.Text;

namespace LinesCount
{
    public interface ILineCount
    {
        List<string> GetDirs(string sDir);
        ProjectCodingLength WebAPI_Report(List<string> dirs, string projectName);
        ProjectCodingLength React_Report(List<string> dirs, string projectName);
        ProjectCodingLength Angular_Report(List<string> dirs, string projectName);
        
    }
}
