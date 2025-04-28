import React, { useEffect, useState, useRef } from "react";
import { FaTrash, FaPrint } from "react-icons/fa";

import axios from "axios";
import ClientForm from "../ClientForm"; 
const FactureForm = ({ onAddFacture, onCancel, editData }) => {
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);
  const [clientId, setClientId] = useState(editData?.client || "");
const [clientInput, setClientInput] = useState(editData?.clientInput || "");

  const [nomEntreprise, setNomEntreprise] = useState(editData?.nomEntreprise || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroFacture, setNumeroFacture] = useState("");
  const [reference, setReference] = useState(editData?.reference || "");
  const [tvaRate, setTvaRate] = useState(editData?.tvaRate || 19);
  const [remise, setRemise] = useState(editData?.remise || 0);
  const [modePaiement, setModePaiement] = useState(editData?.modePaiement || "Espèces");
  const [logo, setLogo] = useState(null);
  const [lignes, setLignes] = useState(
    editData?.lignes || [{ itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]
  );

  
  const [showClientForm, setShowClientForm] = useState(false);
  const printRef = useRef();
  const generateNumeroFacture = async () => {
    try {
      const res = await axios.get("/api/factures");
      const numeros = res.data
        .map((f) => parseInt(f.numeroFacture))
        .filter((n) => !isNaN(n));
      const max = Math.max(0, ...numeros);
      const next = (max + 1).toString().padStart(6, "0");
      setNumeroFacture(next);
    } catch (err) {
      console.error("❌ Erreur lors de la génération du numéro :", err);
    }
  };
  const handleClientCreated = (newClient) => {
    axios.get("/api/clients").then((res) => setClients(res.data));
    setClientId(newClient._id);
    setClientInput(`${newClient.nom} ${newClient.prenom} - ${newClient.societe}`);
    setShowClientForm(false);
  };

  
  useEffect(() => {
    const initNumeroFacture = async () => {
      if (editData?.numeroFacture) {
        setNumeroFacture(editData.numeroFacture);
      } else {
        await generateNumeroFacture();
      }
    };
    initNumeroFacture();

    axios.get("/api/clients").then((res) => setClients(res.data));
    axios.get("/api/produits").then((res) => setProduits(res.data));
    axios.get("/api/services").then((res) => setServices(res.data));
  }, []);

  const options = [
    ...produits.map(p => ({ _id: p._id, type: "produit", nom: p.reference, prix: p.prixVente })),
    ...services.map(s => ({ _id: s._id, type: "service", nom: s.nom, prix: s.tarif })),
  ];

  const handleClientInput = (e) => {
    const val = e.target.value;
    setClientInput(val);
    const match = clients.find(c => `${c.nom} ${c.prenom} - ${c.societe}`.toLowerCase() === val.toLowerCase());
    if (match) setClientId(match._id);
    else setClientId("");
  };

  const handleSelectItem = (index, value) => {
    const selected = options.find(opt => `${opt.nom} - ${opt.prix}` === value);
    const updated = [...lignes];
    if (selected) {
      updated[index] = {
        ...updated[index],
        itemId: selected._id,
        type: selected.type,
        designation: selected.nom,
        prixUnitaire: selected.prix,
        inputValue: value
      };
    } else {
      updated[index].inputValue = value;
    }
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
  const remiseMontant = subtotal * (remise / 100);
  const tax = (subtotal - remiseMontant) * (tvaRate / 100);
  const total = subtotal - remiseMontant + tax;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  
    const handleSave = async () => {
      if (!clientId) return alert("Veuillez sélectionner un client.");
      if (!reference.trim()) return alert("Référence requise !");
      if (telephone.length !== 8 || !/^[0-9]{8}$/.test(telephone)) return alert("Téléphone invalide (8 chiffres) !");
    const facture = {
      client: clientId,
      date,
      numeroFacture,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      tvaRate,
      remise,
      modePaiement,
      nomEntreprise,
      telephone,
      envoyée: true,
    };

    try {
      const res = editData?._id
        ? await axios.put(`/api/factures/${editData._id}`, facture)
        : await axios.post("/api/factures", facture);

      alert("✅ Facture enregistrée !");
      onAddFacture(res.data);
      onCancel();
    } catch (err) {
      console.error("❌ Erreur :", err);
      alert("Erreur lors de l'enregistrement !");
    }
  };

  const handlePrint = async () => {
    // 🔄 Convertir le logo en base64 si nécessaire
    const logoURL = logo
      ? typeof logo === "string"
        ? logo.startsWith("data:") ? logo : `/uploads/${logo}` // déjà en base64 ou fichier serveur
        : await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // base64
            reader.readAsDataURL(logo);
          })
      : "";
  
    const clientInfo = clients.find(c => c._id === clientId);
  
    const html = `
    <html>
      <head>
        <title>Facture ${numeroFacture}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 60px;
            color: #2f3e4d;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
          }
          .header img {
            max-width: 140px;
            max-height: 100px;
          }
          .section-title {
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info, .facture-info {
            font-size: 16px;
            line-height: 1.6;
          }
          .info-blocks {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            font-size: 15px;
          }
          th {
            background-color: #f2f4f6;
            color: #4b5563;
            padding: 12px;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .totals {
            margin-top: 40px;
            text-align: right;
            font-size: 16px;
          }
          .totals p {
            margin: 5px 0;
          }
          .total-amount {
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #9ca3af;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="section-title">Client</div>
            <div class="info">
              ${clientInfo?.nom || "Client"} ${clientInfo?.prenom || ""}<br/>
              ${nomEntreprise || ""}
            </div>
          </div>
  
          <div style="text-align:right;">
            <strong>Ganesh Coding</strong><br/>
            25140235<br/>
            Beb bhar
          </div>
  
          ${logoURL ? `<img src="${logoURL}" alt="Logo">` : ""}
        </div>
  
        <div class="info-blocks">
          <div class="facture-info">
            <div class="section-title">Date de facture</div>
            ${date}
          </div>
          <div class="facture-info">
            <div class="section-title">N° Facture</div>
            ${numeroFacture}
          </div>
          <div class="facture-info">
            <div class="section-title">Référence</div>
            ${reference}
          </div>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th style="text-align:center;">Prix unitaire</th>
              <th style="text-align:center;">Quantité</th>
              <th style="text-align:right;">Total ligne</th>
            </tr>
          </thead>
          <tbody>
            ${lignes.map((ligne) => `
              <tr>
                <td>${ligne.designation}</td>
                <td style="text-align:center;">${ligne.prixUnitaire.toFixed(3)} TND</td>
                <td style="text-align:center;">${ligne.quantite}</td>
                <td style="text-align:right;">${(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
  
        <div class="totals">
          <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
          <p><strong>Remise (${remise}%):</strong> ${(subtotal * remise / 100).toFixed(3)} TND</p>
          <p><strong>TVA (${tvaRate}%):</strong> ${tax.toFixed(3)} TND</p>
          <p class="total-amount"><strong>Total :</strong> ${total.toFixed(3)} TND</p>
        </div>
  
        <div class="footer">
          Merci pour votre confiance – Facterli
        </div>
      </body>
    </html>
    `;
  
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };
  
  

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingTop: 50 }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-4">
          <div className="modal-body">
            <div className="row">
              {/* 🧾 Zone 75% contenu facture */}
              <div className="col-md-9" ref={printRef}>
                <h4 className="mb-3">{editData ? "Modifier facture" : "Nouvelle facture"}</h4>
  
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="border rounded d-flex align-items-center justify-content-center position-relative"
                      style={{ height: "100px", borderStyle: "dashed", overflow: "hidden" }}>
                      <input type="file" accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ opacity: 0, position: "absolute", width: "100%", height: "100%" }} />
                      {logo
                        ? <img src={typeof logo === "string" ? logo : URL.createObjectURL(logo)} alt="Logo"
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        : <span className="text-muted small text-center">Drag logo here<br />or select file</span>}
                    </div>
                  </div>
  
                  <div className="col-md-5">
                    <input className="form-control mb-2" placeholder="Entreprise"
                      value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
                    <input
                      className="form-control"
                      placeholder="Téléphone"
                      value={telephone}
                      maxLength={8}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,8}$/.test(val)) setTelephone(val);
                      }}
                      onBlur={() => {
                        if (telephone.length !== 8) {
                          alert("📱 Le numéro de téléphone doit contenir exactement 8 chiffres !");
                          setTelephone("");
                        }
                      }}
                    />
                  </div>
  
                  {/* 👉 Infos entreprise fixes à droite */}
                  <div className="col-md-4 d-flex flex-column justify-content-center align-items-end text-end">
                    <strong>Ganesh Coding</strong>
                    <small>25140235</small>
                    <small>Beb bhar</small>
                  </div>
                </div>
  
                {/* Client input dynamique */}
                <div className="mb-3">
                  <label>Client</label>
                  <input
                    className="form-control"
                    list="clients"
                    placeholder="Rechercher un client..."
                    value={clientInput}
                    onChange={handleClientInput}
                  />
                  <datalist id="clients">
                    {clients.map(c => (
                      <option key={c._id} value={`${c.nom} ${c.prenom} - ${c.societe}`} />
                    ))}
                  </datalist>
  
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => setShowClientForm(true)}
                  >
                    + Créer un client
                  </button>
  
                  {/* Modal d’ajout de client */}
                  {showClientForm && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}>
                      <div className="modal-dialog modal-dialog-centered" style={{ marginTop: "100px" }}>
                        <div className="modal-content p-3">
                          <div className="modal-header">
                            <h5 className="modal-title">Nouveau client</h5>
                            <button className="btn-close" onClick={() => setShowClientForm(false)}></button>
                          </div>
                          <div className="modal-body">
                            <ClientForm
                              onClientCreated={handleClientCreated}
                              onClose={() => setShowClientForm(false)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Suite (date, numéro, référence) */}
                <div className="row mb-3">
                  <div className="col">
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="col">
                    <input type="text" className="form-control" value={numeroFacture} disabled />
                  </div>
                  <div className="col">
                    <input type="text" className="form-control" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </div>
                </div>

                {/* Lignes */}
                <div className="table-responsive mb-3">
                  <table className="table table-bordered">
                    <thead><tr><th>Produit / Service</th><th>Quantité</th><th>PU</th><th>Total</th><th></th></tr></thead>
                    <tbody>
                      {lignes.map((ligne, i) => (
                        <tr key={i}>
                          <td>
                            <input
                              list={`options-${i}`}
                              className="form-control"
                              placeholder="Produit ou service..."
                              value={ligne.inputValue || ""}
                              onChange={(e) => handleSelectItem(i, e.target.value)}
                            />
                            <datalist id={`options-${i}`}>
                              {options.map(opt => (
                                <option key={opt._id} value={`${opt.nom} - ${opt.prix}`} />
                              ))}
                            </datalist>
                          </td>
                          <td><input type="number" className="form-control" value={ligne.quantite} onChange={(e) => handleChange(i, "quantite", e.target.value)} /></td>
                          <td><input type="number" className="form-control" value={ligne.prixUnitaire} onChange={(e) => handleChange(i, "prixUnitaire", e.target.value)} /></td>
                          <td>{(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
                          <td><button className="btn btn-link text-danger" onClick={() => supprimerLigne(i)}><FaTrash /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="btn btn-outline-primary" onClick={ajouterLigne}>+ Ajouter une ligne</button>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <label>Remise (%)</label>
                    <input type="number" className="form-control" value={remise} onChange={(e) => setRemise(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-4">
                    <label>TVA (%)</label>
                    <input type="number" className="form-control" value={tvaRate} onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-4 text-end">
                    <p><strong>Sous-total :</strong> {subtotal.toFixed(3)} TND</p>
                    <p><strong>Remise :</strong> {remiseMontant.toFixed(3)} TND</p>
                    <p><strong>TVA :</strong> {tax.toFixed(3)} TND</p>
                    <h5><strong>Total :</strong> {total.toFixed(3)} TND</h5>
                  </div>
                </div>
              </div>

              {/* 📎 Zone 25% boutons */}
              <div className="col-md-3 d-flex flex-column align-items-end justify-content-center gap-2">
                              <button
                                className="btn w-75 fw-bold"
                                style={{
                                  backgroundColor: editData ? "#ffc107" : "#23BD15",
                                  borderColor: editData ? "#ffc107" : "#23BD15",
                                  color: "#fff",
                                }}
                                onClick={handleSave}
                              >
                                {editData ? "Mettre à jour" : "Envoyer"}
                              </button>
                              <button className="btn btn-outline-dark w-75" onClick={handlePrint}><FaPrint className="me-2" /> Imprimer</button>
                              <button className="btn btn-secondary w-75" onClick={onCancel}>Annuler</button>
                            </div>
                          </div>
                          
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureForm;
