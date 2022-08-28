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

  useEffect(() => {
    getPayeeTypes();
    getPayee(id);
  }, []);

  const getPayee = (id) => {
    console.log("Editing paye : ", id);
    if (checkForNumbersOnly(id)) {
      PayeeService.getPayee(id)
        .then((response) => {
          console.log(response.data);
          setPayee(response.data);
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
    console.log(field, value);
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

    if (!balance || balance === "") newErrors.balance = "Balance is Required!";
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
        balance: Number(payee.balance),
        payeeId: Number(id),
      };

      console.log(payeeModel);
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

  return <div className="mainContainer"></div>;
};
export default Payee_Edit;
