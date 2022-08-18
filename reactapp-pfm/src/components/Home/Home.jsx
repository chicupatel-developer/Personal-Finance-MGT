import React from "react";
import "./style.css";

const Home = () => {
  return (
    <div className="mainContainer">
      <div className="homePageHeader">
        <h3>Personal Finance Management</h3>
        <h5>Web API Core / EF Core / SQL Server / Angular / React </h5>
      </div>
      <hr />
      <p></p>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div>
            <div className="titleHeader">
              <b>Managing Process,,,</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>Source To Bank-Account Transaction</li>
                <li>Bank-Account To Payee Transaction</li>
                <li>Bank-Account To CreditCard Transaction</li>
                <li>CreditCard To Payee Transaction</li>
              </ul>
            </div>
            <p></p>
          </div>
        </div>
        <div className="col-md-6 mx-auto">
          <div>
            <div className="titleHeader">
              <b>Tracking Process By Reports,,,Charts,,,</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>Custom Date - Range Selection For Any Report</li>
                <li>Account (Selected) - To - Payee (Selected) Report</li>
                <li>Account (Selected) - To - Payees (All) Report</li>
                <li>Accounts (All) - To - Payee (Selected) Report</li>
                <li>Accounts (All) - To - Payees (All) Report</li>
                <li>Credit-Card (Selected) - To - Payee (Selected) Report</li>
                <li>Credit-Card (Selected) - To - Payees (All) Report</li>
                <li>Bank - Account Health Chart</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
