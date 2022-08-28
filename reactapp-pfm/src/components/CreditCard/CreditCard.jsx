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

  return <div></div>;
};

export default CreditCard;
