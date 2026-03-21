<div align="center"><h1>Automated Website Testing by Testplan</h1> <p>(playwright, allure, type script)</p></div>

[![Playwright](https://img.shields.io/badge/Playwright-1.58.2-green)](https://www.playwright.dev/)
[![Allure Report 3](https://img.shields.io/badge/Allure_Report-3.x-orange)](https://allurereport.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions)](https://github.com/features/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## 📋 Overview

A robust black-box automated testing framework for web applications, built with modern tools and practices. This project demonstrates a complete CI/CD testing pipeline with advanced reporting capabilities and cloud integration.

**Live demo:** [View Test Reports with testplan generator](https://alexromlex.github.io/ex-playwright-allure-testplan/)

## 🚀 Features

- **Smart Test Planning** - Creating your own [testplan](https://alexromlex.github.io/ex-playwright-allure-testplan/) based on test searching query. Simple and advanced test search using metadata from test results. Run you testplan via GitHubActions (blue button in the bottom‑right corner)
- **Black-box Testing Approach** - Tests web applications from an end-user perspective + API
- **Modern Tech Stack** - Playwrith, Type Script and Allure Report 3
- **Automated CI/CD** - GitHub Actions integration with secure token authentication
- **Comprehensive Reporting** - Allure reports with history tracking and environment filtering
- **Cloud Integration** - Cloudflare worker for remote test execution triggers
- **Historical Analysis** - Test history preservation and trend visualization
- **GitHub Pages Deployment** - Automatic report publishing

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Core Framework** | Node + Type Script |
| **Browser Automation** | Playwright |
| **Reporting** | Allure Report 3 |
| **CI/CD** | GitHub Actions |
| **Test Environment** | Linux (Ubuntu 24.04) |
| **Browser** | Chromium, Firefox, Webkit |
| **Cloud Functions** | Cloudflare Workers |
| **Hosting** | GitHub Pages |

## 🔄 Workflow

1. **Testplan Generator** searches through test metadata
2. **Cloudflare Worker** receives requests and triggers GitHub Actions
3. **GitHub Actions** executes tests with secure GITHUB_TOKEN authentication
4. **Test Execution** runs tests in Docker container, GitHub secrets ENV included
5. **Metadata Generation** creates comprehensive test metadata
6. **History Tracking** preserves previous test results
7. **Allure Report** generates with custom Testplan Generator integration
8. **Pages Deployment** automatically updates the [public report page](https://alexromlex.github.io/ex-playwright-allure-testplan/)

## 📈 Test Reports

View detailed test results at:  
🔗 [https://alexromlex.github.io/ex-playwright-allure-testplan/](https://alexromlex.github.io/ex-playwright-allure-testplan/)

**Report features:**
- Test execution results with detailed logs
- Historical trends and comparisons
- Environment-based filtering
- Custom testplan visualization
- Failure analysis and screenshots

## 🔐 Security
- All GitHub Actions runs require GITHUB_TOKEN authentication
- Secure environment variables for sensitive data
- Cloudflare worker with request validation

# 📝 Notes
## ⚠️ Educational Purpose
This project is created exclusively for educational purposes to demonstrate:
- Automated testing frameworks
- CI/CD integration
- Cloud-based test execution
- Dynamic test planning
- Reporting and visualization

# ⭐ Support
If you find this project useful or interesting, please consider giving it a ⭐

It helps others discover this educational resource.

# 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ for the testing community
