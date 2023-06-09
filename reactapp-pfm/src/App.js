import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Bank from "./components/Bank/Bank";
import Bank_Create from "./components/Bank_Create/Bank_Create";
import Bank_Edit from "./components/Bank_Edit/Bank_Edit";
import Bank_Account_List from "./components/Bank_Account_List/Bank_Account_List";
import Payee from "./components/Payee/Payee";
import Payee_Create from "./components/Payee_Create/Payee_Create";
import Payee_Edit from "./components/Payee_Edit/Payee_Edit";
import Bank_Transaction_Add from "./components/Bank_Transaction_Add/Bank_Transaction_Add";
import Source_To_Bank_Transaction from "./components/Source_To_Bank_Transaction/Source_To_Bank_Transaction";
import Account_Statement_All from "./components/Account_Statement_All/Account_Statement_All";
import Account from "./components/Account/Account";
import Account_Create from "./components/Account_Create/Account_Create";
import Account_Edit from "./components/Account_Edit/Account_Edit";
import CreditCard from "./components/CreditCard/CreditCard";
import CreditCard_Transaction from "./components/CreditCard_Transaction/CreditCard_Transaction";
import Account_Payee_Report from "./components/Reports/Account_Payee_Report/Account_Payee_Report";
import CreditCard_Payee_Report from "./components/Reports/CreditCard_Payee_Report/CreditCard_Payee_Report";
import Monitor_Account_Monthly from "./components/Monitor_Account_Monthly/Monitor_Account_Monthly";
import Code_Length_Report from "./components/Code_Length_Report/Code_Length_Report";

function App() {
  return (
    <div className="App">
      <div className="main-wrapper">
        <Router>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/bank-create" element={<Bank_Create />} />
            <Route path="/bank-edit/:id" element={<Bank_Edit />} />
            <Route
              path="/bank-account-list/:id"
              element={<Bank_Account_List />}
            />
            <Route path="/payee" element={<Payee />} />
            <Route path="/payee-create" element={<Payee_Create />} />
            <Route path="/payee-edit/:id" element={<Payee_Edit />} />
            <Route
              path="/bank-transaction-add"
              element={<Bank_Transaction_Add />}
            />
            <Route
              path="/source-to-bank-transaction"
              element={<Source_To_Bank_Transaction />}
            />
            <Route
              path="/account-statement-all"
              element={<Account_Statement_All />}
            />
            <Route path="/account" element={<Account />} />
            <Route path="/account-create" element={<Account_Create />} />
            <Route path="/account-edit/:id" element={<Account_Edit />} />
            <Route path="/creditcard" element={<CreditCard />} />
            <Route
              path="/credit-card-transaction"
              element={<CreditCard_Transaction />}
            />
            <Route
              path="/account-payee-report"
              element={<Account_Payee_Report />}
            />
            <Route
              path="/creditcard-payee-report"
              element={<CreditCard_Payee_Report />}
            />
            <Route
              path="/account-monitor"
              element={<Monitor_Account_Monthly />}
            />
            <Route
              path="/code-length-report"
              element={<Code_Length_Report />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;
