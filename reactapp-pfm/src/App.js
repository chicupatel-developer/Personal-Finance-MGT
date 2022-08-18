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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;
