![build-desktop-tool](https://github.com/chilli-axe/mpc-autofill/actions/workflows/build-desktop-tool.yml/badge.svg)
![build-frontend](https://github.com/chilli-axe/mpc-autofill/actions/workflows/build-frontend.yml/badge.svg)
![tests](https://github.com/chilli-axe/mpc-autofill/actions/workflows/tests.yml/badge.svg)
[![Github all releases](https://img.shields.io/github/downloads/chilli-axe/mpc-autofill/total.svg)](https://GitHub.com/chilli-axe/mpc-autofill/releases/)

<a href="https://www.buymeacoffee.com/chilli.axe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# mpc-autofill

Automating MakePlayingCards' online ordering system.

<img align="right" width="64px" src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg" alt="JetBrains Logo (Main) logo.">

If you're here to download the desktop client, check the [Releases]("https://github.com/chilli-axe/mpc-autofill/releases") tab.

JetBrains supports this project's development through their [Open Source Development licensing](https://jb.gg/OpenSourceSupport).

# Contributing

- Please ensure that you install the `pre-commit` Python package and run `pre-commit install` before committing any code to your branch / PR - this will run various linting, code styling, and static type checking tools to validate your code.
- GitHub Actions is configured in this repository to run the Django project's end-to-end tests. To run these, it needs to access the Google Drive API, and does so through a repository secret named `GOOGLE_DRIVE_API_KEY`. If you fork this project, you'll need to set this repository secret for GitHub Actions to run these tests for you.
  - **Note**: If you create a pull request to this repository from your fork and you don't follow this step, your CI build will fail! Don't worry about it unless you're modifying backend code with test coverage.

# Monorepo Structure

Each component of the project has its own README; check those out for more details.

## Backend

- **Note**: The frontend in this section of the codebase is considered deprecated and no new features will be added to it.
- Located in `/MPCAutofill`.
  - See `/frontend` for the successor to this part of the project.
- Images stored in the Google Drives connected to the project are indexed in Elasticsearch.
- The backend server is decoupled from `/frontend` and the frontend allows users to configure which backend to retrieve data from.
- Stack:
  - Backend:
    - Django 4, the database of your choosing (sqlite is fine), Elasticsearch 7.x, and Google Drive API integration.
  - Frontend (deprecated):
    - jQuery + jQuery UI, Bootstrap 5, Webpack + Babel for compilation and bundling.
- Facilitates the generation of XML orders for use with the desktop client.
- Intended to be deployed natively in a Linux VM but can also be spun up locally with Docker.

## Frontend

- **Note**: At time of writing, this component of the project is not yet stable. Please continue to use the legacy frontend in `/MPCAutofill` for a stable frontend experience.
- Located in `/frontend`.
- A web app that communicates with a specified MPC Autofill backend (hosted somewhere on the Internet) and facilitates the creation, customisation, and exporting of projects with drives linked to that backend.
- Stack:
  - Static Next.js web app built with Typescript, React-Bootstrap, and Redux.
  - Automatically deployed on GitHub Pages to https://mpcautofill.github.io whenever changes are made to the `frontend-release` branch.

## Desktop Client

- Located in `/desktop-tool`.
- Responsible for parsing XML orders, downloading images from Google Drive, and automating MPC's order creation interface.
- Stack:
  - A Click CLI which is compiled and distributed (in GitHub Releases) as an executable with Pyinstaller.

# GitHub Configuration

This repository is configured with a few secrets and environment variables which are required for some GitHub Action workflows as documented below.

## Secrets

| Secret Name                     | Description                                                                                                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_DRIVE_API_KEY`          | Your Google Drive API key.<br />Used by GitHub Actions when running backend tests.                                                                                                                 |
| `API_TOKEN_GITHUB`              | A GitHub API token configured with `repo` permissions.<br />Used by [`copy_file_to_another_repo_action`](https://github.com/dmnemec/copy_file_to_another_repo_action) when deploying the frontend. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Your _Google Analytics measurement id_.<br/>Used by the [`nextjs-google-analytics`](https://github.com/MauricioRobayo/nextjs-google-analytics) package when deploying the frontend.                |
