import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import SourceToBankTransactionService from "../../services/source.to.bank.transaction.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";

const Source_To_Bank_Transaction = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { bankId, bankName, accountId, accountNumber, balance } = state || {}; // Read values passed on state

  const [sources, setSources] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);
  const [bankTrAddCreateResponse, setBankTrAddCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    if (accountId === undefined || balance === undefined)
      navigate("/bank-account-list" + bankId);

    allSources();
  }, []);

  const allSources = () => {
    SourceToBankTransactionService.allSources()
      .then((response) => {
        setSources(response.data);
        console.log(response.data);
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

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const { sourceId, transactionAmount, transactionDate } = form;
    const newErrors = {};

    if (!sourceId || sourceId === "")
      newErrors.sourceId = "Source is Required!";
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
      var bankTransaction = {
        sourceId: Number(form.sourceId),
        transactionAmount: Number(form.transactionAmount),
        transactionDate: form.transactionDate,
        bankId: Number(bankId),
        accountId: accountId,
        balance: Number(balance),
      };

      console.log(bankTransaction);

      // api call
      SourceToBankTransactionService.bankInputFromSource(bankTransaction)
        .then((response) => {
          setModelErrors([]);
          setBankTrAddCreateResponse({});
          console.log(response.data);

          var trCreateResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setBankTrAddCreateResponse(trCreateResponse);

            setTimeout(() => {
              navigate("/bank-account-list/" + bankId);
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setBankTrAddCreateResponse(trCreateResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setBankTrAddCreateResponse({});
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

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setBankTrAddCreateResponse({});
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

  const renderOptionsForSources = () => {
    return sources.map((dt, i) => {
      return (
        <option value={dt.sourceId} key={i} name={dt.sourceName}>
          {dt.sourceName}
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
                    <h4>Add Your Transaction Here...</h4>
                    <h5>[ From Source ---&gt; Bank ]</h5>
                    <div className="bankHeader">
                      Bank : {bankName}
                      <br />
                      Account Number : {accountNumber}
                      <br />
                      Current Balance : {balance}
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
                {bankTrAddCreateResponse &&
                bankTrAddCreateResponse.responseCode === -1 ? (
                  <span className="bankTrAddCreateError">
                    {bankTrAddCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="bankTrAddCreateSuccess">
                    {bankTrAddCreateResponse.responseMessage}
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
                      <Form.Group controlId="sourceId">
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.sourceId}
                          onChange={(e) => {
                            setField("sourceId", e.target.value);
                          }}
                        >
                          <option value="">Select Source</option>
                          {renderOptionsForSources()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.sourceId}
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
                    style={{ display: "flex", justifyContent: "space-between" }}
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
export default Source_To_Bank_Transaction;
