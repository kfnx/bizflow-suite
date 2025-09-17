<p align="center">
  <a href="https://alignui.com">
    <img src="./logo.svg" height="96">
    <h3 align="center">AlignUI Design System</h3>
  </a>
  <p align="center">The Design System You Need</p>
</p>

[Join the AlignUI Community](https://discord.gg/alignui)

## Introduction

MySTI - PT San Traktor Indoneisa

Using Next.js, Drizzle ORM, AlignUI

## Getting Started

Install pnpm https://pnpm.io/installation#prerequisites

Install dependencies

```bash
pnpm install
```

Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Make sure you have docker then run the database and s3 storage

```bash
docker-compose up mysql minio -d
```

Apply migration to database

```bash
pnpm db:migrate
```

Generate database seeds for testing, including users and permission

```bash
pnpm db:seed
```
