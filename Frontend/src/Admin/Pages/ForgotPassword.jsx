import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [message, setMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  // 📩 Envoi du code par email
  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:3001/api/auth/forgot-password", { email });

      setCodeSent(true);
      setMessage("📩 Code de vérification envoyé à votre adresse email.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur est survenue lors de l'envoi.");
    }
  };

  // ✅ Vérification du code entré
  const handleVerifyCode = (e) => {
    e.preventDefault();

    if (!code || !confirmCode) {
      return setMessage("⚠️ Merci de remplir les deux champs.");
    }

    if (code !== confirmCode) {
      return setMessage("❌ Les codes ne correspondent pas.");
    }

    navigate(`/reset-password?token=${code}`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#167db8" }}>
      <div className="text-center fst-italic text-white position-absolute top-0 mt-4 fs-2 fw-bold">Facterli</div>

      <div className="bg-white p-5 rounded-5 shadow-lg text-center"
        style={{ width: "480px", height: codeSent ? "640px" : "500px" }}>
        <h2 className="fs-2 fst-italic fw-semibold mb-4">Mot de passe oublié</h2>

        {message && (
          <div className={`alert ${message.startsWith("❌") ? "alert-danger" : "alert-info"} p-2 rounded-3`}>
            {message}
          </div>
        )}

        <form onSubmit={codeSent ? handleVerifyCode : handleSendCode}>
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={codeSent}
          />

          {codeSent && (
            <>
              <input
                className="form-control mb-3 p-3 rounded-4"
                type="text"
                placeholder="Code de vérification"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <input
                className="form-control mb-3 p-3 rounded-4"
                type="text"
                placeholder="Confirmer le code"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                required
              />
            </>
          )}

          <button className="btn btn-primary w-100 p-3 rounded-4" type="submit">
            {codeSent ? "Vérifier le code" : "Envoyer le code"}
          </button>
        </form>

        <div className="mt-3">
          <Link to="/login" className="text-primary text-decoration-none">← Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
