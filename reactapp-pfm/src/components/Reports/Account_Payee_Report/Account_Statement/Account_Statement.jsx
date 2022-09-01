import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";

import {
  getDaysDifference,
  getAccountType,
  getAccountColor,
  getMaxDate,
  getMinDate,
  getMyTransactions,
  getMyFilterTransactions,
} from "../../../../services/local.service";

const Account_Statement = ({ account, payee }) => {
  useEffect(() => {
    console.log("child component : ", account);
  }, [account]);

  const getAccountStyle = (acType) => {
    var acColor = getAccountColor(acType);
    return { color: acColor };
  };
  const renderAccountDetails = () => {
    return (
      <div>
        <div className="accountHeader">
          <h3 style={getAccountStyle(account.accountType)}>
            [{getAccountType(account.accountType)}] # {account.accountNumber}
          </h3>
          <h4>
            Last Balance <b>${account.lastBalance}</b>
          </h4>
        </div>
        <div>
          <Transactions
            myTransactions={account.transactions}
            textColor={getAccountColor(account.accountType)}
            payee={payee}
          />
        </div>
      </div>
    );
  };

  return <div>{account && <div>{renderAccountDetails()}</div>}</div>;
};

export default Account_Statement;
