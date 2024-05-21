import React from "react";
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import Pagination from "../components/Pagination";

function App() {
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <Pagination/>
        </div>
      </div>
    </div>
  );
}

export default App;
