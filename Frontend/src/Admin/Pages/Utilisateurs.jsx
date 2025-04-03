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

  // 🔁 Récupérer la liste des utilisateurs
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

  // ✏️ Modifier les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ➕ Ajouter ou modifier un utilisateur
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

  // 🗑️ Supprimer un utilisateur
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

  // 🖊️ Pré-remplir le formulaire pour modification
  const handleEditUser = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      {/* Formulaire */}
      <div className="card mb-4 mx-auto" style={{ maxWidth: "1000px" }}>
        <div className="card-body">
          <h5 className="card-title mb-3">
            {editIndex !== null ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          </h5>

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
                <button type="submit" className={`btn ${editIndex !== null ? "btn-warning" : "btn-vert"} w-100`}>
                  <i className={`bi ${editIndex !== null ? "bi-pencil-square" : "bi-plus-circle"} me-1`}></i>
                  {editIndex !== null ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Liste */}
      <div className="card mx-auto" style={{ maxWidth: "1000px" }}>
        <div className="card-body">
          <h5 className="card-title mb-3">Tous les utilisateurs</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
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
