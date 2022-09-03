import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import EntityMonitorService from "../../services/entity.monitor.service";
import BankService from "../../services/bank.service";
import AccountService from "../../services/account.service";

import {
  getAccountType,
  getBankColor,
  getPayeeTypeName,
  getAmountSign,
  getTransactionTypeDisplay,
  getMonthName,
} from "../../services/local.service";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Moment from "moment";

// google chart api
import Chart from "react-google-charts";

const Monitor_Account_Monthly = () => {
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [bank, setBank] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  // chart
  const [chartData, setChartData] = useState([[]]);
  // month v/s $ [In] [Out]
  // display google chart
  const displayAccountProgress = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("getting report !");

      var accountMonthlyRequest = {
        bankId: Number(form.bankId),
        accountId: Number(form.accountId),
      };
      EntityMonitorService.monitorAccountMonthly(accountMonthlyRequest)
        .then((response) => {
          console.log(response.data);

          if (response.data.length < 1) {
            setChartData([]);
          } else {
            var chartDatas_ = [];
            var firstItem = ["Month", "+$ IN", "-$ OUT"];
            chartDatas_.push(firstItem);
            setChartData(chartDatas_);

            response.data.map((item, i) => {
              setChartData((oldValues) => [
                ...oldValues,
                [
                  // getMonthName(Number(item.month)) + "",
                  getMonthName(Number(item.month)),
                  item.tranType === 0 ? item.total : 0,
                  item.tranType === 1 ? item.total : 0,
                ],
              ]);
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  const getBankAccounts = (bankId) => {
    AccountService.getBankAccounts(bankId)
      .then((response) => {
        console.log(response.data.accounts);
        setAccounts(response.data.accounts);
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

  const getBankName = (bankId) => {
    let obj = banks.find((x) => x.bankId === bankId);
    return obj.bankName;
  };
  const setField = (field, value) => {
    if (field === "bankId") {
      setBank({
        ...bank,
        bankId: Number(value),
        bankName: getBankName(Number(value)),
      });
      getBankAccounts(Number(value));
    }
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
    const { bankId, accountId } = form;
    const newErrors = {};

    if (!bankId || bankId === "") newErrors.bankId = "Bank is Required!";
    if (!accountId || accountId === "")
      newErrors.accountId = "Account is Required!";

    return newErrors;
  };
  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
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
          {getAccountType(dt.accountType)} - [{dt.accountNumber}]
        </option>
      );
    });
  };

  const getBankStyle = (bankName) => {
    var bankColor = getBankColor(bankName);
    return { color: bankColor };
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
                    <h3>Account Monitoring</h3>
                  </div>
                  <div className="col-md-3 mx-auto"></div>
                </div>
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-md-5 mx-auto">
                      <Form.Group controlId="bankId">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.bankId}
                          onChange={(e) => {
                            setField("bankId", e.target.value);
                          }}
                        >
                          <option value="">---Select Bank---</option>
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
                          <option value="">---Select Account---</option>
                          {renderOptionsForAccountList()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountId}
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
                      onClick={(e) => displayAccountProgress(e)}
                    >
                      Operation Progress [google Chart api]
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
          <div className="col-md-12 mx-auto">
            {bank && bank.bankName && (
              <div
                className="bankTitleHeader"
                style={getBankStyle(bank.bankName)}
              >
                <h1>{bank.bankName}</h1>
                <p></p>
                <hr />
                <p></p>
              </div>
            )}
          </div>

          <p></p>
          <hr />
          <p></p>
          <div className="container">
            {chartData && chartData.length > 1 ? (
              <Chart
                // width={"700px"}
                // height={"320px"}
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={chartData}
                options={{
                  title: "Month v/s $ [+In] [-Out]",
                  chartArea: { width: "70%" },
                  hAxis: {
                    title: "$ [IN] [OUT]",
                    minValue: 0,
                    textStyle: {
                      fontSize: 12,
                      color: "black",
                      bold: true,
                      italic: true,
                    },
                  },
                  vAxis: {
                    title: "Month",
                    textStyle: {
                      fontSize: 14,
                      color: "black",
                      bold: true,
                      italic: true,
                    },
                  },
                  colors: ["green", "red"],
                }}
                rootProps={{ "data-testid": "1" }}
              />
            ) : (
              <div className="noContent">Chart-Data Not Found !</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor_Account_Monthly;
