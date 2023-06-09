import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  getBankColor,
  getAccountType,
  getAccountColor,
} from "../../services/local.service";
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
  const [bankAcResponse, setBankAcResponse] = useState("");
  const [responseColor, setResponseColor] = useState("");

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const getBankStyle = (_bankName) => {
    var bankColor = getBankColor(_bankName);
    return { backgroundColor: bankColor };
  };

  const getBankAccounts = (id) => {
    console.log("getting accounts for bank : ", id);
    if (checkForNumbersOnly(id)) {
      setBankAcResponse("");
      setResponseColor("");
      AccountService.getBankAccounts(id)
        .then((response) => {
          // console.log(response.data);
          if (response.data.bankName === null) {
            setBankAcResponse("Bank Not Found !");
            setResponseColor("red");
          } else {
            setBankAccounts(response.data.accounts);
            setBankName(response.data.bankName);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getBankAccounts(id);
  }, []);

  const displayAcType = (cell, row) => {
    return (
      <div>
        <b>
          <span style={{ color: `${getAccountColor(cell)}` }}>
            {getAccountType(cell)}
          </span>
        </b>
      </div>
    );
  };
  const displayAccountNumber = (cell, row) => {
    return (
      <div>
        <span>
          <i className="bi bi-bag"></i> {cell}
        </span>
      </div>
    );
  };
  const displayActionBtn = (cell, row) => {
    return (
      <div>
        {" "}
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => bankTransactionBeginAdd(e, row)}
        >
          -$ To Payee
        </Button>{" "}
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => bankInputFromSource(e, row)}
        >
          +$ From Source
        </Button>{" "}
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => getAccountStatementAll(e, row)}
        >
          Statement
        </Button>
      </div>
    );
  };
  const bankInputFromSource = (e, account) => {
    var bankTransaction = {
      bankId: id,
      bankName: bankName,
      accountId: account.accountId,
      accountNumber: account.accountNumber,
      balance: account.balance,
    };
    console.log(bankTransaction);

    navigate("/source-to-bank-transaction", {
      state: bankTransaction,
    });
  };
  const bankTransactionBeginAdd = (e, account) => {
    var bankTransaction = {
      bankId: id,
      bankName: bankName,
      accountId: account.accountId,
      accountNumber: account.accountNumber,
      balance: account.balance,
    };
    console.log(bankTransaction);

    navigate("/bank-transaction-add", {
      state: bankTransaction,
    });
  };
  const getAccountStatementAll = (e, account) => {
    var accountVM = {
      bankId: id,
      bankName: bankName,
      accountId: account.accountId,
      // accountId: null,
    };
    console.log(accountVM);

    navigate("/account-statement-all", {
      state: accountVM,
    });
  };

  const columns = [
    {
      dataField: "accountNumber",
      text: "Account Number",
      sort: true,
      formatter: (cell, row) => displayAccountNumber(cell, row),
    },
    {
      dataField: "accountType",
      text: "Account Type",
      sort: true,
      formatter: (cell, row) => displayAcType(cell, row),
    },
    {
      dataField: "balance",
      text: "Balance",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const goBack = (e) => {
    navigate("/bank");
  };

  return (
    <div className="container">
      <div className="mainHeader">Bank-Accounts</div>
      <hr />
      <div className="row">
        <div className="col-md-1 mx-auto"></div>
        <div className="col-md-10 mx-auto">
          <div className="card">
            <div style={getBankStyle(bankName)} className="card-header">
              <div className="row">
                <div className="col-md-10 mx-auto">
                  {bankAcResponse ? (
                    <h4 style={{ color: responseColor }}>{bankAcResponse}</h4>
                  ) : (
                    <h4>{bankName} Accounts here...</h4>
                  )}
                </div>
                <div className="col-md-2 mx-auto">
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => goBack(e)}
                  >
                    <i className="bi bi-arrow-return-left"></i> Back
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p></p>
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
        <div className="col-md-1 mx-auto"></div>
      </div>
    </div>
  );
};

export default Bank_Account_List;
