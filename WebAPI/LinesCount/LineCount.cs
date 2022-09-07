using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace LinesCount
{
    public class LineCount : ILineCount
    {
        public List<string> GetDirs(string sDir)
        {
            // Directory.GetDirectories(rootPath, "*", SearchOption.AllDirectories);
            List<string> dirs = new List<string>(Directory.GetDirectories(sDir, "*", SearchOption.AllDirectories));

            return dirs;
        }
        public ProjectCodingLength WebAPI_Report(List<string> dirs, string projectName)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;


            string myfile = @"C:\Personal_Finance_MGT\webapi_log.txt";            
            foreach (var dir in dirs)
            {
                if (!dir.Contains("bin") && !dir.Contains("obj") && !dir.Contains("Migrations") && !dir.Contains("Properties") && !dir.Contains(".vs"))
                {
                    Console.WriteLine("searching ..." + dir);

                    var dirFiles = from file in Directory.EnumerateFiles(dir, "*.*")
                                  .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt") || f.EndsWith(".json"))
                                   select new
                                   {
                                       File = file,
                                       Lines = File.ReadLines(file).Count()
                                   };

                    List<FileChart> files = new List<FileChart>();
                    foreach (var f in dirFiles)
                    {

                        projectCodingLength.FileCharts.Add(new FileChart()
                        {
                            FileName = f.File,
                            FileLineCount = f.Lines
                        });
                     
                        // Console.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());

                        using (StreamWriter sw = File.AppendText(myfile))
                        {
                            sw.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());
                        }
                    }
                }
            }
            return projectCodingLength;
        }
        public ProjectCodingLength React_Report(List<string> dirs, string projectName)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;


            string myfile = @"C:\Personal_Finance_MGT\react_log.txt";
            foreach (var dir in dirs)
            {
                if (!dir.Contains("public") && !dir.Contains("node_modules"))
                {
                    Console.WriteLine("searching ..." + dir);

                    var dirFiles = from file in Directory.EnumerateFiles(dir, "*.*")
                                   .Where(f => (f.EndsWith(".js") || f.EndsWith(".jsx") || f.EndsWith(".css")) && (!(f.Contains("setupTests") || f.Contains("App.test") || f.Contains("reportWebVitals"))))
                                   select new
                                   {
                                       File = file,
                                       Lines = File.ReadLines(file).Count()
                                   };

                    List<FileChart> files = new List<FileChart>();
                    foreach (var f in dirFiles)
                    {

                        projectCodingLength.FileCharts.Add(new FileChart()
                        {
                            FileName = f.File,
                            FileLineCount = f.Lines
                        });

                        // Console.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());

                        using (StreamWriter sw = File.AppendText(myfile))
                        {
                            sw.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());
                        }
                    }
                }
            }
            return projectCodingLength;
        }
        public ProjectCodingLength Angular_Report(List<string> dirs, string projectName)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;


            string myfile = @"C:\Personal_Finance_MGT\angular_log.txt";
            foreach (var dir in dirs)
            {
                if (!dir.Contains("e2e") && !dir.Contains("node_modules") && !dir.Contains("environments") && !dir.Contains("assets"))
                {
                    Console.WriteLine("searching ..." + dir);

                    var dirFiles = from file in Directory.EnumerateFiles(dir, "*.*")
                                  .Where(f => (f.EndsWith(".ts") || f.EndsWith(".html") || f.EndsWith(".css")) && (!(f.Contains(".spec") || f.Contains("test") || f.Contains("polyfills"))))
                                   select new
                                   {
                                       File = file,
                                       Lines = File.ReadLines(file).Count()
                                   };

                    List<FileChart> files = new List<FileChart>();
                    foreach (var f in dirFiles)
                    {

                        projectCodingLength.FileCharts.Add(new FileChart()
                        {
                            FileName = f.File,
                            FileLineCount = f.Lines
                        });

                        // Console.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());

                        using (StreamWriter sw = File.AppendText(myfile))
                        {
                            sw.WriteLine(f.File + "..." + File.ReadLines(f.File).Count());
                        }
                    }
                }
            }
            return projectCodingLength;
        }
    }
}
