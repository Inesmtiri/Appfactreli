import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function About() {
  const [form, setForm] = useState({
    nomEntreprise: "",
    activiteEntreprise: "",
    descriptionEntreprise: "",
    chiffreAffaireEstime: "",
    emailEntreprise: "",
    phone: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3001/api/about", form);
      alert("✅ Entreprise enregistrée !");
      navigate("/Dashboard");
    } catch (err) {
      console.error("❌ Erreur :", err.message);
      alert("Erreur lors de l'envoi !");
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Partie gauche : formulaire */}
      <div className="w-50 d-flex flex-column justify-content-center p-5 bg-white">
        <h2 className="fs-3 fst-italic fw-semibold mb-4 text-center">
          Votre entreprise
        </h2>

        <form>
          <input
            className="form-control mb-3"
            name="nomEntreprise"
            placeholder="Nom d’entreprise *"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="activiteEntreprise"
            placeholder="Que fait votre entreprise ? *"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="descriptionEntreprise"
            placeholder="Comment décrivez-vous votre entreprise ? *"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="chiffreAffaireEstime"
            placeholder="Chiffre d’affaire estimé cette année ? *"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="emailEntreprise"
            type="email"
            placeholder="Email d'entreprise *"
            onChange={handleChange}
            required
          />

          <div className="input-group mb-4">
            <span className="input-group-text">+216</span>
            <input
              className="form-control"
              name="phone"
              type="tel"
              placeholder="--- --- ---"
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-secondary w-50"
              onClick={() => navigate("/Inscription")}
            >
              Retour
            </button>

            <button
              type="button"
              className="btn text-white fw-bold w-50"
              onClick={handleSubmit}
              style={{ backgroundColor: "#00B400" }}
            >
              C'est parti !
            </button>
          </div>
        </form>
      </div>

      {/* Partie droite : étapes */}
      <div
        className="w-50 text-white d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#167db8" }}
      >
        <div className="position-relative d-flex flex-column align-items-start px-5">
          <div className="d-flex align-items-center mb-4">
            <div
              className="d-flex justify-content-center align-items-center bg-white text-primary rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                fontWeight: "bold",
                color: "#167db8"
              }}
            >
              1
            </div>
            <span className="ms-3">Entrez vos informations.</span>
          </div>

          <div
            className="border-start border-white position-absolute"
            style={{ height: "50px", left: "20px", top: "40px" }}
          ></div>

          <div className="d-flex align-items-center mt-4">
            <div
              className="d-flex justify-content-center align-items-center bg-white text-primary rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                fontWeight: "bold",
                color: "#167db8"
              }}
            >
              2
            </div>
            <span className="ms-3">Dites-nous votre activité.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
