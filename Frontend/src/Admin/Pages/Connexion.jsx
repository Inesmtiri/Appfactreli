import "bootstrap/dist/css/bootstrap.min.css";

export default function Connexion() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#167db8" }}>
      {/* Logo ou titre */}
      <div className="text-center fst-italic text-white position-absolute top-0 mt-4 fs-2 fw-bold">Facterli</div>

      {/* Boîte de connexion */}
      <div
        className="bg-white p-5 rounded-5 shadow-lg text-center d-flex flex-column justify-content-center"
        style={{ width: "480px", height: "500px" }} // Plus large et plus long
      >
        <h2 className="fs-2 fst-italic fw-semibold mb-4">Connexion</h2>
        <form>
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="email"
            placeholder="Email"
          />
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="password"
            placeholder="Mot de passe"
          />
          <button className="btn btn-vert w-100 mb-4 p-3 rounded-4">
            Connexion
          </button>
        </form>
        <div className="d-flex justify-content-between">
          <span className="text-primary">Mot de passe oublié ?</span>
          <a href="/inscription" className="text-primary text-decoration-none">
            Créer un nouveau compte
          </a>
        </div>
      </div>
    </div>
  );
}
