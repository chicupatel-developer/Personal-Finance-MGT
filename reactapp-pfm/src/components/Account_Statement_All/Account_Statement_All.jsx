import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  getBankColor,
  getPayeeTypeName,
  getAmountSign,
  getTransactionTypeDisplay,
} from "../../services/local.service";
import BankTransactionService from "../../services/bank.transaction.service";
import AccountService from "../../services/account.service";

import { useNavigate, useLocation } from "react-router";
// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Moment from "moment";

const Account_Statement_All = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { bankId, bankName, accountId } = state || {}; // Read values passed on state

  const [accountStatement, setAccountStatement] = useState({});
  const [modelErrors, setModelErrors] = useState([]);
  const [accountStatementResponse, setAccountStatementResponse] = useState({});

  const [groupByCollection, setGroupByCollection] = useState([]);
  const [accountType, setAccountType] = useState("");
  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    if (accountId === undefined) navigate("/bank-account-list" + bankId);
    else {
      var accountVM = {
        accountId: accountId,
      };
      getAccountStatementAll(accountVM);
    }
  }, []);
  useEffect(() => {
    getAccountTypeName(accountStatement);
  }, [accountStatement]);

  const getAccountStatementAll = (accountVM) => {
    BankTransactionService.getAccountStatementAll(accountVM)
      .then((response) => {
        setAccountStatement(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAccountTypeName = (acStat) => {
    AccountService.allAccountTypes()
      .then((response) => {
        console.log(response.data);
        response.data.map((dt, i) => {
          if (i === acStat.accountType) {
            setAccountType(dt);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getBankStyle = (_bankName) => {
    var bankColor = getBankColor(_bankName);
    return { backgroundColor: bankColor };
  };
  const goBack = (e) => {
    navigate("/bank-account-list/" + bankId);
  };

  const displayEntity = (cell, row) => {
    return (
      <div>
        <span>
          {row.transactionType === 0 && row.sourceId && row.payeeId === 0 ? (
            <span>{row.sourceName}</span>
          ) : (
            <span>
              {cell} - [{getPayeeTypeName(row.payeeType)}]
            </span>
          )}
        </span>
      </div>
    );
  };
  const displayAmount = (cell, row) => {
    return (
      <div>
        <span>
          {getAmountSign(row.transactionType)}&nbsp;
          {cell}
        </span>
      </div>
    );
  };
  const displayDate = (cell) => {
    if (cell === null || cell === "") return "N/A";
    else {
      return Moment(cell).format("DD-MMM-YYYY");
    }
  };
  const displayTransactionType = (cell, row) => {
    return getTransactionTypeDisplay(row.transactionType);
  };

  const columns = [
    {
      dataField: "bankTransactionId",
      text: "#",
      sort: true,
    },
    {
      dataField: "transactionTypeDisplay",
      text: "Type",
      sort: true,
      formatter: (cell, row) => displayTransactionType(cell, row),
    },
    {
      dataField: "payeeName",
      text: "Entity",
      sort: true,
      formatter: (cell, row) => displayEntity(cell, row),
    },
    {
      dataField: "amountPaid",
      text: "$Amount$",
      sort: true,
      formatter: (cell, row) => displayAmount(cell, row),
    },
    {
      dataField: "currentBalance",
      text: "$Current$",
      sort: true,
    },
    {
      dataField: "lastBalance",
      text: "$Last$",
      sort: true,
    },
    {
      dataField: "transactionDate",
      text: "Date",
      sort: true,
      formatter: (cell, row) => displayDate(cell, row),
    },
  ];

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const { groupBy, startDate, endDate } = form;
    const newErrors = {};

    return newErrors;
  };
  const searchTransaction = () => {};
  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      for (let prop in error.response.data.errors) {
        if (error.response.data.errors[prop].length > 1) {
          for (let error_ in error.response.data.errors[prop]) {
            errors.push(error.response.data.errors[prop][error_]);
          }
        } else {
          errors.push(error.response.data.errors[prop]);
        }
      }
    } else {
      console.log(error);
    }
    return errors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var filterObject = {
        groupBy: form.groupBy,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      console.log(filterObject);

      // do filter on accountStatement
      // x-fer this filter data to child component
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setAccountStatementResponse({});
    setModelErrors([]);
  };

  let modelErrorList =
    modelErrors.length > 0 &&
    modelErrors.map((item, i) => {
      return (
        <ul key={i} value={item}>
          <li style={{ marginTop: -20 }}>{item}</li>
        </ul>
      );
    }, this);

  const renderOptionsForGroupBy = () => {
    return groupByCollection.map((dt, i) => {
      return (
        <option value={dt.groupById} key={i} name={dt.groupByName}>
          {dt.groupByName}
        </option>
      );
    });
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mx-auto">
            <div className="card">
              <div style={getBankStyle(bankName)} className="card-header">
                <div className="row">
                  <div className="col-md-12 mx-auto statHeader">
                    <h3 className="mainHeader">
                      <u>Account Statement</u>
                    </h3>
                    {accountStatement && accountStatement.accountNumber && (
                      <div className="">
                        Bank : {bankName}
                        <br />
                        Account Number : {accountStatement.accountNumber} -{" "}
                        {accountType && <span>{accountType}</span>}
                        <br />
                        <span className="closingBalance">
                          Balance [Closing] : {accountStatement.lastBalance}
                        </span>
                      </div>
                    )}
                    <div className="searchTrForm">
                      <Form ref={formRef}>
                        <div className="row">
                          <div className="col-md-3 mx-auto">
                            <Form.Label>
                              <b>Start Date</b>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="startDate"
                              placeholder="Start Date"
                              onChange={(e) =>
                                setField("startDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="col-md-3 mx-auto">
                            <Form.Label>
                              <b>End Date</b>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="endDate"
                              placeholder="End Date"
                              onChange={(e) =>
                                setField("endDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="col-md-1 mx-auto searchBtn">
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => searchTransaction(e)}
                            >
                              <i className="bi bi-search"></i>
                            </Button>
                          </div>
                          <div className="col-md-5 mx-auto"></div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                <p></p>
                {accountStatementResponse &&
                accountStatementResponse.responseCode === -1 ? (
                  <span className="statementError">
                    {accountStatementResponse.responseMessage}
                  </span>
                ) : (
                  <span className="statementSuccess">
                    {accountStatementResponse.responseMessage}
                  </span>
                )}
                {modelErrors.length > 0 ? (
                  <div className="modelError">{modelErrorList}</div>
                ) : (
                  <span></span>
                )}
              </div>
              <div className="card-body">
                <p></p>
                {accountStatement.transactions &&
                accountStatement.transactions.length > 0 ? (
                  <BootstrapTable
                    bootstrap4
                    keyField="bankTransactionId"
                    data={accountStatement.transactions}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 5 })}
                    filter={filterFactory()}
                  />
                ) : (
                  <div className="noBanks">No Transactions!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account_Statement_All;
