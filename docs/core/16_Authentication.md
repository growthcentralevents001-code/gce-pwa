 Authentication

 Overview 

The GCE platform uses a secure RoleBased Authentication (RBA) system built on Supabase Authentication with JWT tokens.

Authentication ensures that every user can securely access only the modules, dashboards, and APIs assigned to their role.

The authentication system is designed to support millions of users while maintaining high security, scalability, and performance.

 Authentication Objectives

The authentication system is designed to:

 Secure User Login  
 Protect User Data  
 Control RoleBased Access  
 Prevent Unauthorized Access  
 Secure API Requests  
 Support MultiDevice Login  
 Maintain Audit Logs

 Authentication Flow

User Registration

↓

Email / Mobile Verification

↓

Account Creation

↓

Login

↓

JWT Token Generation

↓

Role Verification

↓

Dashboard Assignment

↓

API Authorization

↓

Session Monitoring

↓

Logout

 Supported Authentication Methods

The platform supports:

 Email & Password Login  
 Mobile Number & OTP Login  
 Google Login (Future)  
 Apple Login (Future)  
 Microsoft Login (Future)

 User Registration

Users can register using:

 Full Name  
 Mobile Number  
 Email Address  
 Password

Optional:

 Business Name  
 Business Category  
 Referral Code

 Account Verification

Before activating an account, users must verify:

 Email Address  
 Mobile Number

For businessrelated activities, identity verification may also be required.

 Login

Users can log in using:

 Email \+ Password  
 Mobile \+ OTP

Successful login returns:

 JWT Access Token  
 Refresh Token  
 User Profile  
 User Role  
 Dashboard Access

 Password Policy

Passwords must:

 Minimum 8 Characters  
 One Uppercase Letter  
 One Lowercase Letter  
 One Number  
 One Special Character

Weak passwords are not allowed.

 Forgot Password

Users can reset passwords through:

 Email Verification  
 OTP Verification

Flow:

Forgot Password

↓

Verification

↓

Create New Password

↓

Login

 JWT Authentication

The platform uses JSON Web Tokens (JWT).

JWT is required for:

 Dashboard Access  
 API Access  
 Protected Routes  
 Business Operations

Every secure API validates the JWT before processing requests.

 Refresh Tokens

After login:

 Access Token  
 Refresh Token

The Refresh Token allows users to continue their session securely without logging in repeatedly.

 Session Management

Each login creates a secure session.

Session Information includes:

 Device  
 Browser  
 Login Time  
 IP Address  
 Last Activity

Users can view and manage active sessions.

 Logout

Users can:

 Logout Current Device  
 Logout All Devices

Logout immediately invalidates active authentication tokens.

 MultiDevice Support

Users can access the platform from:

 Mobile  
 Tablet  
 Desktop  
 PWA

The platform securely manages multiple active sessions.

 User Roles

Supported Roles:

 Platform Admin  
 Board of Governance  
 Relationship Manager (RM)  
 Platform Relationship Manager (PRM)  
 Connect Business Development Partner (CBDP)  
 Marketplace Business Development Partner (MBDP)  
 Enterprise Business Development Partner  
 Venue Partner  
 Circle Member  
 User

Each role receives a dedicated dashboard and API permissions.

 RoleBased Access Control (RBAC)

Every authenticated request checks:

 User Role  
 Dashboard Permission  
 API Permission  
 Module Permission

Unauthorized requests are rejected automatically.

 Protected Routes

Protected examples:

 Dashboard  
 Membership  
 Events Management  
 Marketplace  
 Enterprise  
 AI Lead Assist  
 Payments  
 Reports

Unauthenticated users are redirected to Login.

 API Authentication

Every protected API requires:

Authorization

\`\`\`  
Bearer \<JWT Token\>  
\`\`\`

Invalid or expired tokens return:

 401 Unauthorized  
 403 Forbidden

 Identity Verification

Certain modules require identity verification.

Examples:

 AI Lead Assist  
 Venue Partner Registration  
 Enterprise Projects  
 Franchise Registration

Supported Documents:

 Aadhaar  
 Passport  
 Driving Licence  
 PAN (where applicable)

 Authentication Logs

The system records:

 Registration  
 Login  
 Logout  
 Failed Login  
 Password Reset  
 OTP Verification  
 Session Expiry  
 Device Changes

 Account Status

Possible account states:

 Active  
 Pending Verification  
 Suspended  
 Blocked  
 Deleted

Inactive accounts cannot access protected resources.

 Login Security

Security features include:

 Secure Password Hashing  
 JWT Authentication  
 Refresh Tokens  
 OTP Verification  
 Email Verification  
 Session Timeout  
 Device Tracking  
 Failed Login Detection

 Future Authentication Features

Planned enhancements:

 TwoFactor Authentication (2FA)  
 Biometric Login  
 Face ID  
 Fingerprint Login  
 Passkeys  
 SSO (Single SignOn)  
 Enterprise Login  
 Social Authentication

 LongTerm Vision

The GCE Authentication System is designed to provide a secure, scalable, and role-based identity management solution for the entire GCE ecosystem.

It ensures that every stakeholder—from Users and Members to Venue Partners, Business Development Partners, Enterprise teams, and Platform Administrators—can securely access only the resources and functionality relevant to their responsibilities while maintaining the highest standards of security and user experience.  
