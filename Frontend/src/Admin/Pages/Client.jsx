import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPen } from "react-icons/fa";
import ClientForm from "../components/ClientForm";
import { Button, Table } from "react-bootstrap";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/clients");
        setClients(res.data);
      } catch (error) {
        console.error("❌ Erreur chargement clients :", error);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = async (clientData) => {
    try {
      const res = await axios.post("http://localhost:3001/api/clients", clientData);
      setClients([...clients, res.data]);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erreur création client :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("❌ Erreur suppression client :", error);
    }
  };

  const handleEditClick = (client) => {
    setClientToEdit(client);
    setShowForm(true);
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      const res = await axios.put(`http://localhost:3001/api/clients/${updatedClient._id}`, updatedClient);
      const updatedList = clients.map((c) => (c._id === res.data._id ? res.data : c));
      setClients(updatedList);
      setShowForm(false);
      setClientToEdit(null);
    } catch (error) {
      console.error("❌ Erreur mise à jour client :", error);
    }
  };

  return (
    <div className="mt-4" style={{ padding: "20px", marginLeft: "250px" }}>
      {/* Formulaire d'ajout ou de modification */}
      {showForm && (
        <ClientForm
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onCancel={() => {
            setShowForm(false);
            setClientToEdit(null);
          }}
          clientToEdit={clientToEdit}
        />
      )}

      {/* ✅ Carte contenant le bouton + tableau */}
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}
      >
       <div className="d-flex justify-content-end mb-3">
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              style={{
                backgroundColor: "#00cc44",     // 🌱 Vert vif
                borderColor: "#00cc44",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              + Ajouter
            </Button>
          </div>


        {/* Tableau des clients */}
        <h6 className="mb-3">📋 Liste des clients</h6>
        <Table bordered hover responsive size="sm" style={{ fontSize: "13px" }}>
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Société</th>
              <th>Téléphone</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.email}</td>
                <td>{client.societe}</td>
                <td>{client.telephone}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    title="Modifier"
                    onClick={() => handleEditClick(client)}
                  >
                    <FaPen />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Supprimer"
                    onClick={() => handleDelete(client._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Aucun client enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ClientPage;
