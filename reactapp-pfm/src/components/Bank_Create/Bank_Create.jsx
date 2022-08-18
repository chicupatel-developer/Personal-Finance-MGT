import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import BankService from "../../services/bank.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Bank_Create = () => {
  let navigate = useNavigate();

  const [modelErrors, setModelErrors] = useState([]);

  const [bankCreateResponse, setBankCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {}, []);

  // reset form
  // form reference
  const formRef = useRef(null);

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
    const { bankName } = form;
    const newErrors = {};

    if (!bankName || bankName === "")
      newErrors.bankName = "Bank Name is Required!";

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
      var bankModel = {
        bankName: form.bankName,
      };

      console.log(bankModel);

      // api call
      BankService.createBank(bankModel)
        .then((response) => {
          setModelErrors([]);
          setBankCreateResponse({});
          console.log(response.data);

          var bankCreateResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setBankCreateResponse(bankCreateResponse);

            setTimeout(() => {
              navigate("/bank");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setBankCreateResponse(bankCreateResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setBankCreateResponse({});
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
    setBankCreateResponse({});
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
      <div className="container"></div>
    </div>
  );
};
export default Bank_Create;
