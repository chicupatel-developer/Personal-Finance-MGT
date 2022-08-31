import React, { useEffect, useState, useRef } from "react";
// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import "./style.css";

import Moment from "moment";

import {
  getBankColor,
  getPayeeTypeName,
  getAmountSign,
  getTransactionTypeDisplay,
  getDaysDifference,
} from "../../../../services/local.service";

const Transactions = ({ myTransactions, textColor, payee }) => {
  const [footerReady, setFooterReady] = useState(false);
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);
  const [daysDiff, setDaysDiff] = useState(0);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (payee !== "0") {
      filterTransactions();
    } else {
      setTransactions([...myTransactions]);
    }

    getTotalInOut();
    setFooterReady(true);
  }, [
    myTransactions,
    payee,
    footerReady,
    daysDiff,
    totalIn,
    totalOut,
    transactions,
  ]);

  const filterTransactions = () => {
    var selectedTrs = [];
    myTransactions.filter((tr) => {
      if (Number(tr.payeeId) === Number(payee)) {
        selectedTrs.push(tr);
      }
    });
    setTransactions([...selectedTrs]);
  };

  const displayEntity = (cell, row) => {
    return (
      <div>
        <span>
          {row.transactionType === 0 && row.sourceId && row.payeeId === 0 ? (
            <span>{row.sourceName}</span>
          ) : (
            <span>
              {cell} - [{getPayeeTypeName(row.payeeType)}]
            </span>
          )}
        </span>
      </div>
    );
  };
  const displayAmount = (cell, row) => {
    return (
      <div>
        <span>
          {getAmountSign(row.transactionType)}&nbsp;
          {cell}
        </span>
      </div>
    );
  };
  const displayDate = (cell) => {
    if (cell === null || cell === "") return "N/A";
    else {
      return Moment(cell).format("DD-MMM-YYYY");
    }
  };
  const displayTransactionType = (cell, row) => {
    return getTransactionTypeDisplay(row.transactionType);
  };

  const columns = [
    {
      dataField: "bankTransactionId",
      text: "#",
      sort: true,
    },
    {
      dataField: "transactionTypeDisplay",
      text: "Type",
      sort: true,
      formatter: (cell, row) => displayTransactionType(cell, row),
    },
    {
      dataField: "payeeName",
      text: "Entity",
      sort: true,
      formatter: (cell, row) => displayEntity(cell, row),
    },
    {
      dataField: "amountPaid",
      text: "$Amount$",
      sort: true,
      formatter: (cell, row) => displayAmount(cell, row),
    },
    {
      dataField: "currentBalance",
      text: "$Current$",
      sort: true,
    },
    {
      dataField: "lastBalance",
      text: "$Last$",
      sort: true,
    },
    {
      dataField: "transactionDate",
      text: "Date",
      sort: true,
      formatter: (cell, row) => displayDate(cell, row),
    },
  ];

  const getTransactionStyle = (row, rowIdx) => {
    return { color: textColor };
  };

  const getTotalInOut = () => {
    var totalIn = 0;
    var totalOut = 0;
    transactions.map((tr, i) => {
      if (tr.transactionType === 0) totalIn += tr.amountPaid;
      else if (tr.transactionType === 1) totalOut += tr.amountPaid;
    });
    console.log(totalIn, totalOut, getDaysDifference(minDate, maxDate));
    setTotalIn(totalIn);
    setTotalOut(totalOut);
    setDaysDiff(getDaysDifference(minDate, maxDate));
  };
  const maxDate = new Date(
    Math.max(
      ...transactions.map((element) => {
        return new Date(element.transactionDate);
      })
    )
  );
  const minDate = new Date(
    Math.min(
      ...transactions.map((element) => {
        return new Date(element.transactionDate);
      })
    )
  );

  return (
    <div>
      {transactions && transactions.length > 0 ? (
        <div>
          <BootstrapTable
            bootstrap4
            keyField="bankTransactionId"
            data={transactions}
            columns={columns}
            rowStyle={getTransactionStyle}
            pagination={paginationFactory({ sizePerPage: 5 })}
            filter={filterFactory()}
          />

          {console.log(daysDiff)}
          {footerReady && (
            <div
              className="transactionFooter"
              style={{
                color: textColor,
              }}
            >
              <h5>
                Total In +${totalIn} / {daysDiff} Days
              </h5>
              <h5>
                Total Out -${totalOut} / {daysDiff} Days
              </h5>
            </div>
          )}

          <hr />
        </div>
      ) : (
        <div className="noTrans">No Transactions!</div>
      )}
    </div>
  );
};

export default Transactions;
