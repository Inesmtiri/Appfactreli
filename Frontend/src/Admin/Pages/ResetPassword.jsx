import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("❌ Les mots de passe ne correspondent pas.");
    }

    try {
      await axios.post(`http://localhost:3001/api/auth/reset-password/${token}`, {
        password,
      });

      setMessage("✅ Mot de passe réinitialisé !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Code invalide ou expiré.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#167db8" }}>
      <div className="text-center fst-italic text-white position-absolute top-0 mt-4 fs-2 fw-bold">Facterli</div>

      <div className="bg-white p-5 rounded-5 shadow-lg text-center"
        style={{ width: "480px", height: "520px" }}>
        <h2 className="fs-2 fst-italic fw-semibold mb-4">Nouveau mot de passe</h2>

        {message && (
          <div className={`alert ${message.startsWith("❌") ? "alert-danger" : "alert-success"} p-2`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="form-control mb-4 p-3 rounded-4"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn btn-success w-100 p-3 rounded-4" type="submit">
            Réinitialiser
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
