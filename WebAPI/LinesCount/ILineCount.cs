using System;
using System.Collections.Generic;
using System.Text;

namespace LinesCount
{
    public interface ILineCount
    {
        ProjectCodingLength FMS_Test(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength FMS_API(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength FMS_ENTITY_CONTEXT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength FMS_SERVICE(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength LINESCOUNT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength LINESREPORT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);
        ProjectCodingLength NGFMS(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles);


        ProjectCodingLength GetCodingLength(string projectName, string sDir);
        void WebAPI_DirFileCount(string sDir);
        void WebAPI_DirFileCount_(string sDir);
        void React_DirFileCount(string sDir);
        void NG_DirFileCount(string sDir);

    }
}
