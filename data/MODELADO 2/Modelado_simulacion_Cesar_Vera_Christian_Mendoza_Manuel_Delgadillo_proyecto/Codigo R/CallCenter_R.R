# Antecedentes
# 
# Este notebook configura un análisis hipotético de un centro de llamadas con datos simulados.
# Imagina una empresa cuyas líneas están abiertas de 8:00 a.m. a 6:00 p.m., de lunes a viernes.
# Cuatro agentes están de servicio en todo momento y cada llamada toma un promedio de 5 minutos
# para ser resuelta.
#
# El gerente del centro de llamadas debe cumplir con un objetivo de rendimiento:
# el 90% de las llamadas deben ser atendidas dentro de 1 minuto.
# Últimamente, el rendimiento ha disminuido. Como experto en análisis de datos,
# te han contratado para analizar su desempeño y hacer recomendaciones que permitan
# que el centro vuelva a alcanzar su objetivo.
#
# El conjunto de datos registra las marcas de tiempo de cuando se realizó una llamada,
# cuando fue atendida y cuando fue completada. Se calculan los tiempos totales de espera
# y de servicio, así como una variable lógica que indica si la llamada fue atendida
# dentro del estándar de rendimiento.

# Simulación de Eventos Discretos
#
# La Simulación de Eventos Discretos nos permite modelar el comportamiento real
# de las llamadas con unas pocas variables simples:
#
# - Tasa de llegada
# - Tasa de servicio
# - Número de agentes
#
# Las simulaciones en este conjunto de datos se realizan utilizando el paquete "simmer"
# (Ucar et al., 2019). Te animo a visitar su sitio web para ver todos los detalles
# y excelentes tutoriales sobre Simulación de Eventos Discretos.
#
# Referencia:
# Ucar I, Smeets B, Azcorra A (2019). “simmer: Discrete-Event Simulation for R.”
# Journal of Statistical Software, 90(2), 1–30.

# Inicializar la sesión de R
#
# Necesitaremos algunas bibliotecas para que esto funcione:

# Cargar librerías necesarias
library(tidyverse)
library(lubridate)
library(MASS)
library(simmer)

# ------------------------------------------------------------------
# Establecer una semilla aleatoria para garantizar que cada ejecución
# produzca los mismos resultados del centro de llamadas
# ------------------------------------------------------------------
set.seed(42)

# ------------------------------------------------------------------
# Crear un DataFrame
#
# Objetivo: simular un año completo de actividad del centro de llamadas.
# - Cada día hábil tendrá su propia simulación, variando la demanda.
# - Se genera una secuencia de fechas para 2021.
# - Con lubridate se extraen mes, día y día de la semana (en texto y numérico).
# - Finalmente se descartan los fines de semana (sábado y domingo).
# ------------------------------------------------------------------

# Inicializar el data frame vacío
df <- NULL

# Generar la secuencia de fechas
df$dates <- seq(as.Date("2021-01-01"),
                as.Date("2021-12-31"),
                by = 1)
df <- as.data.frame(df)

# Elementos “legibles” y numéricos de la fecha
df <- df %>%
  mutate(
    weekday_str = wday(dates, label = TRUE, abbr = FALSE), # nombre del día
    month_str   = month(dates, label = TRUE, abbr = FALSE),# nombre del mes
    day         = mday(dates),                             # día del mes
    year        = year(dates),                             # año
    weekday     = wday(dates, label = FALSE),              # día de la semana (numérico)
    weeknum     = week(dates),                             # número de semana
    monthnum    = month(dates, label = FALSE)              # mes (numérico)
  )

# Eliminar fines de semana (sábado = 7, domingo = 1)
df <- df %>%
  filter(!weekday %in% c(7, 1))

# ------------------------------------------------------------------
# Calcular coeficientes que modifiquen el “nivel de ocupación” diario
# ------------------------------------------------------------------
df <- df %>%
  mutate(
    month_coef   = monthnum / 10,
    weeknum_coef = weeknum / 35,
    weekday_coef = weekday / 100,
    total_coef   = month_coef * (1 + weeknum_coef) + weekday_coef
  )

# Añadir “jitter” (aleatoriedad) a los coeficientes de demanda
for (i in 1:nrow(df)) {
  df$total_coef[i] <- (df$total_coef[i] +
                         rnorm(n = 1, mean = 0, sd = 0.05)) / 3
}

# ------------------------------------------------------------------
# Visualizar el coeficiente de demanda (opcional)
# ------------------------------------------------------------------
par(mar = c(5, 4, 2, 2) + 0.1)
plot(
  df$dates, df$total_coef,
  main = "",
  xlab = "",
  ylab = "Coeficiente de Demanda"
)

# ------------------------------------------------------------------
# Simulador de Cola
#
# Parámetros clave:
# - Número de agentes: 4
# - Tasa de servicio: 5 minutos (distribución exponencial)
# - Tasa base de llegada: 13.7 llamadas/hora
#
# Para cada día:
#   1. Ajustar la tasa de llegada con el coeficiente de demanda.
#   2. Simular durante 600 minutos (10 h laborales) o hasta 500 llamadas.
#   3. Almacenar los resultados en un data frame principal.
# ------------------------------------------------------------------
agents <- 4
base_arrival_rate <- 13.7 / 60  # llamadas por minuto
service_rate <- 5               # media de servicio (min)

# Data frame para los resultados de la simulación
df.calls <- data.frame(matrix(ncol = 8, nrow = 0))

# Bucle por cada fecha para simular
for (i in 1:nrow(df)) {

  inner.date <- df$dates[i]

  # Tasa de llegada del día
  day_arrival_rate <- base_arrival_rate * (1 + df$total_coef[i])

  # Trayectoria del cliente
  customer <- trajectory("Ruta del cliente") %>%
    seize("counter") %>%
    timeout(function() { rexp(1, 1 / service_rate) }) %>%
    release("counter")

  # Definición del centro y ejecución
  centre <- simmer("centre") %>%
    add_resource("counter", agents) %>%
    add_generator("Customer", customer,
                  function() { c(0, rexp(500, day_arrival_rate), -1) })

  centre %>% run(until = 600)

  # Obtener resultados y calcular tiempo de espera
  result <- centre %>%
    get_mon_arrivals() %>%
    transform(waiting_time = end_time - start_time - activity_time)

  # Añadir la fecha correspondiente
  result$date <- inner.date

  # Agregar al data frame principal
  df.calls <- rbind(df.calls, result)
}

# ------------------------------------------------------------------
# Verificación rápida (“Sanity Check”)
# ------------------------------------------------------------------

# Renombrar columnas
colnames(df.calls) <- c(
  "Customer", "start_time", "end_time", "activity_time",
  "finished", "replication", "waiting_time", "date"
)

# Convertir la columna fecha
df.calls$date <- as.Date(df.calls$date,
                         format = "%Y-%m-%d",
                         origin = "1970-01-01")

# ── Llamadas por día ───────────────────────────────────────────────
par(mar = c(5, 4, 2, 2) + 0.1)
df.calls %>%
  group_by(date) %>%
  summarize(calls_per_day = n()) %>%
  plot(
    main = "",
    xlab = "",
    ylab = "Llamadas por día"
  )

# ── Tiempo de espera por llamada ───────────────────────────────────
par(mar = c(5, 4, 2, 2) + 0.1)
plot(
  df.calls$date, df.calls$waiting_time,
  main = "",
  xlab = "",
  ylab = "Tiempo en cola"
)
abline(a = 1, b = 0, col = "red", lwd = 2)

# ------------------------------------------------------------------
# Análisis detallado del último día simulado
# ------------------------------------------------------------------
par(mar = c(5, 4, 2, 2) + 0.1)
plot(
  result$start_time, result$waiting_time,
  xlab = "Hora de inicio (min)",
  ylab = "Tiempo en cola",
  main = paste(
    "Agentes:", agents, "|",
    "Tasa de llegada:", round(day_arrival_rate * 60, 2), "por hora", "|",
    "Servicio medio:", service_rate, "min"
  )
)
abline(a = 1, b = 0, col = "red", lwd = 2)
text(
  x = 0, y = max(result$waiting_time),
  labels = paste(
    "Espera prom.: ", round(mean(result$waiting_time), 2), " min\n",
    "Espera máx.: ", round(max(result$waiting_time), 2), " min", sep = ""
  ),
  cex = 0.8, adj = c(0, 1)
)

# ------------------------------------------------------------------
# Comentarios:
# - La mayoría de las llamadas se atienden de inmediato, pero algunas
#   esperan hasta unos 8 min.
# - Estas esperas elevan la media a ~0.72 min (~43 s).
# - Los tiempos dependen únicamente de los agentes disponibles,
#   la tasa de llegada y la tasa de servicio, mostrando un comportamiento
#   coherente con un centro de llamadas real bajo condiciones similares.
# ------------------------------------------------------------------
