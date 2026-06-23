# Anvaya - CRM Backend API

A robust REST API service built for the Anvaya CRM platform. It provides endpoints for lead tracking, agent management, tagging systems, and detailed reporting analytics.

---

## Quick Start

Follow these steps to run the server locally:

```bash
git clone https://github.com/ShubhamManeSM/anvaya-backend
cd anvaya-backend
npm install
```

Create a `.env` file in the root directory and configure your variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the server:
```bash
npm start      # Or `npm run dev`
```
The server will run on `http://localhost:5000`.

## Technologies
- **Node.js** & **Express** (Server framework)
- **MongoDB** & **Mongoose** (Database & ODM)
- **CORS** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variables)

## Features
- **Lead Tracking**: Create, update, and manage the sales pipeline.
- **Agent Directory**: Manage sales representatives and their assigned leads.
- **Comments System**: Threaded notes and communications on specific leads.
- **Tags Management**: Categorize leads dynamically using custom tags.
- **Reporting Analytics**: Aggregate data for dashboard charts and metrics.

## API Reference

### **Leads**
- `GET /leads` - List all sales leads
- `GET /leads/:id` - Get specific lead details
- `POST /leads` - Create a new lead
- `PUT /leads/:id` - Update lead information

### **Agents**
- `GET /agents` - List all sales agents
- `POST /agents` - Add a new sales agent

### **Comments & Tags**
- `GET /leads/:id/comments` - Fetch comments for a specific lead
- `POST /leads/:id/comments` - Add a comment to a lead
- `GET /tags` - List all available tags

### **Reports**
- `GET /report` - Fetch aggregated sales data and metrics for dashboards

## Contact
For bugs or feature requests, please reach out to [Email Me](mailto:shubhammane7096@gmail.com)
