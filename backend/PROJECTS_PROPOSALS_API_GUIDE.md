# Backend Project & Proposal Management Guide

## Table of Contents
- [Overview](#overview)
- [API Endpoints](#api-endpoints)
- [How to Add, Edit, or Remove Projects](#how-to-add-edit-or-remove-projects)
- [How to Add, Edit, or Remove Proposals](#how-to-add-edit-or-remove-proposals)
- [Database Table Structure](#database-table-structure)

---

## Overview
This guide explains how to add, edit, or remove projects and proposals using the backend API. It also ensures the API endpoints match the SQL table structure for correct operation.

---

## API Endpoints

### Projects
- **GET /api/projects** — List all projects
- **POST /api/projects** — Add a new project
- **PUT /api/projects/:id** — Edit a project (not yet implemented)
- **DELETE /api/projects/:id** — Remove a project (not yet implemented)

### Proposals
- **GET /api/proposals** — List all proposals
- **POST /api/proposals** — Add a new proposal
- **PUT /api/proposals/:id** — Edit a proposal (not yet implemented)
- **DELETE /api/proposals/:id** — Remove a proposal (not yet implemented)

---

## How to Add, Edit, or Remove Projects

### Add a Project
Send a POST request to `/api/projects` with a JSON body:
```json
{
  "projectNumber": "PRJ-001",
  "title": "Project Title",
  "department": "Engineering",
  "client": "Client Name",
  "phases": {},
  "pricing": {},
  "tasks": {},
  "status": "Active"
}
```
- All fields except phases, pricing, and tasks are strings. phases, pricing, and tasks should be objects or arrays (they are stored as JSONB).

### Edit a Project
## Edit a Project

**Endpoint:** `PUT /api/projects/:id`

**Request Body:**
```
{
  "projectNumber": "string",
  "title": "string",
  "department": "string",
  "client": "string",
  "phases": [ ... ],
  "pricing": { ... },
  "tasks": [ ... ],
  "status": "string"
}
```

**Response:** Updated project object


## Delete a Project

**Endpoint:** `DELETE /api/projects/:id`

**Response:** `{ "success": true }` on success

- (Not yet implemented) — You would use a DELETE endpoint and provide the project ID.
## Edit a Proposal

**Endpoint:** `PUT /api/proposals/:id`

**Request Body:**
```
{
  "title": "string",
  "department": "string",
  "client": "string",
  "createdBy": "string",
  "qaStatus": "string",
  "phases": [ ... ],
  "pricing": { ... },
  "tasks": [ ... ],
  "comments": "string"
}
```

**Response:** Updated proposal object

---
## Delete a Proposal

**Endpoint:** `DELETE /api/proposals/:id`

**Response:** `{ "success": true }` on success
## How to Add, Edit, or Remove Proposals

### Add a Proposal
Send a POST request to `/api/proposals` with a JSON body:
```json
{
  "title": "Proposal Title",
  "department": "Engineering",
  "client": "Client Name",
  "createdBy": "username",
  "qaStatus": "Pending",
  "phases": {},
  "pricing": {},
  "tasks": {},
  "comments": "Initial proposal."
}
```
- All fields except phases, pricing, and tasks are strings. phases, pricing, and tasks should be objects or arrays (they are stored as JSONB).

### Edit a Proposal
- (Not yet implemented) — You would use a PUT endpoint and provide the proposal ID and updated fields.

### Remove a Proposal
- (Not yet implemented) — You would use a DELETE endpoint and provide the proposal ID.

---

## Database Table Structure

### projects
```
id SERIAL PRIMARY KEY
project_number VARCHAR(255) NOT NULL
title VARCHAR(255) NOT NULL
department VARCHAR(255)
client VARCHAR(255)
phases JSONB
pricing JSONB
tasks JSONB
status VARCHAR(100)
```

### proposals
```
id SERIAL PRIMARY KEY
title VARCHAR(255) NOT NULL
department VARCHAR(255)
client VARCHAR(255)
created_by VARCHAR(255)
qa_status VARCHAR(100)
phases JSONB
pricing JSONB
tasks JSONB
comments TEXT
```

---

## Notes
- The backend API is coded to match these table structures. If you change the database schema, update the backend code accordingly.
- To implement editing or deleting, add PUT and DELETE endpoints in backend/index.js.
- All JSON fields (phases, pricing, tasks) should be sent as objects/arrays in the request body.
