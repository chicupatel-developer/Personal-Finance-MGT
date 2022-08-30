import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";

import {
  getAccountType,
  getAccountColor,
} from "../../../../services/local.service";

const Bank_Statement = ({ bankAccounts }) => {
  useEffect(() => {
    console.log("child component : ", bankAccounts);
  }, [bankAccounts]);

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
            <Transactions myTransactions={dt.transactions} textColor={getAccountColor(dt.accountType)} />
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {bankAccounts && bankAccounts.length > 0 && (
        <div>{renderAccountList()}</div>
      )}
    </div>
  );
};

export default Bank_Statement;
