import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import BankTransactionService from "../../services/bank.transaction.service";
import AccountService from "../../services/account.service";

import { useNavigate, useLocation } from "react-router";

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
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div style={getBankStyle(bankName)} className="card-header">
                <div className="row">
                  <div className="col-md-10 mx-auto">
                    <h4>Account Statement</h4>
                    {accountStatement && accountStatement.accountNumber && (
                      <div className="bankHeader">
                        Bank : {bankName}
                        <br />
                        Account Number : {accountStatement.accountNumber} -{" "}
                        {accountType && <span>{accountType}</span>}
                        <br />
                        Balance [Closing] : {accountStatement.lastBalance}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2 mx-auto"></div>
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
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account_Statement_All;
