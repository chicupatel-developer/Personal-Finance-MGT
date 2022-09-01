import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import PayeeService from "../../../services/payee.service";
import CCService from "../../../services/cc.service";
import {
  getAccountType,
  getBankColor,
  getPayeeTypeName,
  getAmountSign,
  getTransactionTypeDisplay,
} from "../../../services/local.service";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Moment from "moment";

import Transactions from "../Account_Payee_Report/Transactions/Transactions";

const CreditCard_Payee_Report = () => {
  const [apiError, setApiError] = useState("");
  const [payees, setPayees] = useState([]);
  const [payeeTypes, setPayeeTypes] = useState([]);
  const [ccs, setCcs] = useState([]);

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  const [cc, setCc] = useState({});

  useEffect(() => {
    getAllCreditCards();
    getAllPayeeTypes();
  }, []);
  const getAllPayeeTypes = () => {
    PayeeService.allPayeeTypes()
      .then((response) => {
        console.log(response.data);
        setPayeeTypes(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAllCreditCards = () => {
    CCService.allCCs()
      .then((response) => {
        console.log(response.data);
        setCcs(response.data);
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
  const findFormErrors = () => {
    const { creditCardId, payeeId } = form;
    const newErrors = {};

    if (!creditCardId || creditCardId === "")
      newErrors.creditCardId = "Credit-Card is Required!";
    if (!payeeId || payeeId === "") newErrors.payeeId = "Payee is Required!";

    return newErrors;
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
  };

  const renderOptionsForPayeeList = () => {
    return payees.map((dt, i) => {
      return (
        <option value={dt.payeeId} key={i} name={dt.payeeName}>
          {dt.payeeName}
        </option>
      );
    });
  };
  const renderOptionsForCreditCards = () => {
    return ccs.map((dt, i) => {
      return (
        <option value={dt.creditCardId} key={i} name={dt.creditCardName}>
          {dt.creditCardName}
        </option>
      );
    });
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
                    <h3>CreditCard --&gt; Payee [Report]</h3>
                  </div>
                  <div className="col-md-3 mx-auto"></div>
                </div>
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-md-5 mx-auto">
                      <Form.Group controlId="creditCardId">
                        <Form.Label>Credit-Card</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.creditCardId}
                          onChange={(e) => {
                            setField("creditCardId", e.target.value);
                          }}
                        >
                          <option value="">Select Credit-Card</option>
                          {renderOptionsForCreditCards()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.creditCardId}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="payeeId">
                        <Form.Label>Payee</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.payeeId}
                          onChange={(e) => {
                            setField("payeeId", e.target.value);
                          }}
                        >
                          <option value="">---Select Payee---</option>
                          <option value="0">---All Payees---</option>
                          {renderOptionsForPayeeList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.payeeId}
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
                      Get Report!
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
          <div className="col-md-12 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard_Payee_Report;
