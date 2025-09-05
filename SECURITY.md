# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Aqua Aero Flow. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue
2. Send details to security@aquaaeroflow.com (or contact the maintainer directly)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Security Measures

This application implements several security measures:

- **Content Security Policy (CSP)**: Strict CSP headers prevent XSS attacks
- **No External Dependencies**: Pure JavaScript, no third-party runtime dependencies
- **No Data Collection**: All processing happens locally in your browser
- **Input Sanitization**: URL parameters are validated and sanitized
- **Secure Context**: Service Worker requires HTTPS in production
- **Permission Gating**: Microphone access is clearly requested and optional

## Best Practices

When deploying Aqua Aero Flow:

1. Always serve over HTTPS
2. Keep dependencies updated
3. Review CSP headers for your deployment
4. Monitor browser console for security warnings
5. Regularly update the service worker cache version

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who follow this policy.