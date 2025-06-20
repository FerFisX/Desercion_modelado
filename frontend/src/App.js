import React from 'react';
import Dashboard from './components/Dashboard';
import BoxplotTurno from './components/BoxplotTurno';
import CDFComparativa from './components/CDFComparativa';
import EvolucionCola from './components/EvolucionCola';
import KPIColumn from './components/KPIColumn';
import './index.css';

function App() {
  return (
    <div className="container">
      <h1>Dashboard Comparativo de Consultorios Médicos</h1>

      {/* Fila 1: Comparación de tiempos (ancho completo) */}
      <div className="plot-container" style={{ marginBottom: '32px' }}>
        <Dashboard />
      </div>

      {/* Fila 2: KPI + CDF Comparativa */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="plot-container">
          <KPIColumn />
        </div>
        <div className="plot-container">
          <CDFComparativa />
        </div>
      </div>

      {/* Fila 3: Evolución de la cola (ancho completo) */}
      <div className="plot-container" style={{ marginBottom: '32px' }}>
        <EvolucionCola />
      </div>

      {/* Fila 4: Boxplot de tiempo de espera (ancho completo) */}
      <div className="plot-container">
        <BoxplotTurno />
      </div>
    </div>
  );
}

export default App;
