---
title: "Start Here: Extend Your AI"
description: "As a developer, I want to build new capabilities for Personal AI Infrastructure so I can automate custom workflows with skills, hooks, and agents."
---

Welcome to the Developer section. This is where you learn to extend Personal AI Infrastructure (PAI) with your own skills, hooks, and agents — adding new capabilities without forking the core system.

## What you'll find here

### Understand the model

- **[The Extension Model](/developer/extension-model/)** — How PAI's three extension points (skills, hooks, agents) compose into custom capabilities
- **[Skill Lifecycle](/developer/skill-lifecycle/)** — How skills are discovered, activated, composed, and retired
- **[Agent Architecture](/developer/agent-architecture/)** — How agents spawn, share context, use ISC criteria, and coordinate

### Build your first extensions

- **[Your First Skill](/developer/first-skill/)** — Create a skill from scratch and see it activate
- **[Your First Hook](/developer/first-hook/)** — Write a hook that reacts to PAI events
- **[Your First CLI Tool](/developer/first-cli-tool/)** — Build a TypeScript CLI tool that a skill can invoke

### Solve specific problems

- **[Write Hooks](/developer/write-hooks/)** — Patterns, payloads, and best practices for hook development
- **[Manage Memory](/developer/manage-memory/)** — Read, write, and structure persistent data in PAI's memory system
- **[Set Up Agents](/developer/set-up-agents/)** — Configure delegation, spawn agents, and orchestrate multi-agent workflows
- **[Test PAI Components](/developer/testing/)** — Write and run tests for skills, hooks, and CLI tools
- **[Debug and Troubleshoot](/developer/debugging/)** — Diagnose agent failures, skill loading issues, and context routing misses

### Look things up

- **[Algorithm Reference](/developer/algorithm/)** — The complete Algorithm specification developers need to understand
- **[Hook Types](/developer/hook-types/)** — Every hook event, its payload, and when it fires
- **[Agent Types](/developer/agent-types/)** — Built-in agent types, their capabilities, and when to use each
- **[Tools Reference](/developer/tools-reference/)** — Core tools, browser automation, and notification APIs
- **[Skill File Format](/developer/skill-file-format/)** — The SKILL.md file format: frontmatter schema, trigger syntax, and structure
- **[Workflow File Format](/developer/workflow-file-format/)** — Workflow file structure, step definitions, routing tables, and conditions
- **[Memory File Format](/developer/memory-file-format/)** — JSONL event schemas, directory layout, and field definitions

## Recommended path

Start with **[The Extension Model](/developer/extension-model/)** to understand how skills, hooks, and agents fit together. Then follow **[Your First Skill](/developer/first-skill/)** or **[Your First Hook](/developer/first-hook/)** depending on what you want to build.
