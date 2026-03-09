Below is the **system design** reflecting my requirements:

---

# SW Law LLP Website

## Next.js Full-Stack Project Design

---

# 1. System Overview

## System Name

**SW Law LLP Legal Consultancy Website**

## System Purpose

The platform will serve as the official digital presence for **SW Law LLP**, providing:

* Corporate information about the firm
* Detailed legal service offerings
* Partner profiles and expertise
* Client inquiry submission
* Legal insights/blog publishing
* Administrative content management

The system will be built as a **full-stack web application** using Next.js server capabilities.

---

# 2. Technology Stack

## Frontend

* **Next.js**
* **React**
* **Tailwind CSS**

## Backend

* Next.js API routes
* Server Actions

## Database

* **SQLite**

SQLite is suitable because:

* small data volume
* simple deployment
* no database server required
* ideal for corporate websites

## ORM

* **Prisma**

Prisma integrates seamlessly with SQLite.

Example datasource:

```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

---

# 3. Deployment Infrastructure

The application will be deployed on **Railway**.

## Deployment Pipeline

```
GitHub Repository
       │
       ▼
Railway Build Pipeline
       │
       ▼
Next.js Production Server
       │
       ▼
SQLite Database
```

Railway advantages:

* automatic deployments
* built-in environment variables
* persistent volumes
* simple scaling

---

# 4. System Architecture

Architecture overview:

```
Client Browser
       │
       ▼
Next.js Frontend (React)
       │
       ▼
Next.js Server (API Routes / Server Actions)
       │
       ▼
Prisma ORM
       │
       ▼
SQLite Database
```

The entire system runs within **a single application deployment**.

---

# 5. Website Structure

## Public Website Pages

### Home

Sections:

* firm introduction
* sustainability focus
* maritime expertise
* service highlights
* partner spotlight
* call-to-action

---

### About Us

Includes:

* firm philosophy
* integrity and sustainability focus
* expertise in maritime legal consultancy
* Blue Economy commitment

---

### Services

Service categories derived from your document.

#### Maritime & Shipping Law

Services include:

* marine environmental law
* shipping logistics advisory
* vessel registration
* vessel sale and purchase
* chartering contracts
* maritime regulatory compliance

---

#### ESG Compliance

Services include:

* ESG strategy development
* stakeholder engagement frameworks
* compliance evaluation
* training and capacity building

---

#### Corporate & Commercial Law

Services include:

* corporate advisory
* mergers and acquisitions
* commercial transaction structuring
* regulatory compliance audits

---

#### Conveyancing & Property Law

Services include:

* title conversion
* sectional title processing
* lease extension
* property transfers
* security perfection

---

#### Other Practice Areas

* family law
* probate
* employment law
* ADR
* equity and trust law

---

### Partners Page

Profiles for:

* **Faith Sulwe – Managing Partner**
* **Lillian Waweru – Partner**

Each profile includes:

* biography
* legal expertise
* education
* professional experience

---

### Contact Page

Features:

* inquiry form
* service selection
* message submission
* contact information

---

# 6. Core Functional Modules

## Client Inquiry System

Allows potential clients to submit requests.

Fields:

```
Name
Email
Phone
Service Category
Message
```

Submissions stored in database.

Admin can view them in dashboard.

---

## Blog / Insights System

Used for publishing:

* maritime law insights
* ESG advisory updates
* regulatory developments
* legal commentary

Benefits:

* improves SEO
* establishes thought leadership

---

## Admin Dashboard

Secure login required.

Admin capabilities:

* manage blog posts
* view client inquiries
* update services content
* manage partner profiles

---

# 7. Database Design

## AdminUsers

```
id
name
email
password
role
createdAt
```

---

## Inquiries

```
id
name
email
phone
serviceType
message
status
createdAt
```

---

## BlogPosts

```
id
title
slug
content
author
published
createdAt
```

---

## Services

```
id
title
description
category
```

---

# 8. UI / UX Design

The design will reflect a **professional legal brand identity**.

### Color Palette

```
Primary Color   : Navy Blue
Accent Color    : Gold
Background      : White
Secondary Color : Light Gray
```

The **gold accent** will be used for:

* headings
* highlights
* CTA buttons

---

# 9. Next.js Project Structure

Recommended structure:

```
/app
   /about
   /services
   /partners
   /blog
   /contact

/app/api
   /inquiries
   /blog
   /auth

/components
   Navbar
   Footer
   ServiceCard
   PartnerCard
   ContactForm

/lib
   prisma.ts
   auth.ts

/prisma
   schema.prisma
```

---

# 10. Security Measures

Security considerations include:

* input validation
* rate limiting for contact forms
* hashed passwords
* admin authentication
* CSRF protection

---

# 11. Performance Optimization

Using built-in Next.js features:

* server components
* static generation for public pages
* optimized image loading
* caching where possible

---

# 12. SEO Strategy

The system will support SEO through:

* server-side rendering
* semantic HTML structure
* metadata management
* sitemap generation

Key target keywords:

* maritime law Kenya
* shipping legal consultancy
* ESG compliance consulting
* maritime legal advisory Kenya

---

# 13. Future Expansion

Potential future features:

* client login portal
* document submission system
* consultation booking
* legal document automation
* knowledge base

---

✅ **Final Outcome**

The website will deliver:

* professional law-firm branding
* scalable full-stack architecture
* secure inquiry management
* SEO-optimized legal content platform

Running on:

* **Next.js**
* **SQLite**
* **Prisma**
* **Railway deployment**

