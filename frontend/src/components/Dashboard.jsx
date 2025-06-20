import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [realData, setRealData] = useState([]);
  const [simData, setSimData] = useState([]);

  useEffect(() => {
    axios.get('https://desercion-backend-api.onrender.com/data/real')
      .then(res => setRealData(res.data));
    axios.get('https://desercion-backend-api.onrender.com/data/simulada')
      .then(res => setSimData(res.data));
  }, []);

  // Convierte un string de hora (HH:MM:SS) a minutos (float)
  const parseHourToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 60 + m + s / 60;
  };

  // Combina los datos limitando realData a la longitud de simData
const mergedData = realData.slice(0, simData.length).map((item, index) => {
  const startMin = parseHourToMinutes(item.StartTime);
  const servTime = item.ServTime ? item.ServTime / 60 : 0;
  const esperaSim = simData[index] ? simData[index].waiting_time : null;

  return {
    minuto: startMin,
    espera_real: servTime,
    espera_sim: esperaSim
  };
});


  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Comparación de Tiempos de Atención y Espera
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="minuto" label={{ value: 'Minutos del día', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'Tiempo (min)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="espera_real" stroke="#8884d8" name="Atención Real (ServTime)" />
          <Line type="monotone" dataKey="espera_sim" stroke="#82ca9d" name="Espera Simulada" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
