import React, { useState, useEffect } from "react";
import "./style.css";
import AccountService from "../../services/account.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import {
  getBankColor,
  getAccountType,
  getAccountColor,
} from "../../services/local.service";

const Payee = () => {
  let navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAllAccounts();
  }, []);
  const getAllAccounts = () => {
    AccountService.allAccounts()
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getBankStyle = (_bankName) => {
    var bankColor = getBankColor(_bankName);
    return { backgroundColor: bankColor };
  };

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
          onClick={(e) => editAccount(e, row.accountId)}
        >
          <i className="bi bi-pencil-square"></i>
        </Button>{" "}
        <Button
          className="btn btn-danger"
          type="button"
          onClick={(e) => removeAccount(e, row.accountId)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    );
  };
  const editAccount = (e, accountId) => {};
  const removeAccount = (e, accountId) => {};
  const createNewAccount = () => {
    navigate("/account-create");
  };

  
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
      dataField: "bankName",
      text: "Bank",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];
  return (
    <div className="container">
      <div className="mainHeader">Accounts</div>
      <hr />
      <div className="row">
        <div className="col-md-2 mx-auto"></div>
        <div className="col-md-8 mx-auto">
          <Button
            className="btn btn-primary"
            type="button"
            onClick={(e) => createNewAccount(e)}
          >
            <i className="bi bi-plus-circle"></i> Account
          </Button>
          <p></p>
          {accounts && accounts.length > 0 ? (
            <BootstrapTable
              bootstrap4
              keyField="accountId"
              data={accounts}
              rowStyle={getBankStyle}
              columns={columns}
              pagination={paginationFactory({ sizePerPage: 5 })}
              filter={filterFactory()}
            />
          ) : (
            <div className="noAccounts">No Accounts!</div>
          )}
        </div>
        <div className="col-md-2 mx-auto"></div>
      </div>
    </div>
  );
};

export default Payee;
