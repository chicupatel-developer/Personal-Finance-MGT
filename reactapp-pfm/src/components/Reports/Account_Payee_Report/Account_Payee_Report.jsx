import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import PayeeService from "../../../services/payee.service";
import BankService from "../../../services/bank.service";
import AccountService from "../../../services/account.service";
import {
  getPayeeIcon,
  getPayeeTypeName,
} from "../../../services/local.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Account_Payee_Report = () => {
  const [payees, setPayees] = useState([]);
  const [payeeTypes, setPayeeTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    getAllPayees();
    getAllPayeeTypes();
    getAllBanks();
  }, []);

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
    const { bankId, accountId, payeeId } = form;
    const newErrors = {};

    if (!bankId || bankId === "") newErrors.bankId = "Bank is Required!";
    if (!accountId || accountId === "")
      newErrors.accountId = "Account is Required!";
    if (!payeeId || payeeId === "") newErrors.payeeId = "Payee is Required!";

    return newErrors;
  };

  const getBankAccounts = (bankId) => {
    AccountService.getBankAccounts(bankId)
      .then((response) => {
        console.log(response.data);
        setAccounts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAllBanks = () => {
    BankService.allBanks()
      .then((response) => {
        console.log(response.data);
        setBanks(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAllPayees = () => {
    PayeeService.allPayees()
      .then((response) => {
        console.log(response.data);
        setPayees(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
  const renderOptionsForBankList = () => {
    return banks.map((dt, i) => {
      return (
        <option value={dt.bankId} key={i} name={dt.bankName}>
          {dt.bankName}
        </option>
      );
    });
  };
  const renderOptionsForAccountList = () => {
    return accounts.map((dt, i) => {
      return (
        <option value={dt.accountId} key={i} name={dt.accountNumber}>
          {dt.accountNumber}
        </option>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();
      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
      } else {
          console.log('getting report !');
      }
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
                    <h3>Account To Payee Report</h3>
                  </div>
                  <div className="col-md-3 mx-auto"></div>
                </div>
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="bankId">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.bankId}
                          onChange={(e) => {
                            setField("bankId", e.target.value);
                          }}
                        >
                          <option value="">Select Bank</option>
                          {renderOptionsForBankList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.bankId}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="accountId">
                        <Form.Label>Account</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.accountId}
                          onChange={(e) => {
                            setField("accountId", e.target.value);
                          }}
                        >
                          <option value="">Select Account Type</option>
                          {renderOptionsForAccountList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mx-auto"></div>
                  </div>

                  <p></p>
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
      </div>
    </div>
  );
};

export default Account_Payee_Report;
