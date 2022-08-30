import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import { useNavigate } from "react-router-dom";

import Moment from "moment";

import Transactions from "../Transactions/Transactions";

import { getAccountType } from "../../../../services/local.service";

const Bank_Statement = ({ bankAccounts }) => {
  useEffect(() => {
    console.log("child component : ", bankAccounts);
  }, [bankAccounts]);

  const renderAccountList = () => {
    return bankAccounts.map((dt, i) => {
      return (
        <div key={i}>
          <div className="accountHeader">
            <h3>
              [{getAccountType(dt.accountType)}] # {dt.accountNumber}
            </h3>
            <h4>
              Last Balance <b>${dt.lastBalance}</b>
            </h4>
          </div>
          {dt.transactions && dt.transactions.length > 0 && (
            <div>
              <Transactions myTransactions={dt.transactions} />
            </div>
          )}
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
