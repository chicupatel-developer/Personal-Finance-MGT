import React, { useState, useEffect } from "react";
import "./style.css";
import PayeeService from "../../services/payee.service";
import { getBankColor } from "../../services/local.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

const Payee = () => {
  let navigate = useNavigate();

  const [payees, setPayees] = useState([]);

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

  const columns = [
    {
      dataField: "payeeId",
      text: "#",
      sort: true,
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
    },
    {
      dataField: "balance",
      text: "Balance",
      sort: true,
    },
    {
      dataField: "description",
      text: "Desc",
      sort: true,
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
        <div className="col-md-2 mx-auto"></div>
        <div className="col-md-8 mx-auto">
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
              pagination={paginationFactory({ sizePerPage: 5 })}
              filter={filterFactory()}
            />
          ) : (
            <div className="noPayees">No Payees!</div>
          )}
        </div>
        <div className="col-md-2 mx-auto"></div>
      </div>
    </div>
  );
};

export default Payee;
