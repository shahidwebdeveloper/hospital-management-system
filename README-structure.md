# Project Structure Guide

This project uses a simple, scalable structure for easier development.

## Client

- src/app: app shell and global providers
- src/features: feature-based modules (auth, patients, dashboard)
- src/pages: route-level page components
- src/components: shared UI components
- src/services: API integration logic
- src/context: global React contexts
- src/lib: helpers and utilities
- src/types: shared frontend types

## Server

- src/app.ts: Express app setup
- src/server.ts: server entry point
- src/modules: feature modules (auth, patients, resources)
- src/middlewares: reusable middleware
- src/utils: helper functions
- src/config: config and environment setup
- src/models: MongoDB models

## Shared

- contracts/src: shared schemas, types, and module definitions
