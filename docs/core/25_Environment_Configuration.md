 Environment Configuration

 Overview

The GCE platform uses environment variables to securely manage application configuration, API keys, authentication secrets, database connections, thirdparty integrations, and deployment settings.

All sensitive values must be stored in environment files or deployment secrets and \*\*must never be committed to GitHub\*\*.

 Environment Files

The project uses the following environment files:

\`\`\`  
.env.local  
.env.development  
.env.staging  
.env.production  
\`\`\`

 Environment Types

 Development

Purpose

 Local Development  
 Feature Testing  
 Debugging

Example

\`\`\`  
NODE\_ENV=development  
\`\`\`

 Staging

Purpose

 QA Testing  
 Client Review  
 Preproduction Validation

Example

\`\`\`  
NODE\_ENV=staging  
\`\`\`

 Production

Purpose

 Live Platform  
 Public Users

Example

\`\`\`  
NODE\_ENV=production  
\`\`\`

 Application Configuration

\`\`\`  
NODE\_ENV=

NEXT\_PUBLIC\_APP\_NAME=GCE Events

NEXT\_PUBLIC\_APP\_URL=https://gce.events

NEXT\_PUBLIC\_API\_URL=https://api.gce.events  
\`\`\`

 Supabase Configuration

\`\`\`  
NEXT\_PUBLIC\_SUPABASE\_URL=

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY=  
\`\`\`

The Service Role Key must never be exposed to the frontend.

 Authentication

\`\`\`  
JWT\_SECRET=

JWT\_EXPIRES\_IN=7d

REFRESH\_TOKEN\_EXPIRES\_IN=30d  
\`\`\`

 Database

\`\`\`  
DATABASE\_URL=

DATABASE\_POOL\_SIZE=20  
\`\`\`

Database credentials must remain serverside only.

 Payment Gateway

\`\`\`  
RAZORPAY\_KEY\_ID=

RAZORPAY\_KEY\_SECRET=

PAYMENT\_WEBHOOK\_SECRET=  
\`\`\`

Future gateways may include:

 Stripe  
 PayPal

 Email Service

\`\`\`  
EMAIL\_PROVIDER=

EMAIL\_API\_KEY=

EMAIL\_FROM=  
\`\`\`

Used for:

 Email Verification  
 Password Reset  
 Membership Notifications  
 Booking Confirmation

 SMS Service

\`\`\`  
SMS\_PROVIDER=

SMS\_API\_KEY=

SMS\_SENDER\_ID=  
\`\`\`

Used for:

 OTP  
 Booking Alerts  
 Payment Notifications

 WhatsApp (Future)

\`\`\`  
WHATSAPP\_API\_KEY=

WHATSAPP\_PHONE\_NUMBER\_ID=  
\`\`\`

 Push Notifications

\`\`\`  
PUSH\_PUBLIC\_KEY=

PUSH\_PRIVATE\_KEY=  
\`\`\`

Used for PWA Push Notifications.

 File Storage

\`\`\`  
STORAGE\_PROVIDER=Supabase

STORAGE\_BUCKET=  
\`\`\`

Stores:

 Profile Images  
 Business Logos  
 Event Images  
 Documents  
 QR Tickets  
 ID Verification Files

 AI Configuration

\`\`\`  
AI\_PROVIDER=

AI\_API\_KEY=

AI\_MODEL=  
\`\`\`

Future support:

 OpenAI  
 Gemini  
 Claude

 Google Maps

\`\`\`  
GOOGLE\_MAPS\_API\_KEY=  
\`\`\`

Used for:

 Venue Locations  
 Event Locations  
 Map Search

 Analytics

\`\`\`  
GOOGLE\_ANALYTICS\_ID=

POSTHOG\_KEY= (Future)  
\`\`\`

 Security

\`\`\`  
ENCRYPTION\_KEY=

GCE\_CREDENTIAL\_ENCRYPTION\_KEY=

SESSION\_SECRET=

COOKIE\_SECRET=  
\`\`\`

These values should be rotated periodically.

 Feature Flags

\`\`\`  
ENABLE\_PWA=true

ENABLE\_PUSH=true

ENABLE\_MARKETPLACE=true

ENABLE\_ENTERPRISE=true

ENABLE\_AI=true  
\`\`\`

Feature flags allow modules to be enabled or disabled without changing code.

 Server Configuration

\`\`\`  
PORT=3000

HOST=0.0.0.0  
\`\`\`

 Logging

\`\`\`  
LOG\_LEVEL=info  
\`\`\`

Supported values:

 debug  
 info  
 warning  
 error

 Backup Configuration

\`\`\`  
BACKUP\_ENABLED=true

BACKUP\_SCHEDULE=daily  
\`\`\`

 Deployment Secrets

Production secrets should be stored in:

 GitHub Secrets  
 VPS Environment Variables  
 Deployment Pipeline Secrets

Never inside source code.

 Example .env.local

\`\`\`env  
NODE\_ENV=development

NEXT\_PUBLIC\_APP\_NAME=GCE Events  
NEXT\_PUBLIC\_APP\_URL=http://localhost:3000

NEXT\_PUBLIC\_SUPABASE\_URL=  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY=

DATABASE\_URL=

JWT\_SECRET=

RAZORPAY\_KEY\_ID=  
RAZORPAY\_KEY\_SECRET=

EMAIL\_API\_KEY=

GOOGLE\_MAPS\_API\_KEY=

ENABLE\_PWA=true  
ENABLE\_AI=true  
ENABLE\_ENTERPRISE=true  
\`\`\`

 Security Best Practices

 Never commit \`.env\` files to GitHub.  
 Use different keys for Development, Staging, and Production.  
 Rotate API keys regularly.  
 Store secrets only on the server.  
 Never expose Service Role Keys to the frontend.  
 Restrict API keys wherever possible.

 LongTerm Vision

The Environment Configuration system provides a secure and scalable way to manage all application settings across development, staging, and production environments. By separating configuration from source code, GCE ensures secure deployments, easier maintenance, and flexibility for future integrations and infrastructure growth.  
