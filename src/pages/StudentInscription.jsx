import React, { useRef, useState, useEffect } from "react";
import Lateral from "../components/Lateral";
import NavBar from "../components/NavBar";
import { Toast } from "primereact/toast";
import axios from "axios";
import ModalGroups from "../components/inscriptions/ModalAvailableGroups";
import { jwtDecode } from "jwt-decode";

function StudentInscription() {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("authToken"))[0];
  const decodedToken = token ? jwtDecode(token) : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/topics/program/${
            decodedToken.program
          }`
        );
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const findGroups = async (topicId) => {
    setGroups([]);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/topics/groups/${topicId}`
      );
      setGroups(response.data.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Grupos no encontrados",
        detail: "La materia no tiene grupos registrados.",
        life: 3000,
      });
    }
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          <div className="container-fluid">
            <div className="card shadow">
              <div className="card-header py-3">
                <p className="text-primary m-0 fw-bold">Materías disponibles</p>
              </div>
              <div className="card-body">
                <Toast ref={toast} />
                <div
                  className="table-responsive table mt-2"
                  id="dataTable"
                  role="grid"
                  aria-describedby="dataTable_info"
                >
                  {isLoading && (
                    <div className="loading-overlay">
                      <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </div>
                  )}
                  {!isLoading && data.length === 0 && (
                    <div className="no-data-message">
                      No hay materias disponibles...
                    </div>
                  )}
                  {!isLoading && data.length > 0 && (
                    <div
                      className="table-responsive table mt-2"
                      id="dataTable"
                      role="grid"
                      aria-describedby="dataTable_info"
                      style={{ maxHeight: "calc(100vh - 380px)" }}
                    >
                      <table className="table my-0 text-center" id="dataTable">
                        <thead>
                          <tr>
                            <th>Grupos</th>
                            <th>Nombre</th>
                            <th>Aula</th>
                            <th>Creditos</th>
                            <th>Cupos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((topic) => (
                            <tr key={topic._id}>
                              <td>
                                <i
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#availableGroups"
                                  aria-label="Ver grupos"
                                  onClick={() => findGroups(topic._id)}
                                  className="pi pi-angle-right btn"
                                  style={{
                                    border: "none",
                                    padding: 0,
                                  }}
                                ></i>
                              </td>
                              <td>{topic.name}</td>
                              <td>{topic.aula}</td>
                              <td>{topic.credits}</td>
                              <td>{topic.quotas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <ModalGroups groups={groups} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentInscription;
