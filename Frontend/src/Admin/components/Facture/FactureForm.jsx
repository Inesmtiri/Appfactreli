import React, { useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import SendFacture from "./SendFacture";

const FactureForm = ({ onAddFacture, onCancel }) => {
  const [client, setClient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [numeroFacture, setNumeroFacture] = useState("000001");
  const [reference, setReference] = useState("");

  const [nomEntreprise, setNomEntreprise] = useState("Nom de l'entreprise");
  const [telephone, setTelephone] = useState("Téléphone");

  const [lignes, setLignes] = useState([
    { description: "", quantite: 1, prixUnitaire: 0 },
  ]);

  const [montantPaye, setMontantPaye] = useState(0);
  const [modePaiement, setModePaiement] = useState("Espèces");
  const [tvaRate, setTvaRate] = useState(19);

  const [logo, setLogo] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);

  const printRef = useRef();

  const ajouterLigne = () => {
    setLignes([...lignes, { description: "", quantite: 1, prixUnitaire: 0 }]);
  };

  const supprimerLigne = (index) => {
    const updated = [...lignes];
    updated.splice(index, 1);
    setLignes(updated);
  };

  const handleLigneChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = field === "description" ? value : parseFloat(value);
    setLignes(updated);
  };

  const subtotal = lignes.reduce(
    (total, ligne) => total + ligne.quantite * ligne.prixUnitaire,
    0
  );
  const tax = subtotal * (tvaRate / 100);
  const total = subtotal + tax;
  const montantRestant = total - montantPaye;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html><head><title>Impression Facture</title></head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFacture = () => {
    const facture = {
      client,
      date,
      dueDate,
      numeroFacture,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      montantPaye,
      montantRestant,
      modePaiement,
      tvaRate,
      nomEntreprise,
      telephone,
    };

    onAddFacture(facture);
    onCancel();
  };

  return (
    <>
      <div
        className="modal d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          overflowY: "auto",
          paddingTop: "50px",
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content p-4">
            <div className="modal-body">
              <div className="row">
                {/* Partie gauche */}
                <div className="col-md-8" ref={printRef}>
                  <h4 className="fst-italic mb-4">Nouvelle facture</h4>

                  {/* Logo + entreprise */}
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div
                      style={{
                        border: "2px dashed #ccc",
                        width: "200px",
                        height: "150px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt="Logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          onClick={() =>
                            document.getElementById("logoInput").click()
                          }
                        />
                      ) : (
                        <span
                          style={{
                            color: "#999",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                          onClick={() =>
                            document.getElementById("logoInput").click()
                          }
                        >
                          Drag logo here <br /> or select a file
                        </span>
                      )}
                      <input
                        type="file"
                        id="logoInput"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                    </div>

                    <div className="text-end" style={{ width: "50%" }}>
                      <input
                        type="text"
                        value={nomEntreprise}
                        onChange={(e) => setNomEntreprise(e.target.value)}
                        className="form-control mb-2 fw-bold"
                        placeholder="Nom de l'entreprise"
                      />
                      <input
                        type="text"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="form-control"
                        placeholder="Téléphone"
                      />
                    </div>
                  </div>

                  {/* Infos principales */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Préparé pour</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Client"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Date de la facture</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Numéro de facture</label>
                      <input
                        type="text"
                        className="form-control"
                        value={numeroFacture}
                        onChange={(e) => setNumeroFacture(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Échéance</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Référence</label>
                      <input
                        type="text"
                        className="form-control"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4 d-flex flex-column justify-content-end align-items-end">
                      <label className="form-label fw-semibold">Montant</label>
                      <h4 className="fw-bold">{total.toFixed(3)} TND</h4>
                    </div>
                  </div>

                  {/* Lignes */}
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Prix Unitaire</th>
                          <th>Total Ligne</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lignes.map((ligne, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={ligne.description}
                                onChange={(e) =>
                                  handleLigneChange(index, "description", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="1"
                                value={ligne.quantite}
                                onChange={(e) =>
                                  handleLigneChange(index, "quantite", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                value={ligne.prixUnitaire}
                                onChange={(e) =>
                                  handleLigneChange(index, "prixUnitaire", e.target.value)
                                }
                              />
                            </td>
                            <td className="text-end">
                              {(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => supprimerLigne(index)}
                              >
                                <FaTrash size={18} color="#000" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <button
                      type="button"
                      className="btn btn-outline-primary mt-2"
                      onClick={ajouterLigne}
                    >
                      + Ajouter une ligne
                    </button>
                  </div>

                  <div className="mt-4 text-end">
                    <p><strong>Subtotal :</strong> {subtotal.toFixed(3)} TND</p>
                    <div className="d-flex justify-content-end align-items-center mb-2">
                      <label className="me-2 fw-semibold">TVA (%) :</label>
                      <input
                        type="number"
                        className="form-control w-25"
                        min="0"
                        value={tvaRate}
                        onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <p><strong>Tax ({tvaRate}%) :</strong> {tax.toFixed(3)} TND</p>
                    <div className="d-flex justify-content-end mb-2">
                      <label className="me-2 fw-semibold">Montant Payé :</label>
                      <input
                        type="number"
                        className="form-control w-25"
                        min="0"
                        max={total}
                        value={montantPaye}
                        onChange={(e) => setMontantPaye(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <h5><strong>Montant Restant :</strong> {montantRestant.toFixed(3)} TND</h5>
                    <div className="d-flex justify-content-end mt-3">
                      <label className="me-2 fw-semibold">Mode Paiement :</label>
                      <select
                        className="form-select w-50"
                        value={modePaiement}
                        onChange={(e) => setModePaiement(e.target.value)}
                      >
                        <option>Espèces</option>
                        <option>Virement Bancaire</option>
                        <option>Chèque</option>
                        <option>Carte Bancaire</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Boutons actions */}
                <div className="col-md-4 d-flex flex-column justify-content-center align-items-end gap-3">
                  <button
                    type="button"
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff"
                    }}
                    onClick={() => setShowSendModal(true)}
                  >
                    Envoyer
                  </button>

                  <button
                    type="button"
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff"
                    }}
                    onClick={handleSaveFacture}
                  >
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff"
                    }}
                    onClick={handlePrint}
                  >
                    Imprimer
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary w-75"
                    onClick={onCancel}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Envoi */}
      {showSendModal && (
        <SendFacture
          onClose={() => setShowSendModal(false)}
          factureInfo={{
            client,
            numeroFacture,
            total,
            dueDate,
            nomEntreprise,
          }}
        />
      )}
    </>
  );
};

export default FactureForm;




