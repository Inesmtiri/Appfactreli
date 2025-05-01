import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Pages publiques
import WelcomePage from './Admin/Pages/WelcomePage';
import Inscription from './Admin/Pages/Inscription';
import Connexion from './Admin/Pages/Connexion';
import About from './Admin/Pages/About';
import ForgotPassword from "./Admin/Pages/ForgotPassword";
import ResetPassword from "./Admin/Pages/ResetPassword";
import { SearchProvider } from "./context/SearchContext";

// ✅ Pages internes (admin)
import Dashboard from './Admin/Pages/Dashboard';
import Client from './Admin/Pages/Client';
import Devis from './Admin/Pages/Devis';

import Factures from './Admin/Pages/Factures';
import Depenses from './Admin/Pages/Depense';
import Produits from './Admin/Pages/Produits';
import Paiement from './Admin/Pages/Paiement';




// ✅ Layout global admin
import Layout from './Admin/components/Layout';

// ✅ Interface CLIENT
import DashboardClient from './Clients/Pages/DashboardClient';
import MesDevis from './Clients/Pages/MesDevis';
import MesFacture from './Clients/Pages/MesFacture';
// ✅ ajouté

function App() {
  return (
    <SearchProvider>

    <BrowserRouter>
      <Routes>
     
        {/* ✅ Pages publiques */}
        <Route index element={<WelcomePage />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="login" element={<Connexion />} />
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="about" element={<About />} />

        {/* ✅ Interface ADMIN */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="client" element={<Client />} />
          <Route path="devis" element={<Devis />} />
          <Route path="factures" element={<Factures />} />
          <Route path="depenses" element={<Depenses />} />
          <Route path="produits" element={<Produits />} />
         
          <Route path="paiement" element={<Paiement />} />
          

      
          <Route path="client/dashboard" element={<DashboardClient />} />
          <Route path="client/mes-devis" element={<MesDevis />} />
          <Route path="client/mes-factures" element={<MesFacture />} />
      
        </Route>

      </Routes>
    </BrowserRouter>
    </SearchProvider>
  );
}

export default App;

