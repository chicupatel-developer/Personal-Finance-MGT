import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import EntityMonitorService from "../../services/entity.monitor.service";
import BankService from "../../services/bank.service";
import AccountService from "../../services/account.service";

import {
  getAccountType,
  getBankColor,
  getPayeeTypeName,
  getAmountSign,
  getTransactionTypeDisplay,
} from "../../services/local.service";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Moment from "moment";

const Monitor_Account_Monthly = () => {
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [bank, setBank] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    getAllBanks();
  }, []);

  const getBankAccounts = (bankId) => {
    AccountService.getBankAccounts(bankId)
      .then((response) => {
        console.log(response.data.accounts);
        setAccounts(response.data.accounts);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAllBanks = () => {
    BankService.allBanks()
      .then((response) => {
        console.log(response.data);
        setBanks(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getBankName = (bankId) => {
    let obj = banks.find((x) => x.bankId === bankId);
    return obj.bankName;
  };
  const setField = (field, value) => {
    if (field === "bankId") {
      setBank({
        ...bank,
        bankId: Number(value),
        bankName: getBankName(Number(value)),
      });
      getBankAccounts(Number(value));
    }
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
    const { bankId, accountId } = form;
    const newErrors = {};

    if (!bankId || bankId === "") newErrors.bankId = "Bank is Required!";
    if (!accountId || accountId === "")
      newErrors.accountId = "Account is Required!";

    return newErrors;
  };
  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
  };

  const renderOptionsForBankList = () => {
    return banks.map((dt, i) => {
      return (
        <option value={dt.bankId} key={i} name={dt.bankName}>
          {dt.bankName}
        </option>
      );
    });
  };
  const renderOptionsForAccountList = () => {
    return accounts.map((dt, i) => {
      return (
        <option value={dt.accountId} key={i} name={dt.accountNumber}>
          {getAccountType(dt.accountType)} - [{dt.accountNumber}]
        </option>
      );
    });
  };

  const getBankStyle = (bankName) => {
    var bankColor = getBankColor(bankName);
    return { color: bankColor };
  };

  const handleSubmit = (e) => {};
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <div className="row">
                  <div className="col-md-9 mx-auto">
                    <h3>Account Monitoring</h3>
                  </div>
                  <div className="col-md-3 mx-auto"></div>
                </div>
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-md-5 mx-auto">
                      <Form.Group controlId="bankId">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.bankId}
                          onChange={(e) => {
                            setField("bankId", e.target.value);
                          }}
                        >
                          <option value="">Select Bank</option>
                          {renderOptionsForBankList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.bankId}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="accountId">
                        <Form.Label>Account</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.accountId}
                          onChange={(e) => {
                            setField("accountId", e.target.value);
                          }}
                        >
                          <option value="">---Select Account---</option>
                          <option value="0">---All Accounts---</option>
                          {renderOptionsForAccountList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-5 mx-auto"></div>
                  </div>

                  <p></p>
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      className="btn btn-success"
                      type="button"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Monitor!
                    </Button>
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => resetForm(e)}
                    >
                      Reset
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <p></p>
        <div className="row">
          <div className="col-md-12 mx-auto">
            {bank && bank.bankName && (
              <div
                className="bankTitleHeader"
                style={getBankStyle(bank.bankName)}
              >
                <h1>{bank.bankName}</h1>
                <p></p>
                <hr />
                <p></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor_Account_Monthly;
