import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";
import Report_Footer from "../Report_Footer/Report_Footer";

import {
  getAccountType,
  getAccountColor,
} from "../../../../services/local.service";

const Bank_Statement = ({ bank, bankAccounts, payee }) => {
  const [reportFooterObj, setReportFooterObj] = useState({});

  useEffect(() => {
    console.log("child component : ", bankAccounts);

    getGrandTotalInOut();
  }, [bankAccounts]);

  // report-footer
  // grand total in-out
  const getGrandTotalInOut = () => {
    var totalIn = 0;
    var totalOut = 0;
    // filter trasactions
    if (payee !== "0") {
      bankAccounts.map((ba) => {
        console.log(ba);
        ba.transactions.filter((tr) => {
          console.log(tr);
        });
      });
    }
    // all transactions
    else {
      console.log("all transactions");
      bankAccounts.map((ba) => {
        console.log(ba);
        ba.transactions.filter((tr) => {
          console.log(tr);
          if (tr.transactionType === 0) totalIn += tr.amountPaid;
          else if (tr.transactionType === 1) totalOut += tr.amountPaid;
        });
      });
    }

    setReportFooterObj({
      totalIn: totalIn,
      totalOut: totalOut,
    });
  };

  const getAccountStyle = (acType) => {
    var acColor = getAccountColor(acType);
    return { color: acColor };
  };
  const renderAccountList = () => {
    return bankAccounts.map((dt, i) => {
      return (
        <div key={i}>
          <div className="accountHeader">
            <h3 style={getAccountStyle(dt.accountType)}>
              [{getAccountType(dt.accountType)}] # {dt.accountNumber}
            </h3>
            <h4>
              Last Balance <b>${dt.lastBalance}</b>
            </h4>
          </div>
          <div>
            <Transactions
              myTransactions={dt.transactions}
              textColor={getAccountColor(dt.accountType)}
              payee={payee}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {bankAccounts && bankAccounts.length > 0 ? (
        <div>
          {renderAccountList()}
          <p></p>
          <hr />
          <p></p>
          <div>
            <Report_Footer bank={bank} reportFooter={reportFooterObj} />
          </div>
        </div>
      ) : (
        <div className="noAccounts">No Accounts!</div>
      )}
    </div>
  );
};

export default Bank_Statement;
