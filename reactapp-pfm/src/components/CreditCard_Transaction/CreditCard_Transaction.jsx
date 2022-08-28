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
  return <div></div>;
};

export default CreditCard_Transaction;
