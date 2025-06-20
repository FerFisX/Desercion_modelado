import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import Plot from 'react-plotly.js';

const BoxplotTurno = () => {
  const [realData, setRealData] = useState([]);
  const [simData, setSimData] = useState([]);

  useEffect(() => {
    axios.get('https://desercion-backend-api.onrender.com/data/real').then(res => setRealData(res.data));
    axios.get('https://desercion-backend-api.onrender.com/data/simulada').then(res => setSimData(res.data));
  }, []);

  // Determina el turno por hora
  const getTurno = (startTime) => {
    if (!startTime) return 'unknown';
    const hour = parseInt(startTime.split(':')[0]);
    return hour < 12 ? 'morning' : 'afternoon';
  };

  // Extraer valores reales
  const realMorning = realData
    .filter(d => getTurno(d.StartTime) === 'morning')
    .map(d => d.ServTime / 60);
  const realAfternoon = realData
    .filter(d => getTurno(d.StartTime) === 'afternoon')
    .map(d => d.ServTime / 60);

  // Simulados
  const simMorning = simData
    .filter(d => d.turno === 'morning')
    .map(d => d.waiting_time);
  const simAfternoon = simData
    .filter(d => d.turno === 'afternoon')
    .map(d => d.waiting_time);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Boxplot de Tiempo de Espera por Turno
      </h2>
      <Plot
        data={[
          {
            y: realMorning,
            type: 'box',
            name: 'Real - Mañana',
            marker: { color: '#8884d8' }
          },
          {
            y: realAfternoon,
            type: 'box',
            name: 'Real - Tarde',
            marker: { color: '#8dd1e1' }
          },
          {
            y: simMorning,
            type: 'box',
            name: 'Simulado - Mañana',
            marker: { color: '#82ca9d' }
          },
          {
            y: simAfternoon,
            type: 'box',
            name: 'Simulado - Tarde',
            marker: { color: '#a4de6c' }
          }
        ]}
        layout={{
        autosize: true,
        height: 400,
        margin: { t: 40, r: 20, l: 50, b: 40 },
        xaxis: { title: 'Tiempo de Espera (min)' },
        yaxis: { title: 'Proporción Acumulada' }
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
    </div>
  );
};

export default BoxplotTurno;
