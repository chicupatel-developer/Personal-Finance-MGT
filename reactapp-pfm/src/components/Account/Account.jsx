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

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="container">
      <div className="mainHeader">Accounts</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto"></div>
      </div>
    </div>
  );
};

export default Payee;
