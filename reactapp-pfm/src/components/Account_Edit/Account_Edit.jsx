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

const Account_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [accountTypes, setAccountTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);

  const [acEditResponse, setAcEditResponse] = useState({});
  const [account, setAccount] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAccount(id);
  }, []);

  const getAccount = (id) => {
    console.log("Editing account : ", id);
    if (checkForNumbersOnly(id)) {
      AccountService.getAccount(id)
        // BankService.getBank(11111) error: bank not found!
        .then((response) => {
          console.log(response.data);
          setAccount(response.data);

          getAccountTypes();
          getAllBanks();
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status === 400) {
            var acEditResponse = {
              responseCode: -1,
              responseMessage: e.response.data,
            };
            setAcEditResponse(acEditResponse);
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
    const { accountNumber, accountType, balance, bankId } = form;
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
      // console.log(error.response.data);

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

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setAcEditResponse({});
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
                <p></p>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account_Edit;
