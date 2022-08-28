import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getCCTypeColor } from "../../services/local.service";
import BankTransactionService from "../../services/bank.transaction.service";
import CCService from "../../services/cc.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";
const CreditCard_Transaction = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { creditCardId, balance, ccAccountNumber, creditCardName } =
    state || {}; // Read values passed on state

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
      if (error.response.data.status === 400) {
        console.log("Bad Request!!!");
        errors.push(error.response.statusText + " !");
      } else {
        for (let prop in error.response.data) {
          if (error.response.data[prop].length > 1) {
            for (let error_ in error.response.data[prop]) {
              errors.push(error.response.data[prop][error_]);
            }
          } else {
            errors.push(error.response.data[prop]);
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div
                style={{
                  backgroundColor: getCCTypeColor(creditCardName),
                }}
                className="card-header"
              >
                <div className="row">
                  <div className="col-md-10 mx-auto">
                    <h4>Add Your Transaction Here...</h4>
                    <h5>[ From Credit-Card ---&gt; Payee ]</h5>
                    <div className="ccHeader">
                      Credit-Card : {creditCardName}
                      <br />
                      CC A/C Number : {ccAccountNumber}
                      <br />
                      Maximum Pay : {balance}
                    </div>
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
                <p></p>
                {ccTrAddCreateResponse &&
                ccTrAddCreateResponse.responseCode === -1 ? (
                  <span className="ccTrAddCreateError">
                    {ccTrAddCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="ccTrAddCreateSuccess">
                    {ccTrAddCreateResponse.responseMessage}
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
                      <Form.Group controlId="payeeId">
                        <Form.Label>Payee</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.payeeId}
                          onChange={(e) => {
                            setField("payeeId", e.target.value);
                          }}
                        >
                          <option value="">Select Payee</option>
                          {renderOptionsForPayees()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.payeeId}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="transactionAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          className="qtyField"
                          type="text"
                          isInvalid={!!errors.transactionAmount}
                          onChange={(e) =>
                            setField("transactionAmount", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.transactionAmount}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Label>Transaction Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="transactionDate"
                        placeholder="Transaction Date"
                        isInvalid={!!errors.transactionDate}
                        onChange={(e) =>
                          setField("transactionDate", e.target.value)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.transactionDate}
                      </Form.Control.Feedback>
                    </div>
                  </div>
                  <p></p>
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
                      Commit Transaction
                    </Button>
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => resetForm(e)}
                    >
                      Cancel
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

export default CreditCard_Transaction;
