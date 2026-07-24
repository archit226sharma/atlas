# Security Policy

## Reporting Vulnerabilities

CodeAtlas takes the security of developer tools and source code parsing extremely seriously. If you discover a security vulnerability in the CodeAtlas extension or website, please report it privately.

**Please do not report security vulnerabilities through public GitHub issues.**

### Reporting Method
Email vulnerability reports to: **security@codeatlas.dev** or open a private advisory on GitHub via:
https://github.com/varunkulkarninagpur/codeAtlas/security/advisories/new

### Information to Include
- Detailed description of the issue.
- Steps to reproduce or proof-of-concept repository.
- Impact assessment.

## Supported Versions

| Version | Supported |
| :--- | :--- |
| 1.0.x | :white_check_mark: |
| < 1.0.0 | :x: |

## Security Guarantees
- **100% Local Analysis**: CodeAtlas AST parsing operates entirely offline inside your local VS Code environment.
- **Zero Telemetry**: No source code tokens, file paths, or user metadata leave your machine.
