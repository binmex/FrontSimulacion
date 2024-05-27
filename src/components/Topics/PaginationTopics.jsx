import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

const PaginationTopics = ({ data }) => {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [groups, setGroups] = useState({});
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  useEffect(() => {
    setProducts(data);
  }, []);

  const callGroupsTopics = (rowData) => {
    fetch(
      `https://back-simulacion-por-computador.vercel.app/topics/groups/${rowData._id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setGroups((prevGroups) => ({
          ...prevGroups,
          [rowData._id]: result.data,
        }));
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };
  //mensage cuando se expande
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Grupos Desplegados",
      detail: event.data.name,
      life: 3000,
    });
    callGroupsTopics(event.data);
  };
  //mensage cuando se colapsa
  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Grupos Cerrados",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const rowExpansionTemplate = (data) => {
    const groupsData = groups[data._id] || [];
    return (
      <div className="p-3">
        <h5>Grupos de {data.name}</h5>
        {groupsData.length > 0 ? (
          <DataTable value={groupsData}>
            <Column field="_id" header="ID" />
            <Column field="name" header="Nombre" />
            <Column field="grupo" header="Grupo" />
            <Column field="quotas" header="Cupos" />
          </DataTable>
        ) : (
          <p>No hay grupos disponibles</p>
        )}
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
    <h3>Tabla Materias</h3>
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Palabra de busqueda" />
    </IconField>
  </div>
  );

  return (
    <div className="card p-4 m-4">
      <Toast ref={toast} />
      <DataTable
        filters={filters}
        filterDisplay="row"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        value={products}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={true} style={{ width: "5rem" }} />
        <Column field="name" header="Name" sortable />
        <Column field="aula" header="Aula" sortable />
        <Column field="credits" header="Creditos" sortable />
        <Column field="date_registration" header="Fecha Registro" sortable />
        <Column field="quotas" header="Cupos" sortable />
      </DataTable>
    </div>
  );
};

PaginationTopics.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PaginationTopics;