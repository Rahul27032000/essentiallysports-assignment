# EssentiallySports Backend Assignment

## 📌 Project Description

This project is a backend service that ensures content feed compliance for external syndication feeds such as MSN and Google News.

The system is responsible for:

Validating incoming articles against partner-specific compliance rules (title length, formatting, prohibited topics, etc.).

Processing and transforming articles into the format required by each external partner.

Publishing compliant content to partners while blocking or rejecting non-compliant submissions.

## ⚙️ Config-Driven Compliance

Partner-specific compliance rules are stored in the database (in the Partner table’s config and validationConfig fields).

This means compliance checks can be updated instantly by modifying database configurations — no code deployment is required.

Adding a new partner integration requires very little code; most partner behavior is controlled directly from the database for simplicity and flexibility.

## ⚠️ Failure Handling & Monitoring

All compliance or publishing failures are logged in the AuditLog table.

Each log entry captures the article ID, partner code, status code, error details, and timestamp.

These logs provide traceability and can be used later to build monitoring dashboards or charts.

In addition, failure events are sent to a Microsoft Teams channel for real-time visibility by the editorial/engineering team. (simulated for now but can implement if get the teamid)

This ensures that compliance issues are not only stored but also actively monitored.

## 📊 AuditLog for Analytics

The AuditLog data can be used for:

Tracking failure trends per partner.

Identifying frequent validation errors (e.g., missing thumbnails, title too long).

Generating compliance reports and charts (e.g., success vs failure rate).

Driving new features (e.g., automated pre-checks before submission).

## ✅ In short:
This service not only guarantees content compliance with partners like MSN/Google but also provides visibility into failures (Teams alerts) and monitoring insights (AuditLog analytics) to help prevent repeated issues.

---

## 🚀 Features

- **Content Feed Compliance**  
  Validates articles against partner-specific rules (e.g., title/body length, prohibited words, required fields) to ensure compliance before syndication. Uses `validationConfig` from the Partner model to enforce rules.

- **Error Handling**  
  Differentiates between operational errors (e.g., invalid payloads, missing fields) and non-operational errors (e.g., server bugs). Errors are handled by a centralized `serverErrorHandler` middleware, returning structured responses with error codes and messages.

- **Structured Logging with Winston**  
  Logs requests, responses, and errors to a PostgreSQL `RequestLog` table via a custom PrismaTransport. Includes details like request method, URL, response status, and duration for debugging and monitoring.

- **Audit Logging**  
  Tracks article processing outcomes (`PUBLISHED`, `REJECTED`, `PENDING`) in the `AuditLog` table, storing article ID, partner code, status, and logs for traceability.

- **PostgreSQL with Prisma and pg**  
  Manages database operations (e.g., partners, audit logs, request logs) using pg for type-safe queries and migrations. The schema defines `Partner`, `AuditLog`, and `RequestLog` models using Prisma.

- **Docker Support**  
  Runs the application and PostgreSQL in isolated containers using Docker Compose, ensuring consistent environments across development, staging, and production.

- **Seeding Support**  
  Populates the `Partner` table with initial data (e.g., MSN, Google News configurations) using a `seed.js` script, facilitating quick setup.

- **Cross-Origin Support**  
  Enables CORS to allow API requests from different origins, making the service accessible to frontends hosted on different domains.

## 🛠️ Tech Stack

- **Node.js** – Runtime environment for executing JavaScript server-side
- **Express.js** – Web framework for building RESTful APIs
- **PostgreSQL** – Relational database
- **Prisma** – Type-safe database queries & migrations
- **pg** – database queries and pooling
- **Winston** – Structured logging
- **Docker & Docker Compose** – Containerization for deployment
- **Axios** – External partner API calls (assumed for provider handlers)
- **Nodemon** – Auto-reload for development

---

## 📂 Project Structure

```

essentiallysports-assignment/
├── src/
│ ├── server.js # Entry point for starting the Express server
│ ├── app.js # Express app configuration (middleware, routes)
│ ├── routes/
│ │ ├── index.js # Main router combining all route modules
│ │ ├── article.routes.js # Routes for article processing endpoints
│ ├── controllers/
│ │ ├── article.controller.js # Handlers for article processing logic
│ ├── services/
│ │ ├── article.service.js # Business logic for article validation/processing
│ │ ├── sendToTeams.js # Utility for sending error notifications
│ ├── utils/
│ │ ├── logger/
│ │ │ ├── logger.js # Winston logger with Prisma transport
│ │ ├── auditLogger.js # Audit log creation for article processing
│ │ ├── constants.js # Error codes and messages
│ │ ├── executeQuery.js # Database query execution utility
│ │ ├── partnerUtils.js # Utility to fetch active partners
│ │ ├── sendResponse.js # Standardized response formatting
│ ├── errorHandlers/
│ │ ├── APIErrorHandler.js # Custom error class for API errors
│ │ ├── serverErrorHandler.js # Centralized error handling middleware
│ ├── config/
│ │ ├── config.js # Environment variable configurations
│ │ ├── dbConfig.js # PostgreSQL connection pool setup
│ │ ├── constants/
│ │ │ ├── providerConfig.js # Provider handler mappings
│ ├── validators/
│ │ ├── fieldValidators.js # Validation for required fields
├── prisma/
│ ├── schema.prisma # Prisma schema for database models
├── generated/
│ ├── prisma/ # Generated Prisma client
├── seed.js # Script to seed the Partner table
├── docker-compose.yml # Docker services configuration
├── .example.env # Example environment variable file
├── package.json # Project scripts and dependencies
├── README.md # Project documentation

```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Rahul27032000/essentiallysports-assignment.git
cd essentiallysports-assignment
```

### 2️⃣ Configure environment variables

```bash
cp .example.env .env
```

Update `.env` with your config:

```env
DATABASE_URL="postgresql://myuser:123@localhost:5432/mydb?schema=public"
PORT = 3000
ADDRESS = 0.0.0.0
TEAMS_WEBHOOK_URL=https://example.com/
GOOGLE_API_URL=https://example.com/
MSN_API_URL=https://example.com/
ENVIRONMENT = "staging"
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Run Docker Compose

```bash
docker-compose up -d
```

### 5️⃣ Run database migrations

```bash
npx prisma migrate dev
```

### 6️⃣ Seed the database

```bash
npm run seed
```

### 7️⃣ Start the development server

```bash
npm run dev
```

---

## 📜 Scripts

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `npm start`         | Run the server with Node.js        |
| `npm run dev`       | Run the server with Nodemon        |
| `npm run seed`      | Seed the database                  |
| `docker-compose up` | Start project using Docker Compose |

---

## 📡 API Endpoints

### Health

| Method | Endpoint  | Description                               |
| ------ | --------- | ----------------------------------------- |
| GET    | `/health` | Health check (Check if server is running) |

### Articles

| Method | Endpoint                       | Description                         |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/api/v1/articles/process`     | Process an article for a partner    |
| POST   | `/api/v1/articles/process-all` | Process an article for all partners |

---

### Example – `/api/v1/articles/process`

**Request**

```http
POST /api/v1/articles/process
Content-Type: application/json

{
  "article": {
    "articleId": "12345",
    "title": "Top 10 Sports Highlights of 2025",
    "body": "This article covers the most exciting sports moments of the year...",
    "author": "John Doe",
    "category": "Sports",
    "thumbnail": "https://example.com/thumbnail.jpg"
  },
  "feed": {
    "partnerCode": "MSN"
  }
}
```

**Response (Success)**

```json
{
  "success": true,
  "data": {
    "success": true,
    "partner": "MSN",
    "data": {
      /* partner-specific response */
    }
  },
  "message": "SUCCESS"
}
```

**Response (Failure)**

```json
{
  "success": false,
  "data": {
    "success": false,
    "partner": "MSN",
    "errors": [
      "Title length must be between 10 and 100",
      "Prohibited words in body: gambling"
    ]
  },
  "error": {
    "errorCode": "BAD_REQUEST",
    "errorMessage": "Missing required fields"
  },
  "message": "ERROR"
}
```

---

### Example – `/api/v1/articles/process-all`

**Request**

```http
POST /api/v1/articles/process-all
Content-Type: application/json

{
  "articleId": "12345",
  "title": "Top 10 Sports Highlights of 2025",
  "body": "This article covers the most exciting sports moments of the year...",
  "author": "John Doe",
  "category": "Sports",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "success": ["MSN"],
    "failed": [
      {
        "partner": "GOOGLE",
        "errors": ["Prohibited words in title: clickbait"]
      }
    ],
    "message": "Processed article for 1 success and 1 failed partners"
  },
  "message": "SUCCESS"
}
```

---

## ✅ Error Handling

- **Operational Errors**:
  Gracefully handled with meaningful messages (e.g., missing fields, validation failures). Returned with HTTP `400/404`.

- **Non-Operational Errors**:
  Unexpected issues (e.g., server crash, DB failure). Logged & returned with HTTP `500`.

- Centralized in `serverErrorHandler` for consistent error responses.

---

## 📄 License

This project is licensed under the **ISC License**.
