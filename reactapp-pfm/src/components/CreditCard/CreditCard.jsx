import React, { useState, useEffect } from "react";
import "./style.css";
import PayeeService from "../../services/payee.service";
import CCService from "../../services/cc.service";
import { getPayeeIcon, getCCTypeColor } from "../../services/local.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

const CreditCard = () => {
  let navigate = useNavigate();

  const [creditcards, setCreditcards] = useState([]);
  const allCCs = () => {
    CCService.allCCs()
      .then((response) => {
        console.log(response.data);
        setCreditcards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    allCCs();
  }, []);

  const displayCreditCardName = (cell, row) => {
    return (
      <div>
        <span>
          <i className={getPayeeIcon(row.payeeType)}></i> {cell}
        </span>
      </div>
    );
  };
  const displayBalance = (cell, row) => {
    return (
      <div>
        {row.payeeType === 3 ? (
          <span>
            {Number(cell) > 0 ? (
              <span style={{ color: "green" }}>
                <b>{cell}</b>
              </span>
            ) : (
              <span style={{ color: "red" }}>
                <b>{cell}</b>
              </span>
            )}
          </span>
        ) : (
          <span>{cell}</span>
        )}
      </div>
    );
  };

  const getRowStyle = (row, rowIdx) => {
    return {
      color: getCCTypeColor(row.creditCardName),
      fontSize: "20px",
    };
  };
  const columns = [
    {
      dataField: "creditCardName",
      text: "Name",
      sort: true,
      formatter: (cell, row) => displayCreditCardName(cell, row),
    },
    {
      dataField: "creditCardNumber",
      text: "A/C Number",
      sort: true,
    },
    {
      dataField: "balance",
      text: "Balance",
      sort: true,
      formatter: (cell, row) => displayBalance(cell, row),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];
  const displayActionBtn = (cell, row) => {
    return (
      <div>
        {" "}
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => ccTransactionBegin(e, row)}
        >
          PAY BY &nbsp;<i className="bi bi-credit-card"></i>
        </Button>
      </div>
    );
  };
  const ccTransactionBegin = (e, cc) => {
    // if balance is 0
    if (cc.balance <= 0) {
      console.log("balance is zero!");
    } else {
      var ccTransaction = {
        creditCardId: cc.creditCardId,
        balance: cc.balance,
        ccAccountNumber: cc.creditCardNumber,
      };
      console.log(ccTransaction);
    }
  };
  return (
    <div className="container">
      <div className="mainHeader">PAY BY... Credit-Cards</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto">
          {creditcards && creditcards.length > 0 ? (
            <BootstrapTable
              bootstrap4
              keyField="creditCardId"
              data={creditcards}
              columns={columns}
              rowStyle={getRowStyle}
              pagination={paginationFactory({ sizePerPage: 5 })}
              filter={filterFactory()}
            />
          ) : (
            <div className="noCCs">No Credit-Cards!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
