import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Pages publiques
import WelcomePage from './Admin/Pages/WelcomePage';
import Inscription from './Admin/Pages/Inscription';
import Connexion from './Admin/Pages/Connexion';
import About from './Admin/Pages/About';

// ✅ Pages internes (admin)
import Dashboard from './Admin/Pages/Dashboard';
import Client from './Admin/Pages/Client';
import Devis from './Admin/Pages/Devis';
import Projets from './Admin/Pages/Projets';
import Factures from './Admin/Pages/Factures';
import Depenses from './Admin/Pages/Depense';
import Produits from './Admin/Pages/Produits';
import Paiement from './Admin/Pages/Paiement';
import Utilisateurs from './Admin/Pages/Utilisateurs';

// ✅ Layout global
import Layout from './Admin/components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route index element={<WelcomePage />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="login" element={<Connexion />} />
        <Route path="about" element={<About />} />

        {/* Pages internes */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="client" element={<Client />} />
          <Route path="devis" element={<Devis />} />
          <Route path="factures" element={<Factures />} />
          <Route path="depenses" element={<Depenses />} />
          <Route path="produits" element={<Produits />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="projets" element={<Projets />} />
          <Route path="paiement" element={<Paiement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
