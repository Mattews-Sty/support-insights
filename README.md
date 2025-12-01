# Support Insights

Panel de Indicadores de Soporte - Prototipo MVP

## Descripcion

Aplicacion web para visualizar automaticamente indicadores de soporte a partir de archivos Excel. Permite cargar un archivo Excel con datos de tickets y genera un dashboard interactivo con metricas, graficos y tablas de distribucion por sprint.

## Demo

https://mattews-sty.github.io/support-insights/

## Funcionalidades

- Carga de archivos Excel (.xlsx, .xls) con drag and drop
- Selector de sprint para filtrar datos
- Visualizacion de metricas clave:
  - Total de tickets
  - Tiempo promedio de resolucion
  - Tasa de cierre
  - Tasa de escalamiento
- Graficos de distribucion por prioridad y estado
- Cumplimiento de SLA por nivel de prioridad
- Tablas de distribucion por persona y cliente

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- xlsx

## Instalacion

Requisito: Node.js y npm instalados - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clonar el repositorio
git clone git@github.com:Mattews-Sty/support-insights.git

# Navegar al directorio
cd support-insights

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en puerto 8080 |
| `npm run build` | Genera build de produccion en /dist |
| `npm run preview` | Previsualiza build de produccion |
| `npm run lint` | Ejecuta ESLint |

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── FileUpload.tsx         # Carga de archivos
│   ├── MetricCard.tsx         # Tarjetas de metricas
│   ├── PriorityChart.tsx      # Grafico de prioridades
│   ├── StatusChart.tsx        # Grafico de estados
│   ├── SLAComplianceCard.tsx  # Cumplimiento SLA
│   └── DistributionTable.tsx  # Tablas de distribucion
├── pages/
│   └── Index.tsx              # Dashboard principal
├── types/
│   └── ticket.ts              # Tipos TypeScript
├── utils/
│   ├── excelParser.ts         # Procesador de Excel
│   └── metricsCalculator.ts   # Calculador de metricas
└── App.tsx
```

## Formato del Excel

El archivo Excel debe contener hojas con nombres de meses en espanol (enero, febrero, etc.) con las siguientes columnas:

- FECHA DE SOLICITUD
- SPRINT
- CLIENTE
- TIPO DE SOLICITUD (debe ser "Soporte")
- PRIORIDAD
- ASIGNACION
- ESTADO
- FECHA DE SOLUCION
- TIEMPO DE SOLUCION

## Deploy

El proyecto se despliega automaticamente en GitHub Pages mediante GitHub Actions al hacer push a la rama main.
