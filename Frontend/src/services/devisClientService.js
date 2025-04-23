import axios from "axios";

const API_URL = "http://localhost:3001/api/client/devis";

export const fetchDevisClient = async (clientId) => {
  const res = await axios.get(`${API_URL}/${clientId}`);
  return res.data;
};

export const acceptDevis = async (devisId) => {
  const res = await axios.put(`${API_URL}/${devisId}/accept`);
  return res.data;
};

export const refuseDevis = async (devisId) => {
  const res = await axios.put(`${API_URL}/${devisId}/refuse`);
  return res.data;
};
