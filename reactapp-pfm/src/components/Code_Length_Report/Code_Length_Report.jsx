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
  const getCodingLengthReport = () => {
    CodingLengthService.getAllProjectCodingLength()
      .then((response) => {
        console.log(response.data);
        setCodingLengthReport(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
