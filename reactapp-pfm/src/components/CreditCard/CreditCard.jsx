import React, { useState, useEffect } from "react";
import "./style.css";
import PayeeService from "../../services/payee.service";
import CCService from "../../services/cc.service";
import { getPayeeIcon, getPayeeTypeName } from "../../services/local.service";
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
        setCreditcards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    allCCs();
  }, []);

  const displayPayeeId = (cell, row) => {
    return (
      <div>
        <span>
          <i className={getPayeeIcon(row.payeeType)}></i> {cell}
        </span>
      </div>
    );
  };
  const displayPayeeType = (cell, row) => {
    return (
      <div>
        <span>{getPayeeTypeName(cell)}</span>
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

  const columns = [
    {
      dataField: "payeeId",
      text: "#",
      sort: true,
      formatter: (cell, row) => displayPayeeId(cell, row),
    },
    {
      dataField: "payeeName",
      text: "Payee",
      sort: true,
    },
    {
      dataField: "payeeACNumber",
      text: "A/C No",
      sort: true,
    },
    {
      dataField: "payeeType",
      text: "Type",
      sort: true,
      formatter: (cell, row) => displayPayeeType(cell, row),
    },
    {
      dataField: "balance",
      text: "Balance",
      sort: true,
      formatter: (cell, row) => displayBalance(cell, row),
    },
  ];
  return (
    <div className="container">
      <div className="mainHeader">Payees</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto">
          {creditcards && creditcards.length > 0 ? (
            <BootstrapTable
              bootstrap4
              keyField="payeeId"
              data={creditcards}
              columns={columns}
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
