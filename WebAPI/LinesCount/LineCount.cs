using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace LinesCount
{
    public class LineCount : ILineCount
    {
        // FMS.Test project
        public ProjectCodingLength FMS_Test(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;

            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var d in searchDirsName)
            {
                // Console.WriteLine("search in..." + d);
                var files = from file in Directory.EnumerateFiles(rootDirPath + d, "*.cs", SearchOption.AllDirectories)
                            select new
                            {
                                File = file,
                                Lines = File.ReadLines(file).Count()
                            };

                foreach (var f in files)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{files.Count().ToString()} files found.");
            }

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }
            return projectCodingLength;
        }

        // FMS.API project
        public ProjectCodingLength FMS_API(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;

            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var f in searchDirsName)
            {
                // Console.WriteLine("search only..." + f);
            }

            var files = from file in Directory.EnumerateFiles(rootDirPath + searchDirsName.FirstOrDefault(), "*.cs", SearchOption.AllDirectories)                       
                        select new
                        {
                            File = file,
                            Lines = File.ReadLines(file).Count()                            
                        };

            foreach (var f in files)
            {
                // Console.WriteLine($"{f.File}\t{f.Lines}");

                projectCodingLength.FileCharts.Add(new FileChart()
                {
                     FileName = f.File,
                      FileLineCount = f.Lines
                });
            }            
            // Console.WriteLine($"{files.Count().ToString()} files found.");

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");

                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }
            return projectCodingLength;
        }

        // FMS.Entity.Context project
        public ProjectCodingLength FMS_ENTITY_CONTEXT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;

            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var f in searchDirsName)
            {
                // Console.WriteLine("search only..." + f);
            }

            var files = from file in Directory.EnumerateFiles(rootDirPath + searchDirsName.FirstOrDefault(), "*.cs", SearchOption.AllDirectories)                            
                        select new
                        {
                            File = file,
                            Lines = File.ReadLines(file).Count()
                        };

            foreach (var f in files)
            {
                // Console.WriteLine($"{f.File}\t{f.Lines}");

                projectCodingLength.FileCharts.Add(new FileChart()
                {
                    FileName = f.File,
                    FileLineCount = f.Lines
                });
            }
            // Console.WriteLine($"{files.Count().ToString()} files found.");

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt")) 
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");

                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }
            return projectCodingLength;
        }

        // FMS.Service project
        public ProjectCodingLength FMS_SERVICE(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;
            
            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var d in searchDirsName)
            {
                // Console.WriteLine("search in..." + d);
                var files = from file in Directory.EnumerateFiles(rootDirPath + d, "*.cs", SearchOption.AllDirectories)
                            select new
                            {
                                File = file,
                                Lines = File.ReadLines(file).Count()
                            };

                foreach (var f in files)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{files.Count().ToString()} files found.");
            }

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {                
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }
            return projectCodingLength;
        }

        // LinesCount project
        public ProjectCodingLength LINESCOUNT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;
            
            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var d in searchDirsName)
            {
                // Console.WriteLine("search in..." + d);
                var files = from file in Directory.EnumerateFiles(rootDirPath + d, "*.cs", SearchOption.AllDirectories)
                            select new
                            {
                                File = file,
                                Lines = File.ReadLines(file).Count()
                            };

                foreach (var f in files)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{files.Count().ToString()} files found.");
            }

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }
            return projectCodingLength;
        }

        // LinesReport project
        public ProjectCodingLength LINESREPORT(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;
          
            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }

            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));

            foreach (var d in searchDirsName)
            {
                // Console.WriteLine("search in..." + d);
                var files = from file in Directory.EnumerateFiles(rootDirPath + d, "*.cs", SearchOption.AllDirectories)
                            select new
                            {
                                File = file,
                                Lines = File.ReadLines(file).Count()
                            };

                foreach (var f in files)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{files.Count().ToString()} files found.");
            }

            // from root dir,,, .cs/.txt files only,,, no sub dirs
            if (rootFiles)
            {                
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".cs") || f.EndsWith(".txt"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .cs/.txt files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }           
            return projectCodingLength;
        }

        // NGFMS project
        public ProjectCodingLength NGFMS(string projectName, string rootDirPath, List<string> filterDirsName, bool rootFiles)
        {
            ProjectCodingLength projectCodingLength = new ProjectCodingLength();
            projectCodingLength.FileCharts = new List<FileChart>();

            projectCodingLength.ProjectName = projectName;

            List<string> allDirs = new List<string>(Directory.EnumerateDirectories(rootDirPath));
            List<string> allDirsName = new List<string>();
            foreach (var d in allDirs)
            {
                allDirsName.Add(d.Substring(d.LastIndexOf(Path.DirectorySeparatorChar) + 1));
            }
            var searchDirsName = allDirsName.Where(item => !filterDirsName.Contains(item));
            foreach (var d in searchDirsName)
            {
                // Console.WriteLine("search in..." + d);
                // d = src

                // now search for src\app,,, bypass all others from src\
                
                // Make a reference to a directory.
                DirectoryInfo di = new DirectoryInfo(rootDirPath + d);
                // Get a reference to each directory in that directory.
                DirectoryInfo[] diArr = di.GetDirectories();
                // Display the names of the directories.
                foreach (DirectoryInfo dri in diArr)
                {
                    // Console.WriteLine("***************" + dri.Name);
                    if(dri.Name=="app")
                    {
                        // Console.WriteLine("Now searching..." + dri.Name);
                        // var files_ = from file in Directory.EnumerateFiles(rootDirPath + d, "*.*", SearchOption.AllDirectories)
                        var files_ = from file in Directory.EnumerateFiles(rootDirPath +d+"\\" + dri.Name, "*.*", SearchOption.AllDirectories)
                          .Where(f => f.EndsWith(".ts") || f.EndsWith(".html") || f.EndsWith(".css"))
                                     select new
                                     {
                                         File = file,
                                         Lines = File.ReadLines(file).Count()
                                     };

                        foreach (var f in files_)
                        {
                            // Console.WriteLine($"{f.File}\t{f.Lines}");
                            projectCodingLength.FileCharts.Add(new FileChart()
                            {
                                FileName = f.File,
                                FileLineCount = f.Lines
                            });
                        }
                        // Console.WriteLine($"{files_.Count().ToString()} files found.");
                    }
                    else
                    {
                        // Console.WriteLine("Bypass this area of search..." + dri.Name);
                    }
                }
                // from root dir,,, .ts/.txt/.html/.css files only,,, no sub dirs
                if (rootFiles)
                {
                    // Console.WriteLine("---------------------------------");
                    var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath + d, "*.*")
                                        .Where(f => f.EndsWith(".ts") || f.EndsWith(".txt") || f.EndsWith(".html") || f.EndsWith(".css"))
                                        select new
                                        {
                                            File = file,
                                            Lines = File.ReadLines(file).Count()
                                        };
                    // Console.WriteLine("from root dir,,, .ts/.txt/.html/.css files only,,, no sub dirs,,, ");
                    foreach (var f in onlyRootFiles)
                    {
                        // Console.WriteLine($"{f.File}\t{f.Lines}");
                        projectCodingLength.FileCharts.Add(new FileChart()
                        {
                            FileName = f.File,
                            FileLineCount = f.Lines
                        });
                    }
                    // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
                }
            }

            // from root dir,,, .ts/.txt/.html/.css files only,,, no sub dirs
            if (rootFiles)
            {
                // Console.WriteLine("---------------------------------");
                var onlyRootFiles = from file in Directory.EnumerateFiles(rootDirPath, "*.*")
                                    .Where(f => f.EndsWith(".ts") || f.EndsWith(".txt") || f.EndsWith(".html") || f.EndsWith(".css"))
                                    select new
                                    {
                                        File = file,
                                        Lines = File.ReadLines(file).Count()
                                    };
                // Console.WriteLine("from root dir,,, .ts/.txt/.html/.css files only,,, no sub dirs,,, ");
                foreach (var f in onlyRootFiles)
                {
                    // Console.WriteLine($"{f.File}\t{f.Lines}");
                    projectCodingLength.FileCharts.Add(new FileChart()
                    {
                        FileName = f.File,
                        FileLineCount = f.Lines
                    });
                }
                // Console.WriteLine($"{onlyRootFiles.Count().ToString()} files found.");
            }            
            return projectCodingLength;
        }
    
    
    
    
        public void DirSearch(string sDir)
        {
            Console.WriteLine("searching dir,,," + sDir);
            try
            {
                /*
                string[] files = Directory.GetFiles(sDir, "*.cs", SearchOption.AllDirectories);
                
                Console.WriteLine("searching dir,,," + sDir);
                foreach (var file in files)
                {
                    Console.WriteLine(file +"..."+File.ReadLines(file).Count());
                }
                */

                string myfile = @"C:\Personal_Finance_MGT\pfmgt_log.txt";
                foreach (string d in Directory.GetDirectories(sDir))
                {                   
                    if (!d.Contains("bin") && !d.Contains("obj") && !d.Contains("Migrations") && !d.Contains("Properties"))
                    {
                        foreach (string f in Directory.GetFiles(d))
                        {
                            Console.WriteLine(f + "..." + File.ReadLines(f).Count());
                            using (StreamWriter sw = File.AppendText(myfile))
                            {
                                sw.WriteLine(f + "..." + File.ReadLines(f).Count());                             
                            }
                        }                        
                    }
                    DirSearch(d);
                }
            }
            catch (System.Exception excpt)
            {
                Console.WriteLine(excpt.Message);
            }
        }



    }
}
