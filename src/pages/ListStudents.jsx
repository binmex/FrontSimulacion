import React from 'react'
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import Table from '../components/students/StudentsTable';

const ListStudents = () => {
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <Table />
        </div>
      </div>
    </div>
  )
}

export default ListStudents