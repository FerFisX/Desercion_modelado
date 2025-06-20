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
          xaxis: { title: 'Tiempo (min)' },
          yaxis: { title: 'Cantidad en cola' },
          width: 900,
          height: 500
        }}
      />
    </div>
  );
};

export default EvolucionCola;
