"use client"

import { useState, useEffect } from "react"
import { Phone, Clock, TrendingUp, TrendingDown, CheckCircle, Brain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
  ComposedChart,
  Legend,
} from "recharts"

export default function CallCenterDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedComparison, setSelectedComparison] = useState("yesterday")
  const [selectedModel, setSelectedModel] = useState("real")
  const [isSimulating, setIsSimulating] = useState(false)
  const [isTrainingML, setIsTrainingML] = useState(false)
  const [simulationRun, setSimulationRun] = useState(1)
  const [mlRun, setMlRun] = useState(1)
  const [chartKey, setChartKey] = useState(0)
  const [chartsReady, setChartsReady] = useState(false)

  // Estados para datos dinámicos
  const [waitingTimeDistribution, setWaitingTimeDistribution] = useState([
    { time: 0, real_freq: 0.45, simulated_freq: 0.42, real_density: 0.38, simulated_density: 0.35 },
    { time: 0.5, real_freq: 0.32, simulated_freq: 0.35, real_density: 0.42, simulated_density: 0.45 },
    { time: 1, real_freq: 0.18, simulated_freq: 0.16, real_density: 0.28, simulated_density: 0.25 },
    { time: 1.5, real_freq: 0.12, simulated_freq: 0.14, real_density: 0.18, simulated_density: 0.2 },
    { time: 2, real_freq: 0.08, simulated_freq: 0.09, real_density: 0.12, simulated_density: 0.14 },
    { time: 2.5, real_freq: 0.05, simulated_freq: 0.06, real_density: 0.08, simulated_density: 0.09 },
    { time: 3, real_freq: 0.03, simulated_freq: 0.04, real_density: 0.05, simulated_density: 0.06 },
    { time: 3.5, real_freq: 0.02, simulated_freq: 0.02, real_density: 0.03, simulated_density: 0.03 },
    { time: 4, real_freq: 0.01, simulated_freq: 0.01, real_density: 0.02, simulated_density: 0.02 },
  ])

  const [cdfComparisonData, setCdfComparisonData] = useState([
    { x: 0, empirical_cdf: 0, theoretical_cdf: 0 },
    { x: 0.5, empirical_cdf: 0.23, theoretical_cdf: 0.21 },
    { x: 1, empirical_cdf: 0.45, theoretical_cdf: 0.43 },
    { x: 1.5, empirical_cdf: 0.62, theoretical_cdf: 0.61 },
    { x: 2, empirical_cdf: 0.75, theoretical_cdf: 0.74 },
    { x: 2.5, empirical_cdf: 0.84, theoretical_cdf: 0.83 },
    { x: 3, empirical_cdf: 0.91, theoretical_cdf: 0.9 },
    { x: 3.5, empirical_cdf: 0.95, theoretical_cdf: 0.94 },
    { x: 4, empirical_cdf: 0.98, theoretical_cdf: 0.97 },
    { x: 4.5, empirical_cdf: 0.99, theoretical_cdf: 0.99 },
    { x: 5, empirical_cdf: 1.0, theoretical_cdf: 1.0 },
  ])

  const [slaByHourData, setSlaByHourData] = useState([
    { minute: 480, real_prob: 0.95, simulated_prob: 0.93 },
    { minute: 540, real_prob: 0.92, simulated_prob: 0.9 },
    { minute: 600, real_prob: 0.88, simulated_prob: 0.85 },
    { minute: 660, real_prob: 0.91, simulated_prob: 0.89 },
    { minute: 720, real_prob: 0.96, simulated_prob: 0.94 },
    { minute: 780, real_prob: 0.94, simulated_prob: 0.92 },
    { minute: 840, real_prob: 0.89, simulated_prob: 0.87 },
    { minute: 900, real_prob: 0.85, simulated_prob: 0.83 },
    { minute: 960, real_prob: 0.82, simulated_prob: 0.8 },
    { minute: 1020, real_prob: 0.87, simulated_prob: 0.85 },
  ])

  const [featureImportanceData, setFeatureImportanceData] = useState([
    { feature: "Tiempo de Servicio", real_importance: 0.45, simulated_importance: 0.42 },
    { feature: "Minuto de Llegada", real_importance: 0.28, simulated_importance: 0.31 },
    { feature: "Día de la Semana", real_importance: 0.18, simulated_importance: 0.16 },
    { feature: "Mes", real_importance: 0.09, simulated_importance: 0.11 },
  ])

  const [modelPerformanceData, setModelPerformanceData] = useState([
    { metric: "Precisión", real_model: 0.87, simulated_model: 0.84 },
    { metric: "Recall", real_model: 0.82, simulated_model: 0.79 },
    { metric: "F1-Score", real_model: 0.84, simulated_model: 0.81 },
    { metric: "AUC-ROC", real_model: 0.91, simulated_model: 0.88 },
  ])

  const [residualAnalysisData, setResidualAnalysisData] = useState([
    { predicted: 0.1, residual: 0.05, actual: 0.15 },
    { predicted: 0.3, residual: -0.02, actual: 0.28 },
    { predicted: 0.5, residual: 0.08, actual: 0.58 },
    { predicted: 0.7, residual: -0.05, actual: 0.65 },
    { predicted: 0.9, residual: 0.03, actual: 0.93 },
    { predicted: 0.2, residual: -0.08, actual: 0.12 },
    { predicted: 0.6, residual: 0.12, actual: 0.72 },
    { predicted: 0.8, residual: -0.06, actual: 0.74 },
    { predicted: 0.4, residual: 0.09, actual: 0.49 },
    { predicted: 0.35, residual: -0.04, actual: 0.31 },
  ])

  const [predictionIntervalsData, setPredictionIntervalsData] = useState([
    { time: "08:00", prediction: 0.94, lower_ci: 0.91, upper_ci: 0.97, actual: 0.95 },
    { time: "09:00", prediction: 0.89, lower_ci: 0.86, upper_ci: 0.92, actual: 0.87 },
    { time: "10:00", prediction: 0.85, lower_ci: 0.82, upper_ci: 0.88, actual: 0.86 },
    { time: "11:00", prediction: 0.91, lower_ci: 0.88, upper_ci: 0.94, actual: 0.9 },
    { time: "12:00", prediction: 0.96, lower_ci: 0.93, upper_ci: 0.99, actual: 0.97 },
    { time: "13:00", prediction: 0.93, lower_ci: 0.9, upper_ci: 0.96, actual: 0.94 },
    { time: "14:00", prediction: 0.88, lower_ci: 0.85, upper_ci: 0.91, actual: 0.89 },
    { time: "15:00", prediction: 0.84, lower_ci: 0.81, upper_ci: 0.87, actual: 0.83 },
  ])

  // Datos simulados para el dashboard
  const kpiData = {
    slaCompliance: 94.2,
    avgWaitTime: 45,
    avgServiceTime: 180,
    callsAnswered: 1247,
    callsAbandoned: 78,
    totalCalls: 1325,
    agentsActive: 24,
    agentsTotal: 30,
  }

  // Datos para gráficos básicos
  const hourlyCallsData = [
    { hour: "08:00", calls: 89, answered: 86, abandoned: 3 },
    { hour: "09:00", calls: 124, answered: 116, abandoned: 8 },
    { hour: "10:00", calls: 156, answered: 144, abandoned: 12 },
    { hour: "11:00", calls: 143, answered: 137, abandoned: 6 },
    { hour: "12:00", calls: 98, answered: 96, abandoned: 2 },
    { hour: "13:00", calls: 112, answered: 107, abandoned: 5 },
    { hour: "14:00", calls: 134, answered: 128, abandoned: 6 },
    { hour: "15:00", calls: 167, answered: 158, abandoned: 9 },
    { hour: "16:00", calls: 189, answered: 176, abandoned: 13 },
    { hour: "17:00", calls: 145, answered: 138, abandoned: 7 },
  ]

  const slaWeeklyData = [
    { day: "Lun", sla: 92.1, target: 90 },
    { day: "Mar", sla: 94.5, target: 90 },
    { day: "Mié", sla: 91.8, target: 90 },
    { day: "Jue", sla: 96.2, target: 90 },
    { day: "Vie", sla: 93.7, target: 90 },
    { day: "Sáb", sla: 95.1, target: 90 },
    { day: "Dom", sla: 94.2, target: 90 },
  ]

  const weeklyComparisonData = [
    { day: "Lun", actual: 1156, previous: 1089 },
    { day: "Mar", actual: 1234, previous: 1167 },
    { day: "Mié", actual: 1189, previous: 1245 },
    { day: "Jue", actual: 1298, previous: 1201 },
    { day: "Vie", actual: 1325, previous: 1278 },
    { day: "Sáb", actual: 987, previous: 945 },
    { day: "Dom", actual: 856, previous: 823 },
  ]

  const consultationTypesData = [
    { name: "Soporte Técnico", value: 35, color: "#0088FE" },
    { name: "Facturación", value: 25, color: "#00C49F" },
    { name: "Ventas", value: 20, color: "#FFBB28" },
    { name: "Reclamos", value: 15, color: "#FF8042" },
    { name: "Otros", value: 5, color: "#8884D8" },
  ]

  // Forzar re-render de gráficos
  useEffect(() => {
    setChartKey((prev) => prev + 1)
  }, [
    waitingTimeDistribution,
    cdfComparisonData,
    slaByHourData,
    featureImportanceData,
    modelPerformanceData,
    residualAnalysisData,
    predictionIntervalsData,
  ])

  // Asegurar que los gráficos se rendericen correctamente
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartsReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Forzar re-render cuando se cambie a la pestaña de Machine Learning
  useEffect(() => {
    if (chartsReady) {
      setChartKey((prev) => prev + 1)
    }
  }, [chartsReady])

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return "text-green-600"
    if (value >= threshold * 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (value: number, threshold: number) => {
    if (value >= threshold) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    if (value >= threshold * 0.8) return <Badge className="bg-yellow-100 text-yellow-800">Aceptable</Badge>
    return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
  }

  // Funciones de simulación y ML
  const generateRealisticVariation = (baseValue: number, variance = 0.1) => {
    const variation = (Math.random() - 0.5) * 2 * variance
    return Math.max(0, baseValue * (1 + variation))
  }

  const simulateNewData = () => {
    setIsSimulating(true)

    setTimeout(() => {
      // Actualizar datos de distribución de tiempos de espera
      const newWaitingTimeDistribution = waitingTimeDistribution.map((item) => ({
        ...item,
        real_freq: generateRealisticVariation(item.real_freq, 0.15),
        simulated_freq: generateRealisticVariation(item.simulated_freq, 0.15),
        real_density: generateRealisticVariation(item.real_density, 0.12),
        simulated_density: generateRealisticVariation(item.simulated_density, 0.12),
      }))

      // Actualizar CDF
      const newCdfData = cdfComparisonData.map((item) => ({
        ...item,
        empirical_cdf: Math.min(1, Math.max(0, generateRealisticVariation(item.empirical_cdf, 0.05))),
        theoretical_cdf: Math.min(1, Math.max(0, generateRealisticVariation(item.theoretical_cdf, 0.05))),
      }))

      // Actualizar probabilidades de SLA por hora
      const newSlaByHourData = slaByHourData.map((item) => ({
        ...item,
        real_prob: Math.min(1, Math.max(0.75, generateRealisticVariation(item.real_prob, 0.08))),
        simulated_prob: Math.min(1, Math.max(0.75, generateRealisticVariation(item.simulated_prob, 0.08))),
      }))

      // Actualizar análisis de residuos
      const newResidualData = residualAnalysisData.map((item) => ({
        ...item,
        residual: generateRealisticVariation(item.residual, 0.3),
        predicted: Math.min(1, Math.max(0, generateRealisticVariation(item.predicted, 0.1))),
        actual: Math.min(1, Math.max(0, generateRealisticVariation(item.actual, 0.1))),
      }))

      // Actualizar intervalos de predicción
      const newPredictionData = predictionIntervalsData.map((item) => ({
        ...item,
        prediction: Math.min(1, Math.max(0.75, generateRealisticVariation(item.prediction, 0.06))),
        lower_ci: Math.min(1, Math.max(0.7, generateRealisticVariation(item.lower_ci, 0.06))),
        upper_ci: Math.min(1, Math.max(0.8, generateRealisticVariation(item.upper_ci, 0.06))),
        actual: Math.min(1, Math.max(0.75, generateRealisticVariation(item.actual, 0.06))),
      }))

      setWaitingTimeDistribution(newWaitingTimeDistribution)
      setCdfComparisonData(newCdfData)
      setSlaByHourData(newSlaByHourData)
      setResidualAnalysisData(newResidualData)
      setPredictionIntervalsData(newPredictionData)
      setSimulationRun((prev) => prev + 1)
      setIsSimulating(false)
    }, 2000)
  }

  const trainNewModel = () => {
    setIsTrainingML(true)

    setTimeout(() => {
      // Actualizar importancia de variables
      const newFeatureImportanceData = featureImportanceData.map((item) => {
        const newRealImportance = generateRealisticVariation(item.real_importance, 0.2)
        const newSimImportance = generateRealisticVariation(item.simulated_importance, 0.2)
        return {
          ...item,
          real_importance: newRealImportance,
          simulated_importance: newSimImportance,
        }
      })

      // Normalizar importancias para que sumen 1
      const realSum = newFeatureImportanceData.reduce((sum, item) => sum + item.real_importance, 0)
      const simSum = newFeatureImportanceData.reduce((sum, item) => sum + item.simulated_importance, 0)

      const normalizedFeatureData = newFeatureImportanceData.map((item) => ({
        ...item,
        real_importance: item.real_importance / realSum,
        simulated_importance: item.simulated_importance / simSum,
      }))

      // Actualizar performance del modelo
      const newModelPerformanceData = modelPerformanceData.map((item) => ({
        ...item,
        real_model: Math.min(1, Math.max(0.7, generateRealisticVariation(item.real_model, 0.05))),
        simulated_model: Math.min(1, Math.max(0.7, generateRealisticVariation(item.simulated_model, 0.05))),
      }))

      setFeatureImportanceData(normalizedFeatureData)
      setModelPerformanceData(newModelPerformanceData)
      setMlRun((prev) => prev + 1)
      setIsTrainingML(false)
    }, 3000)
  }

  // Función para obtener datos según el modelo seleccionado
  const getDataForModel = (realData: any, simulatedData: any, field: string) => {
    switch (selectedModel) {
      case "real":
        return field.includes("real") ? realData : 0
      case "simulated":
        return field.includes("simulated") ? simulatedData : 0
      case "comparison":
      default:
        return field.includes("real") ? realData : simulatedData
    }
  }

  // Filtrar datos según el modelo seleccionado
  const getFilteredWaitingTimeData = () => {
    return waitingTimeDistribution.map((item) => ({
      ...item,
      real_density: selectedModel === "simulated" ? 0 : item.real_density,
      simulated_density: selectedModel === "real" ? 0 : item.simulated_density,
    }))
  }

  const getFilteredSlaData = () => {
    return slaByHourData.map((item) => ({
      ...item,
      real_prob: selectedModel === "simulated" ? 0 : item.real_prob,
      simulated_prob: selectedModel === "real" ? 0 : item.simulated_prob,
    }))
  }

  const getFilteredFeatureData = () => {
    return featureImportanceData.map((item) => ({
      ...item,
      real_importance: selectedModel === "simulated" ? 0 : item.real_importance,
      simulated_importance: selectedModel === "real" ? 0 : item.simulated_importance,
    }))
  }

  const getFilteredModelData = () => {
    return modelPerformanceData.map((item) => ({
      ...item,
      real_model: selectedModel === "simulated" ? 0 : item.real_model,
      simulated_model: selectedModel === "real" ? 0 : item.simulated_model,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Llamadas - Dashboard Operativo</h1>
            <p className="text-gray-600">Análisis avanzado con Machine Learning y simulación estadística</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cumplimiento SLA</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{kpiData.slaCompliance}%</div>
              <div className="flex items-center justify-between mt-2">
                <Progress value={kpiData.slaCompliance} className="flex-1 mr-2" />
                {getStatusBadge(kpiData.slaCompliance, 90)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Meta: 90% | +2.1% vs ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio de Espera</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(60 - kpiData.avgWaitTime, 15)}`}>
                {kpiData.avgWaitTime}s
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress value={Math.max(0, 100 - (kpiData.avgWaitTime / 60) * 100)} className="flex-1 mr-2" />
                {getStatusBadge(60 - kpiData.avgWaitTime, 15)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Meta: {"<"}60s | -5s vs ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Llamadas Atendidas</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpiData.callsAnswered.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2% vs ayer</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {kpiData.totalCalls.toLocaleString()} llamadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precisión del Modelo ML</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(modelPerformanceData.find((m) => m.metric === "Precisión")?.real_model * 100 || 87.3).toFixed(1)}%
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress
                  value={modelPerformanceData.find((m) => m.metric === "Precisión")?.real_model * 100 || 87.3}
                  className="flex-1 mr-2"
                />
                <Badge className="bg-purple-100 text-purple-800">Óptimo</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                F1-Score: {(modelPerformanceData.find((m) => m.metric === "F1-Score")?.real_model || 0.84).toFixed(2)} |
                AUC: {(modelPerformanceData.find((m) => m.metric === "AUC-ROC")?.real_model || 0.91).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes vistas */}
        <Tabs defaultValue="machine-learning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="machine-learning">Machine Learning</TabsTrigger>
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="comparison">Comparaciones</TabsTrigger>
            <TabsTrigger value="agents">Agentes</TabsTrigger>
          </TabsList>

          <TabsContent value="machine-learning" className="space-y-6">
            {/* Selector de modelo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Modelo de Análisis:</span>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real">Datos Reales</SelectItem>
                    <SelectItem value="simulated">Datos Simulados</SelectItem>
                    <SelectItem value="comparison">Comparación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={simulateNewData}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Simulando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Simular de Nuevo
                    </>
                  )}
                </button>

                <button
                  onClick={trainNewModel}
                  disabled={isTrainingML}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTrainingML ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrenando...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Entrenar Modelo ML
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Simulación #{simulationRun}</p>
                    <p className="text-xs text-blue-600">Última ejecución: {new Date().toLocaleTimeString()}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${isSimulating ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Modelo ML #{mlRun}</p>
                    <p className="text-xs text-purple-600">
                      Precisión actual:{" "}
                      {(modelPerformanceData.find((m) => m.metric === "Precisión")?.real_model * 100 || 87.3).toFixed(
                        1,
                      )}
                      %
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${isTrainingML ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Análisis de distribuciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>PDF Empírica vs Teórica - Tiempos de Espera</CardTitle>
                  <CardDescription>Distribución de densidad de probabilidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      real_density: {
                        label: "Machine Learning",
                        color: "hsl(var(--chart-1))",
                      },
                      simulated_density: {
                        label: "Simulación",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart key={`waiting-${chartKey}`} data={getFilteredWaitingTimeData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="time"
                            label={{ value: "Tiempo de Espera (min)", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis label={{ value: "Densidad", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {selectedModel !== "simulated" && (
                            <Line
                              type="monotone"
                              dataKey="real_density"
                              stroke="var(--color-real_density)"
                              strokeWidth={2}
                              dot={{ fill: "var(--color-real_density)", strokeWidth: 2, r: 3 }}
                            />
                          )}
                          {selectedModel !== "real" && (
                            <Line
                              type="monotone"
                              dataKey="simulated_density"
                              stroke="var(--color-simulated_density)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ fill: "var(--color-simulated_density)", strokeWidth: 2, r: 3 }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CDF Empírica vs Teórica</CardTitle>
                  <CardDescription>Función de distribución acumulativa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      empirical_cdf: {
                        label: "CDF Empírica",
                        color: "hsl(var(--chart-3))",
                      },
                      theoretical_cdf: {
                        label: "CDF Teórica",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart key={`cdf-${chartKey}`} data={cdfComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="x" label={{ value: "x", position: "insideBottom", offset: -5 }} />
                          <YAxis label={{ value: "F(x)", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="stepAfter"
                            dataKey="empirical_cdf"
                            stroke="var(--color-empirical_cdf)"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="theoretical_cdf"
                            stroke="var(--color-theoretical_cdf)"
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Probabilidad de SLA por hora */}
            <Card>
              <CardHeader>
                <CardTitle>Probabilidad de Cumplir SLA por Hora del Día</CardTitle>
                <CardDescription>Comparación entre datos reales y simulados</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    real_prob: {
                      label: "Machine Learning",
                      color: "hsl(var(--chart-1))",
                    },
                    simulated_prob: {
                      label: "Simulación",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  {chartsReady && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart key={`sla-${chartKey}`} data={getFilteredSlaData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="minute"
                          tickFormatter={(value) =>
                            `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, "0")}`
                          }
                          label={{ value: "Hora del Día", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis
                          domain={[0.75, 1]}
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          label={{ value: "Probabilidad SLA", angle: -90, position: "insideLeft" }}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) =>
                            `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, "0")}`
                          }
                          formatter={(value) => [`${(value * 100).toFixed(1)}%`, ""]}
                        />
                        <Legend />
                        {selectedModel !== "simulated" && (
                          <Line
                            type="monotone"
                            dataKey="real_prob"
                            stroke="var(--color-real_prob)"
                            strokeWidth={3}
                            dot={{ fill: "var(--color-real_prob)", strokeWidth: 2, r: 4 }}
                          />
                        )}
                        {selectedModel !== "real" && (
                          <Line
                            type="monotone"
                            dataKey="simulated_prob"
                            stroke="var(--color-simulated_prob)"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ fill: "var(--color-simulated_prob)", strokeWidth: 2, r: 4 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  {!chartsReady && (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-sm text-gray-500">Cargando gráfico...</div>
                    </div>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Importancia de variables y performance del modelo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Importancia de Variables (Feature Importance)</CardTitle>
                  <CardDescription>Random Forest - Comparación de modelos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      real_importance: {
                        label: "Machine Learning",
                        color: "hsl(var(--chart-1))",
                      },
                      simulated_importance: {
                        label: "Simulación",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          key={`feature-${chartKey}`}
                          data={getFilteredFeatureData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} interval={0} />
                          <YAxis label={{ value: "Importancia", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {selectedModel !== "simulated" && (
                            <Bar dataKey="real_importance" fill="var(--color-real_importance)" name="Modelo Real" />
                          )}
                          {selectedModel !== "real" && (
                            <Bar
                              dataKey="simulated_importance"
                              fill="var(--color-simulated_importance)"
                              name="Modelo Simulado"
                            />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance de Modelos ML</CardTitle>
                  <CardDescription>Métricas de evaluación comparativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      real_model: {
                        label: "Machine Learning",
                        color: "hsl(var(--chart-3))",
                      },
                      simulated_model: {
                        label: "Simulación",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={`performance-${chartKey}`} data={getFilteredModelData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis domain={[0.7, 1]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {selectedModel !== "simulated" && <Bar dataKey="real_model" fill="var(--color-real_model)" />}
                          {selectedModel !== "real" && (
                            <Bar dataKey="simulated_model" fill="var(--color-simulated_model)" />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Análisis de residuos y predicciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Residuos</CardTitle>
                  <CardDescription>Residuos vs Valores Predichos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      residual: {
                        label: "Residuos",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart key={`residual-${chartKey}`} data={residualAnalysisData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="predicted"
                            label={{ value: "Valores Predichos", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis label={{ value: "Residuos", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                          <Scatter dataKey="residual" fill="var(--color-residual)" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intervalos de Predicción</CardTitle>
                  <CardDescription>Predicciones con intervalos de confianza</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      prediction: {
                        label: "Predicción",
                        color: "hsl(var(--chart-1))",
                      },
                      actual: {
                        label: "Valor Real",
                        color: "hsl(var(--chart-2))",
                      },
                      lower_ci: {
                        label: "IC Inferior",
                        color: "hsl(var(--chart-3))",
                      },
                      upper_ci: {
                        label: "IC Superior",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart key={`prediction-${chartKey}`} data={predictionIntervalsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0.8, 1]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area dataKey="upper_ci" stroke="none" fill="var(--color-lower_ci)" fillOpacity={0.2} />
                          <Area dataKey="lower_ci" stroke="none" fill="white" fillOpacity={1} />
                          <Line
                            type="monotone"
                            dataKey="prediction"
                            stroke="var(--color-prediction)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-prediction)", strokeWidth: 2, r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="var(--color-actual)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-actual)", strokeWidth: 2, r: 3 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Métricas estadísticas avanzadas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Test Kolmogorov-Smirnov</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {(0.023 + (Math.random() - 0.5) * 0.01).toFixed(3)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    p-value: {(0.156 + (Math.random() - 0.5) * 0.05).toFixed(3)}
                  </p>
                  <Badge className="bg-green-100 text-green-800 mt-2">No Rechazado</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">R² Ajustado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(0.847 + (Math.random() - 0.5) * 0.05).toFixed(3)}
                  </div>
                  <p className="text-xs text-muted-foreground">Bondad de ajuste</p>
                  <Badge className="bg-blue-100 text-blue-800 mt-2">Excelente</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">RMSE</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {(0.089 + (Math.random() - 0.5) * 0.02).toFixed(3)}
                  </div>
                  <p className="text-xs text-muted-foreground">Error cuadrático medio</p>
                  <Badge className="bg-orange-100 text-orange-800 mt-2">Aceptable</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AIC/BIC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {(-245.7 + (Math.random() - 0.5) * 20).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Criterio información</p>
                  <Badge className="bg-purple-100 text-purple-800 mt-2">Óptimo</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Matriz de confusión simulada */}
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Confusión - Modelo Random Forest</CardTitle>
                <CardDescription>Clasificación de cumplimiento de SLA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-4 text-center">Datos Reales</h4>
                    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                      <div className="text-center text-xs font-medium p-2">Predicho</div>
                      <div className="text-center text-xs font-medium p-2">Real</div>
                      <div className="bg-green-100 p-4 text-center font-bold">
                        <div className="text-2xl text-green-800">{Math.floor(847 + (Math.random() - 0.5) * 50)}</div>
                        <div className="text-xs text-green-600">VP</div>
                      </div>
                      <div className="bg-red-100 p-4 text-center font-bold">
                        <div className="text-2xl text-red-800">{Math.floor(23 + (Math.random() - 0.5) * 10)}</div>
                        <div className="text-xs text-red-600">FN</div>
                      </div>
                      <div className="bg-red-100 p-4 text-center font-bold">
                        <div className="text-2xl text-red-800">{Math.floor(31 + (Math.random() - 0.5) * 10)}</div>
                        <div className="text-xs text-red-600">FP</div>
                      </div>
                      <div className="bg-green-100 p-4 text-center font-bold">
                        <div className="text-2xl text-green-800">{Math.floor(156 + (Math.random() - 0.5) * 20)}</div>
                        <div className="text-xs text-green-600">VN</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Precisión:{" "}
                        {(modelPerformanceData.find((m) => m.metric === "Precisión")?.real_model * 100 || 87.3).toFixed(
                          1,
                        )}
                        %
                      </p>
                      <p className="text-sm text-gray-600">
                        Recall:{" "}
                        {(modelPerformanceData.find((m) => m.metric === "Recall")?.real_model * 100 || 82.1).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4 text-center">Datos Simulados</h4>
                    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                      <div className="text-center text-xs font-medium p-2">Predicho</div>
                      <div className="text-center text-xs font-medium p-2">Real</div>
                      <div className="bg-green-100 p-4 text-center font-bold">
                        <div className="text-2xl text-green-800">{Math.floor(823 + (Math.random() - 0.5) * 50)}</div>
                        <div className="text-xs text-green-600">VP</div>
                      </div>
                      <div className="bg-red-100 p-4 text-center font-bold">
                        <div className="text-2xl text-red-800">{Math.floor(29 + (Math.random() - 0.5) * 10)}</div>
                        <div className="text-xs text-red-600">FN</div>
                      </div>
                      <div className="bg-red-100 p-4 text-center font-bold">
                        <div className="text-2xl text-red-800">{Math.floor(38 + (Math.random() - 0.5) * 10)}</div>
                        <div className="text-xs text-red-600">FP</div>
                      </div>
                      <div className="bg-green-100 p-4 text-center font-bold">
                        <div className="text-2xl text-green-800">{Math.floor(142 + (Math.random() - 0.5) * 20)}</div>
                        <div className="text-xs text-green-600">VN</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Precisión:{" "}
                        {(
                          modelPerformanceData.find((m) => m.metric === "Precisión")?.simulated_model * 100 || 84.1
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="text-sm text-gray-600">
                        Recall:{" "}
                        {(
                          modelPerformanceData.find((m) => m.metric === "Recall")?.simulated_model * 100 || 79.3
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de tendencia de llamadas */}
              <Card>
                <CardHeader>
                  <CardTitle>Volumen de Llamadas - Últimas 24 horas</CardTitle>
                  <CardDescription>Llamadas recibidas por hora</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      calls: {
                        label: "Total Llamadas",
                        color: "hsl(var(--chart-1))",
                      },
                      answered: {
                        label: "Atendidas",
                        color: "hsl(var(--chart-2))",
                      },
                      abandoned: {
                        label: "Abandonadas",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hourlyCallsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="calls"
                            stackId="1"
                            stroke="var(--color-calls)"
                            fill="var(--color-calls)"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="answered"
                            stackId="2"
                            stroke="var(--color-answered)"
                            fill="var(--color-answered)"
                            fillOpacity={0.8}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Distribución de tipos de llamada */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo de Consulta</CardTitle>
                  <CardDescription>Categorización de llamadas del día</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      soporte: { label: "Soporte Técnico", color: "#0088FE" },
                      facturacion: { label: "Facturación", color: "#00C49F" },
                      ventas: { label: "Ventas", color: "#FFBB28" },
                      reclamos: { label: "Reclamos", color: "#FF8042" },
                      otros: { label: "Otros", color: "#8884D8" },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={consultationTypesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {consultationTypesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Métricas detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Abandono</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Llamadas Abandonadas</span>
                    <span className="font-semibold text-red-600">{kpiData.callsAbandoned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasa de Abandono</span>
                    <span className="font-semibold">5.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo Prom. Abandono</span>
                    <span className="font-semibold">32s</span>
                  </div>
                  <Progress value={5.9} className="mt-2" />
                  <p className="text-xs text-muted-foreground">Meta: {"<"}8%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tiempos de Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo Promedio</span>
                    <span className="font-semibold">
                      {Math.floor(kpiData.avgServiceTime / 60)}m {kpiData.avgServiceTime % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo Máximo</span>
                    <span className="font-semibold">8m 45s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo Mínimo</span>
                    <span className="font-semibold">45s</span>
                  </div>
                  <Progress value={75} className="mt-2" />
                  <p className="text-xs text-muted-foreground">Dentro del rango objetivo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Satisfacción del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CSAT Score</span>
                    <span className="font-semibold text-green-600">4.2/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NPS</span>
                    <span className="font-semibold">+42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Encuestas Completadas</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <Progress value={84} className="mt-2" />
                  <p className="text-xs text-muted-foreground">84% satisfacción general</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de SLA - Últimos 7 días</CardTitle>
                  <CardDescription>Porcentaje de cumplimiento diario</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sla: {
                        label: "SLA Actual",
                        color: "hsl(var(--chart-1))",
                      },
                      target: {
                        label: "Meta SLA",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={slaWeeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[85, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="sla"
                            stroke="var(--color-sla)"
                            strokeWidth={3}
                            dot={{ fill: "var(--color-sla)", strokeWidth: 2, r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            stroke="var(--color-target)"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparativo de Métricas por Día</CardTitle>
                  <CardDescription>Rendimiento semanal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      actual: {
                        label: "Semana Actual",
                        color: "hsl(var(--chart-1))",
                      },
                      previous: {
                        label: "Semana Anterior",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    {chartsReady && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="actual" fill="var(--color-actual)" />
                          <Bar dataKey="previous" fill="var(--color-previous)" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {!chartsReady && (
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-sm text-gray-500">Cargando gráfico...</div>
                      </div>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de rendimiento por hora */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Franja Horaria</CardTitle>
                <CardDescription>Métricas detalladas del día actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Hora</th>
                        <th className="text-left p-2">Llamadas</th>
                        <th className="text-left p-2">SLA %</th>
                        <th className="text-left p-2">Tiempo Espera</th>
                        <th className="text-left p-2">Abandonos</th>
                        <th className="text-left p-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { hour: "08:00-09:00", calls: 89, sla: 96.2, wait: 38, abandoned: 3, status: "Excelente" },
                        { hour: "09:00-10:00", calls: 124, sla: 92.1, wait: 52, abandoned: 8, status: "Bueno" },
                        { hour: "10:00-11:00", calls: 156, sla: 88.7, wait: 67, abandoned: 12, status: "Aceptable" },
                        { hour: "11:00-12:00", calls: 143, sla: 94.3, wait: 41, abandoned: 6, status: "Excelente" },
                        { hour: "12:00-13:00", calls: 98, sla: 97.1, wait: 29, abandoned: 2, status: "Excelente" },
                      ].map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{row.hour}</td>
                          <td className="p-2">{row.calls}</td>
                          <td className="p-2">
                            <span className={getStatusColor(row.sla, 90)}>{row.sla}%</span>
                          </td>
                          <td className="p-2">{row.wait}s</td>
                          <td className="p-2">{row.abandoned}</td>
                          <td className="p-2">
                            <Badge
                              className={
                                row.status === "Excelente"
                                  ? "bg-green-100 text-green-800"
                                  : row.status === "Bueno"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { metric: "SLA Compliance", current: 94.2, previous: 92.1, unit: "%" },
                { metric: "Tiempo de Espera", current: 45, previous: 50, unit: "s" },
                { metric: "Llamadas Atendidas", current: 1247, previous: 1156, unit: "" },
                { metric: "Tasa de Abandono", current: 5.9, previous: 6.8, unit: "%" },
              ].map((item, index) => {
                const change = ((item.current - item.previous) / item.previous) * 100
                const isPositive = item.metric === "Tasa de Abandono" ? change < 0 : change > 0

                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Actual</span>
                          <span className="font-semibold">
                            {item.current}
                            {item.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Anterior</span>
                          <span className="text-sm">
                            {item.previous}
                            {item.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Cambio</span>
                          <div className="flex items-center">
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comparación Real vs Simulado</CardTitle>
                <CardDescription>Análisis de escenarios y proyecciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Escenario Actual</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Agentes activos:</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Llamadas proyectadas:</span>
                        <span className="font-medium">1,325</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">SLA esperado:</span>
                        <span className="font-medium text-green-600">94.2%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Escenario Simulado (+2 agentes)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Agentes activos:</span>
                        <span className="font-medium">26</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Llamadas proyectadas:</span>
                        <span className="font-medium">1,325</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">SLA esperado:</span>
                        <span className="font-medium text-green-600">97.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Agentes Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <p className="text-xs text-muted-foreground">60% del total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">En Llamada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <p className="text-xs text-muted-foreground">20% del total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">En Descanso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">6</div>
                  <p className="text-xs text-muted-foreground">20% del total</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Agentes en Tiempo Real</CardTitle>
                <CardDescription>Monitoreo individual de performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Agente</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Llamadas Hoy</th>
                        <th className="text-left p-2">Tiempo Promedio</th>
                        <th className="text-left p-2">CSAT</th>
                        <th className="text-left p-2">Última Actividad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "Ana García",
                          status: "Disponible",
                          calls: 28,
                          avgTime: "2m 45s",
                          csat: 4.8,
                          lastActivity: "Hace 2 min",
                        },
                        {
                          name: "Carlos López",
                          status: "En llamada",
                          calls: 31,
                          avgTime: "3m 12s",
                          csat: 4.6,
                          lastActivity: "Activo",
                        },
                        {
                          name: "María Rodríguez",
                          status: "Disponible",
                          calls: 25,
                          avgTime: "2m 38s",
                          csat: 4.9,
                          lastActivity: "Hace 1 min",
                        },
                        {
                          name: "Juan Pérez",
                          status: "Descanso",
                          calls: 22,
                          avgTime: "3m 01s",
                          csat: 4.4,
                          lastActivity: "Hace 8 min",
                        },
                        {
                          name: "Laura Martín",
                          status: "En llamada",
                          calls: 29,
                          avgTime: "2m 55s",
                          csat: 4.7,
                          lastActivity: "Activo",
                        },
                      ].map((agent, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{agent.name}</td>
                          <td className="p-2">
                            <Badge
                              className={
                                agent.status === "Disponible"
                                  ? "bg-green-100 text-green-800"
                                  : agent.status === "En llamada"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {agent.status}
                            </Badge>
                          </td>
                          <td className="p-2">{agent.calls}</td>
                          <td className="p-2">{agent.avgTime}</td>
                          <td className="p-2">
                            <span className="text-yellow-600">★</span> {agent.csat}
                          </td>
                          <td className="p-2 text-gray-500">{agent.lastActivity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
