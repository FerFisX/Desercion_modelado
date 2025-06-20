import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const CDFComparativa = () => {
  const [realData, setRealData] = useState([]);
  const [simData, setSimData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data/real').then(res => setRealData(res.data));
    axios.get('http://localhost:5000/data/simulada').then(res => setSimData(res.data));
  }, []);

  // Utilidades para calcular CDF
  const buildCDF = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    return sorted.map((val, i) => ({
      x: val,
      y: (i + 1) / n
    }));
  };

  const realServTime = realData
    .filter(d => d.ServTime)
    .map(d => d.ServTime / 60);
  const simWaiting = simData
    .filter(d => d.waiting_time != null)
    .map(d => d.waiting_time);

  const cdfReal = buildCDF(realServTime);
  const cdfSim = buildCDF(simWaiting);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        CDF Acumulada de Tiempos de Espera
      </h2>
      <Plot
        data={[
          {
            x: cdfReal.map(d => d.x),
            y: cdfReal.map(d => d.y),
            mode: 'lines',
            name: 'Real (ServTime)',
            line: { color: '#8884d8' }
          },
          {
            x: cdfSim.map(d => d.x),
            y: cdfSim.map(d => d.y),
            mode: 'lines',
            name: 'Simulado (Waiting Time)',
            line: { color: '#82ca9d' }
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

export default CDFComparativa;
