from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Carga de datos
data_real = pd.read_csv('../data/Data.csv')
data_sim = pd.read_csv('../data/simulacion_eventos_v2.csv')
data_cola = pd.read_csv('../data/recursos_simulados_v2.csv')

@app.route('/data/real')
def get_real():
    return data_real.to_json(orient='records')

@app.route('/data/simulada')
def get_simulada():
    return data_sim.to_json(orient='records')

@app.route('/data/cola')
def get_cola():
    return data_cola.to_json(orient='records')


@app.route('/data/cola_real')
def get_cola_real():
    data = pd.read_csv('../data/cola_reconstruida_final.csv')
    return data.to_json(orient='records')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
