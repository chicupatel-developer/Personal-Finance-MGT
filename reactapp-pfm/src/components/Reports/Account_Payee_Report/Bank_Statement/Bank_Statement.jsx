import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";

import {
  getAccountType,
  getAccountColor,
} from "../../../../services/local.service";

const Bank_Statement = ({ bankAccounts, payee }) => {
  const [totalInGrand, setTotalInGrand] = useState(0);
  const [totalOutGrand, setTotalOutGrand] = useState(0);
  const [daysDiffGrand, setDaysDiffGrand] = useState(0);

  useEffect(() => {
    console.log("child component : ", bankAccounts);

    getGrandTotalInOut();
  }, [bankAccounts]);

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

    setTotalInGrand(totalIn);
    setTotalOutGrand(totalOut);
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
              totalInGrand={totalInGrand}
              totalOutGrand={totalOutGrand}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {bankAccounts && bankAccounts.length > 0 ? (
        <div>{renderAccountList()}</div>
      ) : (
        <div className="noAccounts">No Accounts!</div>
      )}
    </div>
  );
};

export default Bank_Statement;
