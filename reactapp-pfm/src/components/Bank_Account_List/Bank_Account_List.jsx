import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import BankService from "../../services/bank.service";
import AccountService from "../../services/account.service";

import { useNavigate } from "react-router";

import Moment from "moment";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Bank_Account_List = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankName, setBankName] = useState("");

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const getBankAccounts = (id) => {
    console.log("getting accounts for bank : ", id);
    if (checkForNumbersOnly(id)) {
      AccountService.getBankAccounts(id)
        .then((response) => {
          setBankAccounts(response.data.accounts);
          setBankName(response.data.bankName);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getBankAccounts(id);
  }, []);

  const columns = [
    {
      dataField: "accountId",
      text: "#",
      sort: true,
    },
    {
      dataField: "accountNumber",
      text: "Account Number",
      sort: true,
    },
    {
      dataField: "accountType",
      text: "Account Type",
      sort: true,
    },
    {
      dataField: "balance",
      text: "Balance",
    },
  ];

  return (
    <div className="container">
      <div className="mainHeader">Bank-Accounts</div>
      <hr />
      <div className="row">
        <div className="col-md-2 mx-auto"></div>
        <div className="col-md-8 mx-auto">
          {bankAccounts && bankAccounts.length > 0 ? (
            <BootstrapTable
              bootstrap4
              keyField="accountId"
              data={bankAccounts}
              columns={columns}
              pagination={paginationFactory({ sizePerPage: 5 })}
              filter={filterFactory()}
            />
          ) : (
            <div className="noBanks">No Accounts!</div>
          )}
        </div>
        <div className="col-md-2 mx-auto"></div>
      </div>
    </div>
  );
};

export default Bank_Account_List;
