import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const EvolucionCola = () => {
  const [colaData, setColaData] = useState([]);

  useEffect(() => {
    axios.get('https://desercion-backend-api.onrender.com/data/cola')
      .then(res => setColaData(res.data));
  }, []);

  const filtered = colaData
    .filter(d => d.resource === 'doctor')
    .map(d => ({
      tiempo: d.time,
      cola: d.queue
    }));

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Evolución de la Cola de Espera (Simulado)
      </h2>
      <Plot
        data={[
          {
            x: filtered.map(d => d.tiempo),
            y: filtered.map(d => d.cola),
            mode: 'lines',
            name: 'Pacientes en cola',
            line: { color: '#000000' }
          }
        ]}
        layout={{
          xaxis: {
            title: 'Tiempo (min)',
            showgrid: true,
            zeroline: false
          },
          yaxis: {
            title: 'Cantidad de Pacientes en Espera',
            showgrid: true,
            zeroline: false
          },
          margin: { t: 40, l: 60, r: 30, b: 60 },
          width: 900,
          height: 500,
          title: {
            text: '',
            font: {
              size: 16,
              family: 'Arial'
            }
          }
        }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default EvolucionCola;
