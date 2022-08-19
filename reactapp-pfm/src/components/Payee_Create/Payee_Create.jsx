import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import PayeeService from "../../services/payee.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Payee_Create = () => {
  let navigate = useNavigate();

  const [modelErrors, setModelErrors] = useState([]);
  const [payeeTypes, setPayeeTypes] = useState([]);

  const [payeeCreateResponse, setPayeeCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getPayeeTypes();
  }, []);

  // reset form
  // form reference
  const formRef = useRef(null);

  const getPayeeTypes = () => {
    PayeeService.allPayeeTypes()
      .then((response) => {
        console.log(response.data);
        setPayeeTypes(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
    const { payeeName, description, payeeACNumber, payeeType, balance } = form;
    const newErrors = {};

    if (!payeeName || payeeName === "")
      newErrors.payeeName = "Payee Name is Required!";
    if (!description || description === "")
      newErrors.description = "Description is Required!";
    if (!payeeACNumber || payeeACNumber === "")
      newErrors.payeeACNumber = "Payee A/C No is Required!";
    if (!payeeType || payeeType === "")
      newErrors.payeeType = "Payee Type is Required!";

    if (!balance || balance === "") newErrors.balance = "Balance is Required!";
    if (!(!balance || balance === "")) {
      if (!checkForNumbersOnly(balance))
        newErrors.balance = "Only Numbers are Allowed!";
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

  const goBack = (e) => {
    navigate("/payee");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var payeeModel = {
        payeeName: form.payeeName,
        description: form.description,
        payeeACNumber: form.payeeACNumber,
        payeeType: form.payeeType,
        balance: Number(form.balance),
      };

      console.log(payeeModel);
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setPayeeCreateResponse({});
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

  const renderOptionsForPayeeTypes = () => {
    return payeeTypes.map((dt, i) => {
      return (
        <option value={dt} key={i} name={dt}>
          {dt}
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
              <div className="card-header header">
                <div className="row">
                  <div className="col-md-9 mx-auto">
                    <h3>Create New Payee</h3>
                  </div>
                  <div className="col-md-3 mx-auto">
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
                {payeeCreateResponse &&
                payeeCreateResponse.responseCode === -1 ? (
                  <span className="payeeCreateError">
                    {payeeCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="payeeCreateSuccess">
                    {payeeCreateResponse.responseMessage}
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
                      <Form.Group controlId="payeeName">
                        <Form.Label>Payee Name</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.payeeName}
                          onChange={(e) =>
                            setField("payeeName", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.payeeName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="5"
                          isInvalid={!!errors.description}
                          onChange={(e) =>
                            setField("description", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="payeeType">
                        <Form.Label>Payee Type</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.payeeType}
                          onChange={(e) => {
                            setField("payeeType", e.target.value);
                          }}
                        >
                          <option value="">Select Payee Type</option>
                          {renderOptionsForPayeeTypes()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.payeeType}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="payeeACNumber">
                        <Form.Label>A/C Number</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.payeeACNumber}
                          onChange={(e) =>
                            setField("payeeACNumber", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.payeeACNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="balance">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                          className="qtyField"
                          type="text"
                          isInvalid={!!errors.balance}
                          onChange={(e) => setField("balance", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.balance}
                        </Form.Control.Feedback>
                      </Form.Group>
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
                      Create Payee
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
export default Payee_Create;
