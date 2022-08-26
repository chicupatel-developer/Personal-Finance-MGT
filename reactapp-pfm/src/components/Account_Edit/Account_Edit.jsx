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
import accountHttpCommon from "../../axios/account-http-common";

const Account_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [accountTypes, setAccountTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);

  const [acEditResponse, setAcEditResponse] = useState({});
  const [account, setAccount] = useState({
    accountNumber: 0,
    balance: 0,
    bankId: 0,
    accountType: 0,
  });

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAccountTypes();
    getAllBanks();
    getAccount(id);
  }, []);

  const getAccount = (id) => {
    console.log("Editing account : ", id);
    if (checkForNumbersOnly(id)) {
      AccountService.getAccount(id)
        .then((response) => {
          console.log(response.data);
          setAccount(response.data);
        })
        .catch((e) => {
          if (e.response.status === 400 || e.response.status === 500) {
            var acEditResponse = {
              responseCode: -1,
              responseMessage: e.response.data,
            };
            setAcEditResponse(acEditResponse);
          } else {
            console.log(e);
          }
        });
    } else navigate("/account");
  };
  const getAccountTypes = () => {
    AccountService.allAccountTypes()
      .then((response) => {
        console.log(response.data);
        setAccountTypes(response.data);
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

  // reset form
  // form reference
  const formRef = useRef(null);

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const goBack = (e) => {
    navigate("/account");
  };

  const setField = (field, value) => {
    console.log(field, value);
    setAccount({
      ...account,
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
    const { accountNumber, accountType, balance, bankId } = account;
    const newErrors = {};

    if (!accountType || accountType === "")
      newErrors.accountType = "Account Type is Required!";
    if (!bankId || bankId === "") newErrors.bankId = "Bank is Required!";

    if (!balance || balance === "") newErrors.balance = "Balance is Required!";
    if (!(!balance || balance === "")) {
      if (!checkForNumbersOnly(balance))
        newErrors.balance = "Only Numbers are Allowed!";
    }

    if (!accountNumber || accountNumber === "")
      newErrors.accountNumber = "Account Number is Required!";
    if (!(!accountNumber || accountNumber === "")) {
      if (!checkForNumbersOnly(accountNumber))
        newErrors.accountNumber = "Only Numbers are Allowed!";
    }
    return newErrors;
  };
  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      if (error.response.data.errors === undefined) {
        console.log("Bad Request!!!");
        errors.push(error.response.data);
      } else {
        for (let prop in error.response.data.errors) {
          if (error.response.data.errors[prop].length > 1) {
            for (let error_ in error.response.data.errors[prop]) {
              errors.push(error.response.data.errors[prop][error_]);
            }
          } else {
            errors.push(error.response.data.errors[prop]);
          }
        }
      }
    } else {
      console.log(error);
    }
    return errors;
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setAcEditResponse({});
    setModelErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var accountModel = {
        accountNumber: Number(account.accountNumber),
        accountType: Number(account.accountType),
        balance: Number(account.balance),
        bankId: Number(account.bankId),
        accountId: Number(id),
      };

      console.log(accountModel);

      // api call
      AccountService.editAccount(accountModel)
        .then((response) => {
          setModelErrors([]);
          setAcEditResponse({});
          console.log(response.data);

          var acEditResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setAcEditResponse(acEditResponse);

            setTimeout(() => {
              navigate("/account");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setAcEditResponse(acEditResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setAcEditResponse({});
          // 400
          // ModelState
          if (error.response.status === 400) {
            console.log("400 !");
            var modelErrors = handleModelState(error);
            setModelErrors(modelErrors);
          }
        });
    }
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
  const renderOptionsForAccountTypes = () => {
    return accountTypes.map((dt, i) => {
      return (
        <option value={i} key={i} name={dt}>
          {dt}
        </option>
      );
    });
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
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header header">
                <div className="row">
                  <div className="col-md-8 mx-auto">
                    <h3>Edit Account # {id}</h3>
                  </div>
                  <div className="col-md-4 mx-auto">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => goBack(e)}
                    >
                      <i className="bi bi-arrow-return-left"></i> Back
                    </Button>
                  </div>
                </div>
                <p></p>{" "}
                {acEditResponse && acEditResponse.responseCode === -1 ? (
                  <span className="acEditError">
                    {acEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="acEditSuccess">
                    {acEditResponse.responseMessage}
                  </span>
                )}
                {modelErrors.length > 0 ? (
                  <div className="modelError">{modelErrorList}</div>
                ) : (
                  <span></span>
                )}
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="accountNumber">
                        <Form.Label>A/C Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={account.accountNumber}
                          isInvalid={!!errors.accountNumber}
                          onChange={(e) =>
                            setField("accountNumber", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.accountNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="balance">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                          className="qtyField"
                          type="text"
                          value={account.balance}
                          isInvalid={!!errors.balance}
                          onChange={(e) => setField("balance", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.balance}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="bankId">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control
                          as="select"
                          value={account.bankId}
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
                      <Form.Group controlId="accountType">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Control
                          as="select"
                          value={account.accountType}
                          isInvalid={!!errors.accountType}
                          onChange={(e) => {
                            setField("accountType", e.target.value);
                          }}
                        >
                          <option value="">Select Account Type</option>
                          {renderOptionsForAccountTypes()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountType}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                    </div>
                  </div>

                  <p></p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      className="btn btn-success"
                      type="button"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Edit Account
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
      </div>
    </div>
  );
};
export default Account_Edit;
