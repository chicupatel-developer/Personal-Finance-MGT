import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { getBankColor } from "../../../../services/local.service";
const Report_Footer = ({ bank, reportFooter }) => {
  useEffect(() => {}, []);

  const getBankStyle = (bankName) => {
    var bankColor = getBankColor(bankName);
    return { color: bankColor };
  };
  return (
    <div className="reportFooter" style={getBankStyle(bank.bankName)}>
      <div>
        Grand Total In{" "}
        <b>
          +$ {reportFooter.totalIn} / {reportFooter.daysDifference} Days
        </b>
      </div>
      <p></p>
      <div>
        Grand Total Out{" "}
        <b>
          -$ {reportFooter.totalOut} / {reportFooter.daysDifference} Days
        </b>
      </div>
    </div>
  );
};

export default Report_Footer;
