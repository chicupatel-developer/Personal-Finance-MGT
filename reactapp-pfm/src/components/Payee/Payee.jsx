import React, { useState, useEffect } from "react";
import "./style.css";
import PayeeService from "../../services/payee.service";
import { getPayeeIcon, getPayeeTypeName } from "../../services/local.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

const Payee = () => {
  let navigate = useNavigate();

  const [payees, setPayees] = useState([]);
  const [payeeClass, setPayeeClass] = useState("");

  const getAllPayees = () => {
    PayeeService.allPayees()
      .then((response) => {
        setPayees(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllPayees();
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
  const getRowStyle = (row, rowIdx) => {
    if (row.payeeType === 3) return { color: "blue", fontSize: "20px" };
    else return { color: "black" };
  };
  const displayActionBtn = (cell, row) => {
    return (
      <div>
        {" "}
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => editPayee(e, row.payeeId)}
        >
          <i className="bi bi-pencil-square"></i>
        </Button>
      </div>
    );
  };
  const editPayee = (e, payeeId) => {
    console.log("edit payee : ", payeeId);
    navigate("/payee-edit/" + payeeId);
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
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const createNewPayee = () => {
    navigate("/payee-create");
  };

  return (
    <div className="container">
      <div className="mainHeader">Payees</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto">
          <Button
            className="btn btn-primary"
            type="button"
            onClick={(e) => createNewPayee(e)}
          >
            <i className="bi bi-plus-circle"></i> Payee
          </Button>
          <p></p>
          {payees && payees.length > 0 ? (
            <BootstrapTable
              bootstrap4
              keyField="payeeId"
              data={payees}
              columns={columns}
              rowStyle={getRowStyle}
              pagination={paginationFactory({ sizePerPage: 5 })}
              filter={filterFactory()}
            />
          ) : (
            <div className="noPayees">No Payees!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payee;
