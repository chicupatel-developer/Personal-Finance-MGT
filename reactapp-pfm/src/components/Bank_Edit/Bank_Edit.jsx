import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import BankService from "../../services/bank.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Bank_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [modelErrors, setModelErrors] = useState([]);

  const [bankEditResponse, setBankEditResponse] = useState({});

  // form
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getBank(id);
  }, []);

  const getBank = (id) => {
    console.log("Editing bank : ", id);
    if (checkForNumbersOnly(id)) {
      BankService.getBank(id)
        .then((response) => {
          console.log(response.data);
          setBankName(response.data.bankName);
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/bank");
  };

  // reset form
  // form reference
  const formRef = useRef(null);

  const handleBankName = (event) => {
    setBankName(event.target.value);
    if (!errors[bankName])
      setErrors({
        ...errors,
        bankName: "",
      });
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!bankName || bankName === "")
      newErrors.bankName = "Bank Name is Required!";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var bankModel = {
        // check for ModelState @api
        bankName: bankName,
        // departmentName: null,
        bankId: parseInt(id),
      };

      console.log(bankModel);
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setBankName("");
    setBankEditResponse({});
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h3>Edit Bank # {id}</h3>
                <p></p>{" "}
                {bankEditResponse && bankEditResponse.responseCode === -1 ? (
                  <span className="bankEditError">
                    {bankEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="bankEditSuccess">
                    {bankEditResponse.responseMessage}
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
                      <Form.Group controlId="bankName">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                          value={bankName}
                          type="text"
                          isInvalid={!!errors.bankName}
                          onChange={(e) => handleBankName(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.bankName}
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
                      Edit Bank
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
export default Bank_Edit;
