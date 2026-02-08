# 🦴 GreenStick

> **"Fix things while they're slightly broken, before the system totally breaks apart."**

GreenStick is named after the **greenstick fracture** — a type of bone fracture where the bone bends and partially breaks, but doesn't completely snap. Just like this injury requires early intervention to heal properly, GreenStick catches infrastructure problems while they're still manageable, before they cascade into catastrophic failures.

## 🎯 The Problem

Modern SRE teams drown in alerts. By the time an incident is detected, diagnosed, and remediated, significant damage has already occurred. Traditional monitoring tools tell you *what* went wrong, but leave you to figure out *why* and *how to fix it*.

## 💡 The Solution

GreenStick is an **AI-powered incident response platform** that:

1. **Detects Anomalies Automatically** — Continuously scans logs for error patterns, spikes, and critical failures
2. **Analyzes Root Causes** — Uses Gemini AI to correlate events and identify the underlying issue
3. **Recommends Actions** — Provides step-by-step remediation plans with confidence scores
4. **Creates Audit Trails** — Logs every action for compliance and post-incident review

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           GREENSTICK PLATFORM                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     NEXT.JS FRONTEND                             │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │   │
│  │  │  Dashboard  │ │   Agent     │ │    Audit    │ │  Incidents │ │   │
│  │  │   (Stats)   │ │   Panel     │ │    Logs     │ │   Table    │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │   │
│  └────────────────────────────┬────────────────────────────────────┘   │
│                               │ API Routes                              │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     FASTAPI BACKEND                              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐│   │
│  │  │  GreenStick │ │   Anomaly   │ │     API Endpoints           ││   │
│  │  │    Agent    │ │   Scanner   │ │  /analyze, /scan, /stats    ││   │
│  │  └──────┬──────┘ └──────┬──────┘ └─────────────────────────────┘│   │
│  │         │               │                                        │   │
│  │         ▼               ▼                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐│   │
│  │  │               GEMINI AI (Analysis Engine)                   ││   │
│  │  │  • Root cause analysis  • Remediation planning              ││   │
│  │  │  • Historical correlation  • Confidence scoring             ││   │
│  │  └─────────────────────────────────────────────────────────────┘│   │
│  └────────────────────────────┬────────────────────────────────────┘   │
│                               │                                         │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     ELASTICSEARCH                                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐│   │
│  │  │greenstick-  │ │greenstick-  │ │    greenstick-audit         ││   │
│  │  │   logs      │ │  incidents  │ │    (Action History)         ││   │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Log Events → Elasticsearch → Anomaly Scanner → Gemini AI → Remediation Plan
                                    ↓
                              Audit Trail
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Automatic Anomaly Detection** | Scans logs every 60 seconds for error spikes, repeated failures, and critical keywords |
| 🤖 **AI-Powered Analysis** | Gemini AI correlates events, identifies root causes, and suggests fixes |
| 📊 **Real-time Dashboard** | Live stats, incident table, and agent panel in a sleek UI |
| ✅ **Human-in-the-Loop** | Approve or reject AI recommendations before execution |
| 📝 **Audit Trail** | Every action logged for compliance and review |
| 🔐 **API Key Authentication** | Secure access to all endpoints |

---

## � ES|QL-Powered Analytics

GreenStick leverages **Elasticsearch Query Language (ES|QL)** for powerful, real-time analytics — aligning with **Elastic Agent Builder's** tool-based architecture.

### Available ES|QL Tools

| Tool | Description | Endpoint |
|------|-------------|----------|
| **Error Trends** | Analyze error patterns over time | `GET /esql/error-trends` |
| **Service Health** | Real-time health check by service | `GET /esql/service-health` |
| **Trace Analysis** | Follow requests through services | `GET /esql/trace/{trace_id}` |
| **Anomaly Detection** | Find services with unusual error rates | `GET /esql/anomalies` |
| **Tool Execution** | Execute any ES|QL tool dynamically | `POST /esql/execute-tool` |

### Example ES|QL Queries

**Error Trends Analysis:**
```sql
FROM "greenstick-logs"
| WHERE level == "ERROR"
| STATS error_count = COUNT(*) BY DATE_TRUNC(1 hour, @timestamp)
| SORT @timestamp DESC
```

**Service Health Check:**
```sql
FROM "greenstick-logs"
| WHERE @timestamp > NOW() - 1 hour
| STATS total = COUNT(*), errors = COUNT(*) WHERE level == "ERROR" BY service
| EVAL error_rate = ROUND(errors * 100.0 / total, 2)
| SORT error_rate DESC
```

**Anomaly Detection:**
```sql
FROM "greenstick-logs"
| WHERE @timestamp > NOW() - 15 minutes
| STATS error_count = COUNT(*) WHERE level == "ERROR" BY service
| WHERE error_count > 0
| EVAL error_rate = ROUND(error_count * 100.0 / total_count, 2)
| WHERE error_rate > 10
```

---

## �🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Material Icons** — Consistent iconography

### Backend
- **FastAPI** — High-performance Python API
- **Gemini AI** — Google's generative AI for analysis
- **Elasticsearch** — Log storage and querying
- **Pydantic** — Data validation

### Infrastructure
- **Vercel** — Frontend hosting
- **Railway/Render** — Backend hosting
- **Elastic Cloud** — Managed Elasticsearch

---


## 🔑 Quick Access

To try the live demo, use the following access key:
**Access Key:** `greenstick_hackathon_demo_2026`

*(Note: This is a read-only key for the hackathon judges & community)*

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Elasticsearch instance (local or Elastic Cloud)
- Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/greenstick.git
cd greenstick
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```env
ELASTIC_ENDPOINT=https://your-elasticsearch-url
ELASTIC_API_KEY=your-elastic-api-key
GEMINI_API_KEY=your-gemini-api-key
GREENSTICK_API_KEY=gs_your_secure_key
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Set Up the Frontend

```bash
# From project root
npm install
```

Create `.env.local`:
```env
BACKEND_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application

Open [http://localhost:3000](http://localhost:3000) and enter your API key to log in.

---

## 📡 API Endpoints

### Core API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/stats` | GET | Dashboard statistics |
| `/incidents` | GET | List all incidents |
| `/agent/analyze` | POST | Analyze an incident |
| `/agent/scan` | POST | Trigger anomaly scan |
| `/agent/status` | GET | Scanner status |
| `/audit-logs` | GET/POST/PATCH | Audit trail management |

### ES|QL Endpoints (Agent Builder Integration)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/esql/tools` | GET | List available ES|QL-powered tools |
| `/esql/error-trends` | GET | Error trends over time |
| `/esql/service-health` | GET | Service health summary |
| `/esql/trace/{trace_id}` | GET | Trace request through services |
| `/esql/anomalies` | GET | Detect anomalous services |
| `/esql/execute-tool` | POST | Execute an ES|QL tool dynamically |

---

## 🧪 Seeding Test Data

To populate Elasticsearch with sample data:

```bash
cd backend
python seed_data.py
```

This creates realistic log entries, incidents, and audit records for testing.

---

## 📸 Screenshots

### Dashboard
- Real-time statistics cards
- Incident table with severity indicators
- AI Agent panel for analysis

### Agent Analysis
- Enter a trace ID to analyze
- View root cause probability
- See recommended remediation steps
- Approve or reject AI suggestions

### Audit Trail
- Complete history of all AI actions
- Approve/reject status tracking
- Timestamp and confidence scores

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Google Gemini** — AI analysis engine
- **Elastic** — Log management and search
- **Vercel** — Frontend hosting
- **The SRE Community** — For inspiring this project

---

<p align="center">
  <strong>GreenStick</strong> — Catch problems before they break. 🦴
</p>