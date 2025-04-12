import React, { useEffect, useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const FactureForm = ({ onAddFacture, onCancel, editData }) => {
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);

  const [clientId, setClientId] = useState(editData?.client || "");
  const [client, setClient] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState(editData?.nomEntreprise || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroFacture, setNumeroFacture] = useState(editData?.numeroFacture || "000001");
  const [reference, setReference] = useState(editData?.reference || "");
  const [logo, setLogo] = useState(null);

  const [lignes, setLignes] = useState(
    editData?.lignes?.map(l => ({
      itemId: l.itemId || "",
      type: l.type || "",
      quantite: isNaN(l.quantite) ? 1 : l.quantite,
      prixUnitaire: isNaN(l.prixUnitaire) ? 0 : l.prixUnitaire,
      designation: l.designation || ""
    })) || [
      { itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" },
    ]
  );

  const [tvaRate, setTvaRate] = useState(isNaN(editData?.tvaRate) ? 19 : editData.tvaRate);
  const [montantPaye, setMontantPaye] = useState(isNaN(editData?.montantPaye) ? 0 : editData.montantPaye);
  const [modePaiement, setModePaiement] = useState(editData?.modePaiement || "Espèces");

  const printRef = useRef();

  useEffect(() => {
    axios.get("/api/clients").then(res => setClients(res.data));
    axios.get("/api/produits").then(res => setProduits(res.data));
    axios.get("/api/services").then(res => setServices(res.data));
  }, []);

  useEffect(() => {
    if (editData?.client && clients.length > 0) {
      const selected = clients.find(c => c._id === editData.client);
      setClient(selected?.nom || "");
    }
  }, [clients, editData]);

  const options = [
    ...produits.map(p => ({
      _id: p._id,
      type: "produit",
      nom: p.reference,
      prix: p.prixVente || 0,
    })),
    ...services.map(s => ({
      _id: s._id,
      type: "service",
      nom: s.nom,
      prix: s.tarif || 0,
    })),
  ];

  const handleSelectItem = (index, value) => {
    const [type, id] = value.split("-");
    const selected = options.find(item => item._id === id && item.type === type);
    const updated = [...lignes];
    updated[index] = {
      ...updated[index],
      itemId: id,
      type,
      prixUnitaire: selected?.prix || 0,
      designation: selected?.nom || "",
    };
    setLignes(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] =
      field === "designation" ? value : parseFloat(value) || 0;
    setLignes(updated);
  };

  const ajouterLigne = () => {
    setLignes([
      ...lignes,
      { itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" },
    ]);
  };

  const supprimerLigne = (index) => {
    const updated = [...lignes];
    updated.splice(index, 1);
    setLignes(updated);
  };

  const subtotal = lignes.reduce(
    (sum, l) => sum + l.quantite * l.prixUnitaire,
    0
  );
  const tax = subtotal * (tvaRate / 100);
  const total = subtotal + tax;
  const montantRestant = total - montantPaye;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(
      `<html><head><title>Impression</title></head><body>${printContents}</body></html>`
    );
    win.document.close();
    win.print();
  };

  const handleSave = () => {
    const facture = {
      client: clientId,
      date,
      numeroFacture,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      montantPaye,
      montantRestant,
      tvaRate,
      modePaiement,
      nomEntreprise,
      telephone,
    };

    onAddFacture(facture);
    onCancel();
  };

  const handleSend = () => {
    alert("📤 Fonction 'Envoyer' liée à l'interface client (à venir)");
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
                <div className="col-md-8" ref={printRef}>
                  <h4 className="fst-italic mb-4">Nouvelle facture</h4>

                  <div className="d-flex gap-3 mb-3">
                    <div
                      style={{
                        border: "2px dashed #ccc",
                        width: "150px",
                        height: "120px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        document.getElementById("logoInput").click()
                      }
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
                        />
                      ) : (
                        <span
                          style={{
                            color: "#999",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          Drag logo here <br /> or select a file
                        </span>
                      )}
                      <input
                        type="file"
                        id="logoInput"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Entreprise"
                        value={nomEntreprise}
                        onChange={(e) => setNomEntreprise(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Téléphone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold">Client</label>
                    <select
                      className="form-select"
                      value={clientId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setClientId(id);
                        const selected = clients.find((c) => c._id === id);
                        setClient(selected?.nom || "");
                      }}
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {clients.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.nom} {c.prenom} - {c.societe}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Numéro</label>
                      <input
                        type="text"
                        className="form-control"
                        value={numeroFacture}
                        onChange={(e) => setNumeroFacture(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Référence</label>
                      <input
                        type="text"
                        className="form-control"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive mb-3">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Produit / Service</th>
                          <th>Quantité</th>
                          <th>Prix Unitaire</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lignes.map((ligne, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                className="form-select"
                                value={
                                  ligne.type && ligne.itemId
                                    ? `${ligne.type}-${ligne.itemId}`
                                    : ""
                                }
                                onChange={(e) =>
                                  handleSelectItem(index, e.target.value)
                                }
                              >
                                <option value="">-- Choisir --</option>
                                {options.map((item) => (
                                  <option
                                    key={item._id}
                                    value={`${item.type}-${item._id}`}
                                  >
                                    [{item.type}] {item.nom} -{" "}
                                    {item.prix.toFixed(3)} TND
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  isNaN(ligne.quantite) ? 1 : ligne.quantite
                                }
                                onChange={(e) =>
                                  handleChange(index, "quantite", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  isNaN(ligne.prixUnitaire)
                                    ? 0
                                    : ligne.prixUnitaire
                                }
                                onChange={(e) =>
                                  handleChange(index, "prixUnitaire", e.target.value)
                                }
                              />
                            </td>
                            <td className="text-end">
                              {(ligne.quantite * ligne.prixUnitaire).toFixed(3)}{" "}
                              TND
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-link text-danger"
                                onClick={() => supprimerLigne(index)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-outline-primary"
                      onClick={ajouterLigne}
                    >
                      + Ajouter une ligne
                    </button>
                  </div>

                  <div className="text-end">
                    <p>
                      <strong>Subtotal :</strong> {subtotal.toFixed(3)} TND
                    </p>
                    <p>
                      <strong>Tax ({tvaRate}%) :</strong> {tax.toFixed(3)} TND
                    </p>
                    <h5>
                      <strong>Total :</strong> {total.toFixed(3)} TND
                    </h5>
                    <div className="d-flex justify-content-end align-items-center mb-2">
                      <label className="me-2 fw-semibold">TVA (%) :</label>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={isNaN(tvaRate) ? 19 : tvaRate}
                        onChange={(e) =>
                          setTvaRate(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-end align-items-center mb-2">
                      <label className="me-2 fw-semibold">Montant Payé :</label>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={isNaN(montantPaye) ? 0 : montantPaye}
                        onChange={(e) =>
                          setMontantPaye(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <p>
                      <strong>Montant Restant :</strong>{" "}
                      {montantRestant.toFixed(3)} TND
                    </p>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                      <label className="me-2 fw-semibold">Mode Paiement :</label>
                      <select
                        className="form-select w-25"
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

                <div className="col-md-4 d-flex flex-column justify-content-center align-items-start gap-3">
                  <button
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff",
                    }}
                    onClick={handleSend}
                  >
                    Envoyer
                  </button>
                  <button
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff",
                    }}
                    onClick={handleSave}
                  >
                    Enregistrer
                  </button>
                  <button
                    className="btn w-75 fw-bold"
                    style={{
                      backgroundColor: "#23BD15",
                      borderColor: "#23BD15",
                      color: "#fff",
                    }}
                    onClick={handlePrint}
                  >
                    Imprimer
                  </button>
                  <button className="btn btn-secondary w-75" onClick={onCancel}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FactureForm;
