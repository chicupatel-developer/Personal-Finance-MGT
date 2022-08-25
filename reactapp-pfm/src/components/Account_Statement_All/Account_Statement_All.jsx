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

import Moment from "moment";

import Transactions from "./Transactions/Transactions";

const Account_Statement_All = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { bankId, bankName, accountId } = state || {}; // Read values passed on state

  const [accountStatement, setAccountStatement] = useState({});
  const [apiResponse, setApiResponse] = useState("");

  const [accountType, setAccountType] = useState("");

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  const [transactions_, setTransactions_] = useState([]);
  const [doSearch, setDoSearch] = useState(false);

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
        console.log(response.data);
        if (response.data.responseCode === -1) {
          setApiResponse(response.data.responseMessage);
        } else {
          setApiResponse("");
          setAccountStatement(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 400) {
          setApiResponse("Bad Request !");
        }
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
    const { startDate, endDate } = form;
    const newErrors = {};

    if (!startDate || startDate === "")
      newErrors.startDate = "Start Date is Required!";

    if (!endDate || endDate === "") newErrors.endDate = "End Date is Required!";

    if (!(!startDate || startDate === "") && !(!endDate || endDate === "")) {
      if (startDate > endDate) {
        newErrors.startDate = "Start Date Must be < End Date!";
      } else {
        delete newErrors["startDate"];
        delete newErrors["endDate"];
      }
    }

    console.log(newErrors);
    return newErrors;
  };

  const searchTransaction = (e) => {
    e.preventDefault();
    setDoSearch(true);
    var searchTransactions = [];

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("no error!");
      setErrors({});
      for (var i = 0; i < accountStatement.transactions.length; i++) {
        if (
          accountStatement.transactions[i].transactionDate <= form.endDate &&
          accountStatement.transactions[i].transactionDate >= form.startDate
        ) {
          searchTransactions.push(accountStatement.transactions[i]);
        }
      }
      console.log(searchTransactions);
      setTransactions_(searchTransactions);
    }
  };

  const allTransaction = (e) => {
    e.preventDefault();
    setDoSearch(false);
    formRef.current.reset();
    setForm({});
    setTransactions_([]);
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
                    {!apiResponse && (
                      <div>
                        {accountStatement && accountStatement.accountNumber && (
                          <div className="">
                            Bank : {bankName}
                            <br />
                            Account Number : {
                              accountStatement.accountNumber
                            } - {accountType && <span>{accountType}</span>}
                            <br />
                            <span className="closingBalance">
                              Balance [Closing] : {accountStatement.lastBalance}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {!apiResponse && (
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
                                isInvalid={!!errors.startDate}
                                placeholder="Start Date"
                                onChange={(e) =>
                                  setField("startDate", e.target.value)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.startDate}
                              </Form.Control.Feedback>
                            </div>
                            <div className="col-md-3 mx-auto">
                              <Form.Label>
                                <b>End Date</b>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="endDate"
                                isInvalid={!!errors.endDate}
                                placeholder="End Date"
                                onChange={(e) =>
                                  setField("endDate", e.target.value)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.endDate}
                              </Form.Control.Feedback>
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
                            <div className="col-md-2 mx-auto searchBtn">
                              <Button
                                className="btn btn-success"
                                type="button"
                                onClick={(e) => allTransaction(e)}
                              >
                                All Transactions
                              </Button>
                            </div>
                            <div className="col-md-3 mx-auto"></div>
                          </div>
                        </Form>
                      </div>
                    )}
                  </div>
                </div>
                <p></p>
              </div>
              <div className="card-body">
                <p></p>
                {!apiResponse && (
                  <div>
                    {!doSearch ? (
                      <Transactions
                        myTransactions={accountStatement.transactions}
                      />
                    ) : (
                      <Transactions myTransactions={transactions_} />
                    )}
                  </div>
                )}
                {apiResponse && <div className="apiError">{apiResponse}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account_Statement_All;
