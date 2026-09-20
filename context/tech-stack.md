# JharSetu MVP — Tech Stack

## Architecture Shape

A **modular monolith**, not a microservice fleet: one Next.js PWA, one
NestJS API, one FastAPI AI worker, one PostgreSQL database. Chosen
because it's realistic for a six-developer team on a hackathon
timeline — module boundaries keep future extraction possible without
needing it now.

## Core Stack

| Layer       | Technology                                               | Role                                                    |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------- |
| Frontend    | Next.js (App Router) + TypeScript, PWA/Workbox            | Role-aware citizen/reviewer/officer/gov/university/partner UI, installable, offline draft support |
| UI          | Tailwind CSS + shadcn/ui, React Hook Form + Zod            | Components, forms, client-side validation                |
| API         | NestJS + TypeScript, REST + Swagger                        | Workflow/state-machine engine, RBAC, DTO validation        |
| AI worker   | Python 3.11, FastAPI, Pydantic                             | Async transcription, PII redaction, structured extraction, embeddings |
| Database    | PostgreSQL 16 + PostGIS + pgvector, TypeORM migrations     | Transactional source of truth, geo queries, vector similarity search |
| Jobs/queue  | Redis + BullMQ                                             | Async AI jobs, notifications, retries                      |
| Maps/Charts | Leaflet + react-leaflet (MVP fast-path, CARTO Positron light tiles; MapLibre vector tiles deferred to post-MVP production), Apache ECharts | Incident geo-pinning, cluster geography, dashboard visuals |

## AI Model Set

| Task                     | Component                                              | Notes                                              |
| ------------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| Speech-to-text           | faster-whisper (large-v3-turbo)                          | Citizen can correct; low confidence marked           |
| Language identification  | fastText lid.176 + script checks                          | Routes to manual transcription if unclear             |
| Translation               | Approved Bhashini connector when available; else self-hosted IndicTrans2 | Original text always retained; translation is not evidence replacement |
| PII detection              | Microsoft Presidio + regexes (phone, Aadhaar-like, bank, address) | Reviewer confirms before external/public release        |
| Extraction / classification | Qwen2.5-7B-Instruct, strict JSON schema, temperature 0    | No direct routing; reviewer sees confidence + evidence spans |
| Embedding / retrieval       | BAAI/bge-m3                                              | Only retrieves candidates, never merges automatically   |
| OCR                        | Tesseract (MVP only)                                     | Preview and manual verification required                |

No model decides Path A/B/C, government responsibility, a certificate,
selection, funding, safety, or adoption. No facial recognition,
emotion inference, social scoring, predictive policing, or training on
user reports is in scope.

## Local Development

Docker Compose services: `web`, `api`, `ai-worker`, `postgres`,
`redis`, `minio`, `mail/sms-stub`.

## Explicitly Not in the MVP Stack

- Kubernetes, Kafka, microservices mesh / service mesh
- Blockchain, NFTs, tokens
- Native mobile apps (Android/iOS wrappers)
- Real payment, procurement, or fund-disbursal systems
- A custom foundation model or retraining pipeline
- Live/unapproved integrations with JharSewa, myScheme, CPGRAMS, or
  Bhashini (approved-link/adapter placeholders only)

## Production Direction (Post-MVP, Not Built Now)

- Government-approved cloud/data environment, with data residency and
  security review defined by the authority
- Managed PostgreSQL with backups/PITR, private object store/KMS,
  managed Redis, WAF, monitoring, secret manager
- VPC/private database, service-to-service identity, MFA/SSO for
  officials, vulnerability management, access reviews, disaster
  recovery testing
- Official systems connected only through formally approved adapter
  contracts and data-sharing agreements
