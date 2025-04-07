import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/utilisateur");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur de chargement :", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEditUser = async (e) => {
    e.preventDefault();

    const { nom, prenom, email, poste } = formData;
    if (!nom || !prenom || !email || !poste) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      if (editIndex !== null) {
        const id = users[editIndex]._id;
        await axios.put(`http://localhost:3001/api/utilisateur/${id}`, formData);
      } else {
        await axios.post("http://localhost:3001/api/utilisateur", formData);
      }
      setFormData({ nom: "", prenom: "", email: "", poste: "" });
      setEditIndex(null);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err.message);
    }
  };

  const handleDeleteUser = async (index) => {
    const confirmDelete = window.confirm("Êtes-vous sûr ?");
    if (!confirmDelete) return;

    try {
      const id = users[index]._id;
      await axios.delete(`http://localhost:3001/api/utilisateur/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression :", err.message);
    }
  };

  const handleEditUser = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
  };

  return (
    <div className="mt-4" style={{ padding: "20px", marginLeft: "250px" }}>
      <div className="card mb-4 shadow-sm mx-auto" style={{ maxWidth: "1150px" }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title fw-semibold">
              {editIndex !== null ? "✏️ Modifier un utilisateur" : "➕ Ajouter un utilisateur"}
            </h5>
          </div>

          <form onSubmit={handleAddOrEditUser}>
            <div className="row g-2 align-items-end">
              <div className="col">
                <input name="nom" value={formData.nom} onChange={handleChange} className="form-control" placeholder="Nom" />
              </div>
              <div className="col">
                <input name="prenom" value={formData.prenom} onChange={handleChange} className="form-control" placeholder="Prénom" />
              </div>
              <div className="col">
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email" />
              </div>
              <div className="col">
                <input name="poste" value={formData.poste} onChange={handleChange} className="form-control" placeholder="Poste" />
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className={`btn w-100 fw-bold text-white`}
                  style={{ backgroundColor: "#00cc44", boxShadow: "0px 2px 6px rgba(0,0,0,0.15)" }}
                >
                  <i className={`bi ${editIndex !== null ? "bi-pencil-square" : "bi-plus-circle"} me-1`}></i>
                  {editIndex !== null ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mx-auto shadow-sm" style={{ maxWidth: "1150px" }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title fw-semibold">📋 Liste des utilisateurs</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle" style={{ fontSize: "15px" }}>
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Poste</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>{user.poste}</td>
                    <td className="text-center">
                      <div className="btn-group">
                        <button onClick={() => handleEditUser(index)} className="btn btn-sm btn-outline-primary me-1">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button onClick={() => handleDeleteUser(index)} className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">Aucun utilisateur trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utilisateurs;
