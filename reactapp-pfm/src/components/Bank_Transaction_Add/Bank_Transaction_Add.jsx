import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import BankTransactionService from "../../services/bank.transaction.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";

const Bank_Tranaction_Add = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { bankId, bankName, accountId, accountNumber, balance } = state || {}; // Read values passed on state

  useEffect(() => {
    if (accountId === undefined || balance === undefined)
      navigate("/bank-account-list" + bankId);
  }, []);

  const goBack = (e) => {
    navigate("/bank-account-list/" + bankId);
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
                    <h3>Add Your Transaction Here...</h3>
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
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Bank_Tranaction_Add;
