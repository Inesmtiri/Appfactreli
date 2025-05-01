import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import KpiDevisChart from "../components/kpi/KpiDevisChart";
import RevenueProfitChart from "../components/kpi/RevenueProfitChart";
import FactureStatusChart from "../components/kpi/FactureStatusChart";
import ProduitRentableChart from "../components/kpi/ProduitRentableChart";
import DerniersDevisTable from "../components/kpi/DerniersDevisTable";
import KpiTotalFactures from "../components/kpi/KpiTotalFactures";
import KpiTotalDevis from "../components/kpi/KpiTotalDevis";
import KpiTotalDepenses from "../components/kpi/KpiTotalDepenses";
import KpiClientsActifs from "../components/kpi/KpiClientsActifs";
import KpiTotalProfit from "../components/kpi/KpiTotalProfit";
const Dashboard = () => {
  return (
    <div className="container py-4">
      <h4 className="text-center mb-5">📊 Tableau de bord</h4>

      {/* Section KPI horizontaux */}
      <div className="row mb-5">
        <KpiTotalFactures />
        <KpiTotalDevis />
        <KpiTotalDepenses />
        <KpiClientsActifs />
        <KpiTotalProfit />
        {/* Tu peux ajouter ici d'autres KPI, comme Dépenses ou Clients actifs */}
      </div>

      {/* Graphique KPI Devis en camembert */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <KpiDevisChart />
            </div>
          </div>
        </div>
      </div>

      {/* Courbe revenus/dépenses/profit */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <RevenueProfitChart />
            </div>
          </div>
        </div>
      </div>

      {/* Histogramme factures par statut */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <FactureStatusChart />
            </div>
          </div>
        </div>
      </div>

      {/* Diagramme à bulles produits/services rentables */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <ProduitRentableChart />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des 10 derniers devis */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-10">
          <DerniersDevisTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
