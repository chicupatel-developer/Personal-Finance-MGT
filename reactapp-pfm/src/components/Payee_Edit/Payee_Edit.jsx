import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import PayeeService from "../../services/payee.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Payee_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [payeeTypes, setPayeeTypes] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);

  const [payeeEditResponse, setPayeeEditResponse] = useState({});
  const [payee, setPayee] = useState({
    payeeName: "",
    description: "",
    payeeACNumber: "",
    payeeType: 0,
    balance: 0,
  });

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    getPayeeTypes();
    getPayee(id);
  }, []);

  const getPayee = (id) => {
    console.log("Editing payee : ", id);
    if (checkForNumbersOnly(id)) {
      PayeeService.getPayee(id)
        .then((response) => {
          console.log(response.data);
          setPayee(response.data);
          if (response.data.payeeType === 3) setShowBalance(true);
          else setShowBalance(false);
        })
        .catch((e) => {
          if (e.response.status === 400 || e.response.status === 500) {
            var payeeEditResponse = {
              responseCode: -1,
              responseMessage: e.response.data,
            };
            setPayeeEditResponse(payeeEditResponse);
          } else {
            console.log(e);
          }
        });
    } else navigate("/payee");
  };
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

  // reset form
  // form reference
  const formRef = useRef(null);

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const goBack = (e) => {
    navigate("/payee");
  };

  const setField = (field, value) => {
    if (field === "payeeType" && value === "3") setShowBalance(true);
    else if (field === "payeeType" && value !== "3") setShowBalance(false);

    setPayee({
      ...payee,
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
    const { payeeACNumber, description, payeeType, balance, payeeName } = payee;
    const newErrors = {};

    if (!payeeType || payeeType === "")
      newErrors.payeeType = "Payee Type is Required!";

    if (!payeeACNumber || payeeACNumber === "")
      newErrors.payeeACNumber = "Payee A/C Number is Required!";

    if (!payeeName || payeeName === "")
      newErrors.payeeName = "Payee Name is Required!";

    if (showBalance) {
      if (!balance || balance === "")
        newErrors.balance = "Balance is Required!";
    }
    if (!(!balance || balance === "")) {
      if (!checkForNumbersOnly(balance))
        newErrors.balance = "Only Numbers are Allowed!";
    }

    if (!description || description === "")
      newErrors.description = "Description is Required!";

    return newErrors;
  };
  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      if (error.response.data.status === 400) {
        console.log("Bad Request!!!");
        errors.push(error.response.data.title + "!");
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
    setPayee({
      ...payee,
      payeeName: "",
      description: "",
      payeeACNumber: "",
      payeeType: 0,
      balance: 0,
    });
    setPayeeEditResponse({});
    setModelErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var payeeModel = {
        payeeName: payee.payeeName,
        description: payee.description,
        payeeACNumber: payee.payeeACNumber,
        payeeType: Number(payee.payeeType),
        balance: showBalance ? Number(payee.balance) : 0,
        payeeId: Number(id),
      };

      console.log(payeeModel);

      // api call
      PayeeService.editPayee(payeeModel)
        .then((response) => {
          setModelErrors([]);
          setPayeeEditResponse({});
          console.log(response.data);

          var editResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setPayeeEditResponse(editResponse);

            setTimeout(() => {
              navigate("/payee");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setPayeeEditResponse(editResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setPayeeEditResponse({});
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
  const renderOptionsForPayeeTypes = () => {
    return payeeTypes.map((dt, i) => {
      return (
        <option value={i} key={i} name={dt}>
          {dt}
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
                    <h3>Edit Payee # {id}</h3>
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
                {payeeEditResponse && payeeEditResponse.responseCode === -1 ? (
                  <span className="payeeEditError">
                    {payeeEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="payeeEditSuccess">
                    {payeeEditResponse.responseMessage}
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
                          value={payee.payeeName}
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
                      <Form.Group controlId="payeeACNumber">
                        <Form.Label>Payee A/C Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={payee.payeeACNumber}
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
                      {showBalance && (
                        <Form.Group controlId="balance">
                          <Form.Label>Balance</Form.Label>
                          <Form.Control
                            className="qtyField"
                            type="text"
                            value={payee.balance}
                            isInvalid={!!errors.balance}
                            onChange={(e) =>
                              setField("balance", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.balance}
                          </Form.Control.Feedback>
                        </Form.Group>
                      )}
                    </div>
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          value={payee.description}
                          isInvalid={!!errors.description}
                          onChange={(e) =>
                            setField("description", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="payeeType">
                        <Form.Label>Payee Type</Form.Label>
                        <Form.Control
                          as="select"
                          value={payee.payeeType}
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
                      Edit Payee
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
export default Payee_Edit;
