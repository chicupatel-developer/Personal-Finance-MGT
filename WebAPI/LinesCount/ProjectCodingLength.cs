using System;
using System.Collections.Generic;
using System.Text;

namespace LinesCount
{
    public class ProjectCodingLength
    {
        public string ProjectName { get; set; }
        public List<FileChart> FileCharts { get; set; }
    }
    public class FileChart
    {
        public string FileName { get; set; }
        public int FileLineCount { get; set; }
    }
}
