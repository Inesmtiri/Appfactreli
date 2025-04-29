import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      const { role } = res.data;
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ Redirection selon le rôle
      if (role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/client/dashboard";
      }
    } catch (err) {
      console.error("❌ Erreur de connexion :", err);
      setMessage("❌ Email ou mot de passe incorrect !");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#167db8" }}
    >
      {/* Logo / titre */}
      <div className="text-center fst-italic text-white position-absolute top-0 mt-4 fs-2 fw-bold">
        Facterli
      </div>

      {/* Formulaire */}
      <div
        className="bg-white p-5 rounded-5 shadow-lg text-center d-flex flex-column justify-content-center"
        style={{ width: "480px", height: "500px" }}
      >
        <h2 className="fs-2 fst-italic fw-semibold mb-4">Connexion</h2>

        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-vert w-100 p-3 rounded-4" type="submit">
            Connexion
          </button>
        </form>

        {/* Liens vers les autres pages */}
        <div className="d-flex justify-content-between mt-4">
          <Link to="/forgotpassword" className="text-primary text-decoration-none">
            Mot de passe oublié ?
          </Link>
          <Link to="/inscription" className="text-primary text-decoration-none">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
