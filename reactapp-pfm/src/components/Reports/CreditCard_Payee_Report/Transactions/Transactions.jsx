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

const Transactions = ({
  myTransactions,
  textColor,
  payee,
  filterOnDates,
  startDate,
  endDate,
}) => {
  const [footerReady, setFooterReady] = useState(false);
  const [totalInAc, setTotalInAc] = useState(0);
  const [totalOutAc, setTotalOutAc] = useState(0);
  const [daysDiffAc, setDaysDiffAc] = useState(0);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (payee !== "0") {
      filterTransactions();
    } else {
      filterTransactionsOnlyByDates();
    }
  }, [myTransactions]);

  useEffect(() => {
    getTotalInOutAc();
    setFooterReady(true);
  }, [totalInAc, totalOutAc, daysDiffAc, footerReady, transactions]);

  // filter by payee & dates
  const filterTransactions = () => {
    var selectedTrs = [];
    // filter by payee
    myTransactions.filter((tr) => {
      if (Number(tr.payeeId) === Number(payee)) {
        selectedTrs.push(tr);
      }
    });

    if (filterOnDates) {
      // filter by dates
      if (selectedTrs.length > 0) {
        var selectedTrsByDates = [];
        selectedTrs.filter((tr) => {
          if (
            tr.transactionDate >= startDate &&
            tr.transactionDate <= endDate
          ) {
            selectedTrsByDates.push(tr);
          }
        });
        setTransactions([...selectedTrsByDates]);
      } else {
        setTransactions([]);
      }
    } else {
      setTransactions([...selectedTrs]);
    }
  };

  // filter by only dates
  const filterTransactionsOnlyByDates = () => {
    console.log(startDate, endDate);
    if (filterOnDates) {
      // filter by dates
      var selectedTrsByDates = [];
      myTransactions.filter((tr) => {
        if (
          new Date(tr.transactionDate) >= new Date(startDate) &&
          new Date(tr.transactionDate) <= new Date(endDate)
        ) {
          console.log("match : ", tr);
          selectedTrsByDates.push(tr);
        }
      });
      setTransactions([...selectedTrsByDates]);
    } else {
      setTransactions([...myTransactions]);
    }
  };

  const displayEntity = (cell, row) => {
    return (
      <div>
        <span>
          {row.transactionType === 0 && row.bankId && row.payeeId === 0 ? (
            <span>
              {row.bankName} - [{row.accountNumber}]
            </span>
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
    return getTransactionTypeDisplay(cell);
  };

  const columns = [
    {
      dataField: "creditCardTransactionId",
      text: "#",
      sort: true,
    },
    {
      dataField: "transactionType",
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

  const getTotalInOutAc = () => {
    var totalIn = 0;
    var totalOut = 0;
    transactions.map((tr, i) => {
      if (tr.transactionType === 0) totalIn += tr.amountPaid;
      else if (tr.transactionType === 1) totalOut += tr.amountPaid;
    });
    console.log(totalIn, totalOut, getDaysDifference(minDate, maxDate));
    setTotalInAc(totalIn);
    setTotalOutAc(totalOut);
    setDaysDiffAc(getDaysDifference(minDate, maxDate));
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
            keyField="creditCardTransactionId"
            data={transactions}
            columns={columns}
            rowStyle={getTransactionStyle}
            pagination={paginationFactory({ sizePerPage: 10 })}
            filter={filterFactory()}
          />

          {console.log(daysDiffAc)}
          {footerReady && (
            <div
              className="transactionFooter"
              style={{
                color: textColor,
              }}
            >
              <h5>
                Total In +${totalInAc} / {daysDiffAc} Days
              </h5>
              <h5>
                Total Out -${totalOutAc} / {daysDiffAc} Days
              </h5>
            </div>
          )}
        </div>
      ) : (
        <div className="noTrans">No Transactions!</div>
      )}
    </div>
  );
};

export default Transactions;
