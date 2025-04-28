import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const ClientForm = ({ onAddClient, onClose, clientToEdit, onUpdateClient }) => {
  const [formClient, setFormClient] = useState({
    nom: "",
    prenom: "",
    societe: "",
    telephone: "",
    email: "",
    adresse: "",
    motDePasse: ""
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormClient(clientToEdit);
    }
  }, [clientToEdit]);

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // 🔐 8 caractères aléatoires
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormClient({ ...formClient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formClient.nom || !formClient.prenom || !formClient.email) {
      alert("Nom, prénom et email sont obligatoires !");
      return;
    }

    try {
      if (clientToEdit) {
        await axios.put(`http://localhost:3001/api/clients/${formClient._id}`, formClient);
        if (onUpdateClient) onUpdateClient(formClient);
        alert("✅ Client modifié avec succès !");
      } else {
        const motDePasseGenere = generatePassword();
        const clientData = { ...formClient, motDePasse: motDePasseGenere };

        const response = await axios.post("http://localhost:3001/api/clients", clientData);
        if (onAddClient) onAddClient(response.data);
        alert(`✅ Client créé avec succès !\n\n🛡️ Mot de passe généré : ${motDePasseGenere}`);
      }

      setFormClient({
        nom: "",
        prenom: "",
        societe: "",
        telephone: "",
        email: "",
        adresse: "",
        motDePasse: ""
      });

      if (onClose) onClose(); // ✅ ici le bon prop
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("⚠️ Un client avec cet email existe déjà !");
      } else {
        console.error("Erreur :", error);
        alert("❌ Une erreur s'est produite.");
      }
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4 style={{ marginBottom: "20px", fontWeight: "600", textAlign: "center" }}>
          {clientToEdit ? "Modifier le client" : "Nouveau client"}
        </h4>

        <Form onSubmit={handleSubmit}>
          {["nom", "prenom", "societe", "telephone", "adresse", "email"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Control
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formClient[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                style={inputStyle}
                required={["nom", "prenom", "email"].includes(field)}
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button
              type="button"
              onClick={onClose} // ✅ corrigé ici aussi
              style={cancelButtonStyle}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              style={submitButtonStyle}
            >
              {clientToEdit ? "Modifier" : "Créer"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

// 🎨 STYLES
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1050,
};

const modalStyle = {
  backgroundColor: "#fff",
  width: "500px",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
};

const inputStyle = {
  borderRadius: "8px",
  height: "40px",
  fontSize: "14px",
  border: "1px solid #ced4da",
  paddingLeft: "10px",
};

const submitButtonStyle = {
  padding: "10px 24px",
  borderRadius: "6px",
  backgroundColor: "#23BD15",
  borderColor: "#23BD15",
  fontSize: "14px",
  color: "#fff",
  minWidth: "100px",
};

const cancelButtonStyle = {
  padding: "10px 24px",
  borderRadius: "6px",
  backgroundColor: "#61A4D4",
  borderColor: "#61A4D4",
  fontSize: "14px",
  color: "#fff",
  minWidth: "100px",
};

export default ClientForm;
