import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalDataService } from '../services/local-data.service';
import ProjectCodingLength from '../models/projectCodingLength';
import FileChart from '../models/fileChart';

@Component({
  selector: 'app-all-project-coding-length',
  templateUrl: './all-project-coding-length.component.html',
  styleUrls: ['./all-project-coding-length.component.css']
})
export class AllProjectCodingLengthComponent implements OnInit {

  listProjectCodingLength : ProjectCodingLength[];

  allProjectsCodingLength : number = 0;

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {
    this.listProjectCodingLength = [];

    this.getAllProjectCodingLength();
  }

  // ok
  getAllProjectCodingLength() {
    this.dataService.getAllProjectCodingLength()
      .subscribe(
        data => {
          // console.log(data);
          this.listProjectCodingLength = data;
          console.log(this.listProjectCodingLength);
          this.doCalculations();
        },
        error => {
          console.log(error);
        });
  }

  // ok
  doCalculations(){
    this.listProjectCodingLength.forEach(project => {
      project.totalLineByProject = 0;

      project.fileCharts.forEach(file => {
        project.totalLineByProject+=file.fileLineCount;
      });
      this.allProjectsCodingLength += project.totalLineByProject;
    });
  }

  // ok
  goBack() {
    this.router.navigate(['/home']);
  }
}
