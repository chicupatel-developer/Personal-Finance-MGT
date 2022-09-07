import React, { useState, useEffect } from "react";
import "./style.css";
import CodingLengthService from "../../services/coding.length.service";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

const Code_Length_Report = () => {
  let navigate = useNavigate();

  const [codeingLengthReport, setCodeingLengthReport] = useState([]);

  useEffect(() => {
    getCodingLengthReport();
  }, []);
  const getCodingLengthReport = () => {
    CodingLengthService.getAllProjectCodingLength()
      .then((response) => {
        console.log(response.data);
        setCodeingLengthReport(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container">
      <div className="mainHeader">Coding Report</div>
      <hr />
      <div className="row">
        <div className="col-md-2 mx-auto"></div>
        <div className="col-md-8 mx-auto"></div>
        <div className="col-md-2 mx-auto"></div>
      </div>
    </div>
  );
};

export default Code_Length_Report;
