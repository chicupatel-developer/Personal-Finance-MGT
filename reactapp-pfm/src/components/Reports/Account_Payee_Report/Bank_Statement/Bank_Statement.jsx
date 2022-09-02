import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";
import Report_Footer from "../Report_Footer/Report_Footer";

import {
  getDaysDifference,
  getAccountType,
  getAccountColor,
  getMaxDate,
  getMinDate,
  getMyTransactions,
  getMyFilterTransactions,
} from "../../../../services/local.service";

const Bank_Statement = ({
  bank,
  bankAccounts,
  payee,
  filterOnDates,
  startDate,
  endDate,
}) => {
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
    var maxDate = null;
    var minDate = null;
    var daysDifference = 0;

    // filter transactions
    if (payee !== "0") {
      var filterTransactions = [];
      filterTransactions = getMyFilterTransactions(bankAccounts, payee);
      filterTransactions.map((tr) => {
        if (tr.transactionType === 0) totalIn += tr.amountPaid;
        else if (tr.transactionType === 1) totalOut += tr.amountPaid;
      });

      if (filterTransactions.length < 1) {
        daysDifference = 0;
      } else {
        maxDate = getMaxDate(filterTransactions);
        minDate = getMinDate(filterTransactions);
        daysDifference = getDaysDifference(minDate, maxDate);
      }
    }
    // all transactions
    else {
      var allTransactions = [];
      console.log("all transactions");
      bankAccounts.map((ba) => {
        console.log(ba);
        ba.transactions.map((tr) => {
          console.log(tr);
          if (tr.transactionType === 0) totalIn += tr.amountPaid;
          else if (tr.transactionType === 1) totalOut += tr.amountPaid;
        });
      });

      allTransactions = getMyTransactions(bankAccounts);
      if (allTransactions.length < 1) {
        daysDifference = 0;
      } else {
        maxDate = getMaxDate(allTransactions);
        minDate = getMinDate(allTransactions);
        daysDifference = getDaysDifference(minDate, maxDate);
      }
    }

    setReportFooterObj({
      totalIn: totalIn,
      totalOut: totalOut,
      daysDifference: daysDifference,
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
