import React, { useState, useEffect } from "react";
import "./style.css";
import CodingLengthService from "../../services/coding.length.service";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

const Code_Length_Report = () => {
  let navigate = useNavigate();

  const [codingLengthReport, setCodingLengthReport] = useState([]);

  useEffect(() => {
    getCodingLengthReport();
  }, []);

  const updateState = (data) => {
    const newState = data.map((obj) => {
      var total = 0;
      obj.fileCharts.map((fileData, index) => {
        total += Number(fileData.fileLineCount);
      });
      return { ...obj, totalCodingByProject: total };
    });
    setCodingLengthReport(newState);
  };

  const getCodingLengthReport = () => {
    CodingLengthService.getAllProjectCodingLength()
      .then((response) => {
        console.log(response.data);
        setCodingLengthReport(response.data);

        var codingReportData = [...response.data];
        updateState(codingReportData);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const displayTotalCodingForProject = (totalCodingByProject) => {
    return (
      <div className="row">
        <div className="col-md-8 mx-auto"></div>
        <div className="col-md-3 mx-auto projectFooter">
          Total Line of Coding # {totalCodingByProject}
        </div>
        <div className="col-md-1 mx-auto"></div>
      </div>
    );
  };

  const displayProjectDetails = (reportData) => {
    return reportData.map((dt, i) => {
      return (
        <div value={i} key={i}>
          <div className="row">
            <div className="col-md-2 mx-auto">
              <h3>{dt.projectName}</h3>
            </div>
            <div className="col-md-10 mx-auto">
              {displayFileDetails(dt.fileCharts)}
            </div>
            <p></p>
            {displayTotalCodingForProject(dt.totalCodingByProject)}
            <p></p>
            <hr />
          </div>
        </div>
      );
    });
  };

  const displayFileDetails = (fileCharts) => {
    return fileCharts.map((dt, i) => {
      return (
        <div value={i} key={i}>
          <div className="row">
            <div className="col-md-10 mx-auto">{dt.fileName}</div>
            <div className="col-md-2 mx-auto">{dt.fileLineCount}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="mainHeader">Coding Report</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto">
          <div className="projectHeader">
            Total Coding By Lines of All Projects #{" "}
            {codingLengthReport.reduce(
              (total, item) => total + item.totalCodingByProject,
              0
            )}
          </div>
          <div className="row">
            <div className="col-md-2 mx-auto">
              <h3>Project</h3>
            </div>
            <div className="col-md-10 mx-auto">
              <h3>Files-Coding-Length</h3>
            </div>
          </div>
          <hr />

          <div>{displayProjectDetails(codingLengthReport)}</div>
        </div>
      </div>
    </div>
  );
};

export default Code_Length_Report;
