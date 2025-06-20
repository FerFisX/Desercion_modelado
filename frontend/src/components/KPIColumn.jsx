import React, { useEffect, useState } from 'react';
import axios from 'axios';


const KPIColumn = () => {
  const [simData, setSimData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data/simulada').then(res => {
      setSimData(res.data);
    });
  }, []);

  if (simData.length === 0) return null;

  const SLA_LIMIT = 10;

  const slaCumplido = simData.filter(d => d.waiting_time <= SLA_LIMIT).length;
  const total = simData.length;
  const slaPercent = ((slaCumplido / total) * 100).toFixed(1);

  const avgEspera = (
    simData.reduce((acc, d) => acc + d.waiting_time, 0) / total
  ).toFixed(2);

  return (
    <div className="kpi-column">
      <div className="kpi-card">
        <h4>% SLA Cumplido</h4>
        <p className="kpi-value green">{slaPercent}%</p>
      </div>
      <div className="kpi-card">
        <h4>Tiempo Promedio de Espera</h4>
        <p className="kpi-value">{avgEspera} min</p>
      </div>
      <div className="kpi-card">
        <h4>Total de Pacientes</h4>
        <p className="kpi-value">{total}</p>
      </div>
    </div>
  );
};

export default KPIColumn;
