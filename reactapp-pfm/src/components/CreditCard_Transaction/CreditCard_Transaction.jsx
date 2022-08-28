import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import BankTransactionService from "../../services/bank.transaction.service";
import CCService from "../../services/cc.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";
const CreditCard_Transaction = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { creditCardId, balance, ccAccountNumber } = state || {}; // Read values passed on state

  const [payees, setPayees] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);
  const [ccTrAddCreateResponse, setCcTrAddCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    if (creditCardId === undefined || balance === undefined)
      navigate("/creditcard");

    listOfPayees();
  }, []);

  const listOfPayees = () => {
    BankTransactionService.listOfPayees()
      .then((response) => {
        setPayees(response.data.filter((xx) => xx.payeeType !== 3));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const goBack = (e) => {
    navigate("/creditcard/");
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

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const { payeeId, transactionAmount, transactionDate } = form;
    const newErrors = {};

    if (!payeeId || payeeId === "") newErrors.payeeId = "Payee is Required!";
    if (!transactionDate || transactionDate === "")
      newErrors.transactionDate = "Transaction Date is Required!";

    if (!transactionAmount || transactionAmount === "")
      newErrors.transactionAmount = "Transaction Amount is Required!";

    if (!(!transactionAmount || transactionAmount === "")) {
      if (!checkForNumbersOnly(transactionAmount))
        newErrors.transactionAmount = "Only Numbers are Allowed!";
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
    setCcTrAddCreateResponse({});
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var ccTransaction = {
        payeeId: Number(form.payeeId),
        transactionAmount: Number(form.transactionAmount),
        transactionDate: form.transactionDate,
        creditCardId: Number(creditCardId),
        balance: Number(balance),
        ccAccountNumber: ccAccountNumber,
      };

      console.log(ccTransaction);

      // api call
      CCService.addCCTransaction(ccTransaction)
        .then((response) => {
          setModelErrors([]);
          setCcTrAddCreateResponse({});
          console.log(response.data);

          var trCreateResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setCcTrAddCreateResponse(trCreateResponse);

            setTimeout(() => {
              navigate("/creditcard/");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setCcTrAddCreateResponse(trCreateResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setCcTrAddCreateResponse({});
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
  const renderOptionsForPayees = () => {
    return payees.map((dt, i) => {
      return (
        <option value={dt.payeeId} key={i} name={dt.payeeName}>
          {dt.payeeName}
        </option>
      );
    });
  };

  return <div></div>;
};

export default CreditCard_Transaction;
