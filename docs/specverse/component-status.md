---
title: Component Status
description: "Maturity overview of every SpecVerse ecosystem component — from production-ready to not yet built."
sidebar_label: Component Status
---

<!-- Source: ~/tmp/SPECVERSE-INTRODUCTION-V4.md (Appendix B) -->

# Component Status

## Maturity Overview

```mermaid
flowchart LR
    subgraph "Production-Ready"
        direction TB
        P["Parser
        Fast, 1,901 tests"]
        IE["Inference Engine
        21 rules, deterministic"]
        CLI["CLI Core
        validate, infer, gen"]
        VSC["VSCode Extension
        Syntax, IntelliSense"]
        DG["Diagrams
        15 types, 100%"]
        DOC["Documentation
        136+ pages"]
    end

    subgraph "Functional / Emerging"
        direction TB
        REAL["Realize System
        Prisma, Fastify, React"]
        REG["Registry
        Deployed, real content"]
        DEMO["Runtime Interpreter
        203/205 tests"]
        MCP["MCP Server
        13 tools"]
        SESS["Sessions
        98% token savings"]
    end

    subgraph "In Progress"
        direction TB
        P2["AI Create
        Working, validated"]
        P3["AI Analyse
        Prompts need updates"]
        P4["AI Materialise
        Not started"]
        VFL["Validate-Fix Loop
        Proven for create only"]
    end

    subgraph "Not Yet Built"
        direction TB
        E2E["End-to-end pipeline
        Spec → running app"]
        REV["Reverse engineering
        Code → spec extraction"]
        TEAM["Team collaboration
        Shared sessions"]
        MKT["Template marketplace
        Community factories"]
    end
```

## Detailed Status

| Component | Maturity | Evidence |
|-----------|----------|---------|
| Parser + Schema | Production | Fast parsing, 1,901 tests, convention processing |
| Inference Engine | Production | 21 rules, 4x–7.6x expansion, deterministic |
| CLI (core commands) | Production | validate, infer, gen, init, migrate |
| VSCode Extension | Production | Syntax, IntelliSense, validation, diagram preview |
| Diagram Generator | Production | 15 Mermaid types, 100% complete |
| Documentation Site | Production | 136+ pages, auto-sync, Docusaurus v3 |
| TypeScript API | Production | Programmatic access, verified examples |
| MCP Server | Functional | 7 core + 6 orchestrator tools, multi-environment |
| Realize System | Functional | Instance factories for Prisma, Fastify, React |
| Registry Platform | Functional | Deployed on Vercel, real libraries, 49 API tests |
| Runtime Interpreter | Functional | 7-tab UI, multi-server, 203/205 tests |
| Session Management | Functional | Claude Code integration, 98% token savings |
| AI Create (Pillar 2) | Validated | 4x–7.6x measured, validate-fix loop working |
| AI Analyse (Pillar 3) | Early | Prompts exist, need updating |
| AI Materialise/Realize (Pillar 4) | Not started | Framework and infrastructure ready |
| End-to-end pipeline | Not built | No spec → running app single command |
| Code → spec extraction | Not built | Cannot yet reverse-engineer existing systems |

---

**See also:** [The Ecosystem](./ecosystem.md) for detailed descriptions of each component, or [Language Coverage](./language-coverage.md) for what the specification language covers.
