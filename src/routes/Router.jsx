import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTopic from "../pages/ListTopic";
import ListInscription from "../pages/ListInscription";
import ListStudents from "../pages/ListStudents";
import ListGroups from "../pages/ListGroups";
import Login from "../pages/Login";
import SecondValidate from "../pages/SecondValidate";
import SaveStudent from "../pages/SaveStudent";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" Component={Login} />
        {/* <Route exact path="/" Component={Dashboard} /> */}
        <Route exact path="/secondValidation" Component={SecondValidate} />
        <Route exact path="/listTopic" Component={ListTopic} />
        <Route exact path="/listStudents" Component={ListStudents} />
        <Route exact path="/listInscription" Component={ListInscription} />
        <Route exact path="/listGroups" Component={ListGroups} />
        <Route exact path="/saveStudent" Component={SaveStudent} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
