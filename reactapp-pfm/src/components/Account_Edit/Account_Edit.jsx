import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getBankColor } from "../../services/local.service";
import BankService from "../../services/bank.service";
import AccountService from "../../services/account.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Account_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [modelErrors, setModelErrors] = useState([]);

  const [acEditResponse, setAcEditResponse] = useState({});
  const [account, setAccount] = useState({});

  // form
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAccount(id);
  }, []);

  const getAccount = (id) => {
    console.log("Editing account : ", id);
    if (checkForNumbersOnly(id)) {
      AccountService.getAccount(id)
        // BankService.getBank(11111) error: bank not found!
        .then((response) => {
          console.log(response.data);
          setAccount(response.data);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status === 400) {
            var acEditResponse = {
              responseCode: -1,
              responseMessage: e.response.data,
            };
            setAcEditResponse(acEditResponse);
          }
        });
    } else navigate("/account");
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
    navigate("/account");
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
                <div className="row">
                  <div className="col-md-8 mx-auto">
                    <h3>Edit Account # {id}</h3>
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
                <p></p>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Account_Edit;
