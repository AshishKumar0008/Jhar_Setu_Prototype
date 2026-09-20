# JharSetu

### Societal Innovation Collaboration Portal

JharSetu is an AI-assisted civic problem management and societal innovation platform that connects citizens, responsible authorities, universities, innovation teams, and industry/CSR partners.

> **Prototype Notice:** JharSetu is a prototype for demonstration and research purposes. It is not an official government website or government service.

## How It Works

```text
Citizen
  ↓
AI Analysis
  ↓
A / B / C Routing
  ├── A → Existing Solution → Guide Citizen
  ├── B → Department → Officer Action
  └── C → Innovation Cell
             ↓
       Innovation Challenge
             ↓
       AI University Matching
             ↓
          University
             ↓
          Proposal
             ↓
       Industry / CSR
             ↓
           Pilot
             ↓
      Impact & Analytics

Decision Paths
Path A — Existing Solution

AI identifies an existing service, process, or solution and guides the citizen.

Path B — Government Action

For problems such as roads, electricity, water leakage, sanitation, etc. AI recommends the category, priority, and responsible department. The department officer makes the final decision and manages the case.

Path C — Innovation

Recurring or unresolved problems can become innovation candidates. The Innovation Cell validates them and creates structured challenges for university collaboration.

AI Layer
The AI pipeline combines:
* Speech-to-text for voice reports
* LLM-based structured problem extraction
* PII redaction
* BGE-M3 semantic similarity
* Existing-solution search
* Duplicate/cluster detection
* A/B/C routing recommendation
* University capability matching

AI recommends; authorized humans validate and act.

| Stakeholder        | Role                                             |
| ------------------ | ------------------------------------------------ |
| Citizen            | Submit and track problems                        |
| Department Officer | Verify and resolve routine cases                 |
| Innovation Cell    | Validate innovation challenges                   |
| University         | Build research/prototype solutions               |
| Industry / CSR     | Funding, mentoring, manufacturing, pilot support |
| Admin              | Platform management and analytics                |


Citizens do not require an authenticated dashboard account. They receive a reference ID for tracking.
Core Features :

* Hindi / English interface
* Text and voice reporting
* Evidence and location
* Anonymous/confidential reporting
* AI analysis and routing
* Department case management
* Innovation challenges
* University capability matching
* University project workflow
* Industry / CSR collaboration
* Pilot readiness
* Audit timeline
* District and category analytics

Project Structure

app/
├── dashboard/
│   ├── admin/
│   ├── department/
│   ├── innovation/
│   ├── university/
│   └── industry/
├── report/
├── track/
└── sign-in/

components/
context/
data/
lib/
public/
supabase/


Prototype Demo

The MVP demonstrates:
1. Citizen submits a problem.
2. AI analyzes and recommends A/B/C.
3. Department officer handles Path B.
4. Innovation Cell validates Path C.
5. AI matches suitable universities.
6. University creates a project team and proposal.
7. Industry/CSR can support the project.
8. Admin dashboard shows analytics and impact.

Roadmap
Future development includes:

* Hindi and regional-language voice reporting
* OCR and document understanding
* Multimodal image analysis
* Verified scheme and department databases
* Permitted department API integrations
* District-level pilots
* Deeper startup, incubator, CSR, and industry collaboration
* Milestone-based funding and stipend workflows
* Responsible AI
* AI recommendations are not final official decisions.
* Human authorities retain decision-making responsibility.
* Important workflow actions are recorded in audit history.
* Sensitive personal information should be minimized and protected.


Disclaimer
JharSetu is an experimental prototype for demonstration and innovation purposes.
It is not an official government website, government service, or authorized government communication channel.
Demo districts, departments, users, reports, statistics, and project data may be simulated.
