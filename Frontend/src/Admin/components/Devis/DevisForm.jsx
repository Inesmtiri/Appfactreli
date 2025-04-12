import React, { useEffect, useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const DevisForm = ({ onAddDevis, onCancel, editData }) => {
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);

  const [clientId, setClientId] = useState(editData?.clientId || "");
  const [clientName, setClientName] = useState(editData?.client || "");
  const [nomEntreprise, setNomEntreprise] = useState(editData?.nomEntreprise || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroDevis, setNumeroDevis] = useState(editData?.numeroDevis || "000001");
  const [reference, setReference] = useState(editData?.reference || "");
  const [logo, setLogo] = useState(null);

  const [lignes, setLignes] = useState(
    editData?.lignes?.map((l) => ({
      itemId: l.itemId || "",
      type: l.type || "",
      quantite: l.quantite || 1,
      prixUnitaire: l.prixUnitaire || 0,
      designation: l.designation || "",
    })) || [{ itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]
  );

  const printRef = useRef();

  useEffect(() => {
    axios.get("/api/clients").then(res => setClients(res.data));
    axios.get("/api/produits").then(res => setProduits(res.data));
    axios.get("/api/services").then(res => setServices(res.data));
  }, []);

  useEffect(() => {
    if (clientId) {
      const selected = clients.find((c) => c._id === clientId);
      if (selected) setClientName(`${selected.nom} ${selected.prenom}`);
    }
  }, [clientId, clients]);

  const options = [
    ...produits.map((p) => ({ _id: p._id, type: "produit", nom: p.reference, prix: p.prixVente || 0 })),
    ...services.map((s) => ({ _id: s._id, type: "service", nom: s.nom, prix: s.tarif || 0 })),
  ];

  const handleSelectItem = (index, value) => {
    const [type, id] = value.split("-");
    const selected = options.find((item) => item._id === id && item.type === type);
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
    updated[index][field] = field === "designation" ? value : parseFloat(value) || 0;
    setLignes(updated);
  };

  const ajouterLigne = () => {
    setLignes([...lignes, { itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]);
  };

  const supprimerLigne = (index) => {
    const updated = [...lignes];
    updated.splice(index, 1);
    setLignes(updated);
  };

  const subtotal = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handleSave = async () => {
    if (!clientId) return alert("Veuillez sélectionner un client.");

    const devis = {
      clientId,
      client: clientName,
      nomEntreprise,
      telephone,
      date,
      numeroDevis,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      statut: "en attente",
    };

    try {
      if (editData?._id) {
        const res = await axios.put(`/api/devis/${editData._id}`, devis);
        onAddDevis(res.data);
      } else {
        const res = await axios.post("/api/devis", devis);
        onAddDevis(res.data);
      }
      onCancel();
    } catch (err) {
      console.error("Erreur enregistrement devis :", err.message);
      alert("Erreur lors de l'enregistrement du devis");
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingTop: "50px" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-4">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-8" ref={printRef}>
                <h4 className="fst-italic mb-4">Nouveau devis</h4>

                {/* Client */}
                <div className="mb-3">
                  <label className="fw-semibold">Client</label>
                  <select className="form-select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                    <option value="">-- Sélectionner un client --</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nom} {c.prenom} - {c.societe}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Infos entreprise */}
                <input className="form-control mb-2" placeholder="Entreprise" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
                <input className="form-control mb-3" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />

                {/* Infos devis */}
                <div className="row mb-3">
                  <div className="col">
                    <label>Date</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="col">
                    <label>Numéro</label>
                    <input type="text" className="form-control" value={numeroDevis} onChange={(e) => setNumeroDevis(e.target.value)} />
                  </div>
                  <div className="col">
                    <label>Référence</label>
                    <input type="text" className="form-control" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </div>
                </div>

                {/* Lignes */}
                <div className="table-responsive mb-3">
                  <table className="table table-bordered">
                    <thead>
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
                            <select className="form-select" value={ligne.type && ligne.itemId ? `${ligne.type}-${ligne.itemId}` : ""} onChange={(e) => handleSelectItem(index, e.target.value)}>
                              <option value="">-- Choisir --</option>
                              {options.map((item) => (
                                <option key={item._id} value={`${item.type}-${item._id}`}>
                                  [{item.type}] {item.nom} - {item.prix.toFixed(3)} TND
                                </option>
                              ))}
                            </select>
                          </td>
                          <td><input type="number" className="form-control" value={ligne.quantite} onChange={(e) => handleChange(index, "quantite", e.target.value)} /></td>
                          <td><input type="number" className="form-control" value={ligne.prixUnitaire} onChange={(e) => handleChange(index, "prixUnitaire", e.target.value)} /></td>
                          <td>{(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
                          <td><button className="btn btn-link text-danger" onClick={() => supprimerLigne(index)}><FaTrash /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="btn btn-outline-primary" onClick={ajouterLigne}>+ Ajouter une ligne</button>
                </div>

                {/* Totaux */}
                <div className="text-end">
                  <p><strong>Subtotal:</strong> {subtotal.toFixed(3)} TND</p>
                  <p><strong>Tax (19%):</strong> {tax.toFixed(3)} TND</p>
                  <h5><strong>Total:</strong> {total.toFixed(3)} TND</h5>
                </div>
              </div>

              {/* Actions */}
              <div className="col-md-4 d-flex flex-column gap-3 align-items-start">
                <button className="btn btn-success w-100 fw-bold" onClick={handleSave}>Enregistrer</button>
                <button className="btn btn-secondary w-100" onClick={onCancel}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisForm;
