import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Inscription = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    telephone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/users/register", formData);

      alert("Inscription réussie !");
      console.log("✅ Données envoyées :", res.data);

      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirection générique
      window.location.href = "/about";

      // Réinitialiser
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        password: "",
        telephone: "",
      });

    } catch (err) {
      console.error("❌ Erreur d'inscription :", err.response?.data?.message || err.message);
      alert("Erreur lors de l'inscription : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* Partie gauche - Formulaire */}
        <div
          className="col-md-6 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "#fff", padding: "50px" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h2 className="text-center fw-normal fst-italic mb-4">Inscription</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  className="form-control"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Mot de passe *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Téléphone *</label>
                <div className="input-group">
                  <span className="input-group-text">+216</span>
                  <input
                    type="tel"
                    name="telephone"
                    className="form-control"
                    placeholder="-- --- ---"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold text-white"
                style={{
                  backgroundColor: "#00B400",
                  padding: "10px",
                }}
              >
                C'est parti !
              </button>
            </form>
          </div>
        </div>

        {/* Partie droite - Étapes */}
        <div
          className="col-md-6 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#167DB8",
            padding: "50px",
            minHeight: "100vh",
          }}
        >
          <div className="w-100 text-center text-white">
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ maxWidth: "300px", margin: "0 auto" }}
            >
              <div className="d-flex align-items-center mb-5">
                <div
                  className="rounded-circle bg-light text-dark fw-bold d-flex justify-content-center align-items-center"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  1
                </div>
                <div className="ms-3 text-start">
                  <p className="fw-semibold mb-0">Entrer vos informations</p>
                </div>
              </div>

              <div
                style={{
                  width: "2px",
                  height: "40px",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              ></div>

              <div className="d-flex align-items-center mt-5">
                <div
                  className="rounded-circle bg-light text-dark fw-bold d-flex justify-content-center align-items-center"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  2
                </div>
                <div className="ms-3 text-start">
                  <p className="fw-semibold mb-0">Dites-nous votre activité</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
