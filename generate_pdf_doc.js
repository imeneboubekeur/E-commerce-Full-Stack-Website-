const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Furniture E-Commerce - Complete System Documentation</title>
<style>
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
  }
  
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 10pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    padding: 40px 25px;
    border: 2px solid #cbd5e1;
    border-radius: 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  }

  .cover-header {
    border-left: 6px solid #2563eb;
    padding-left: 20px;
  }

  .cover-title {
    font-size: 32pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 15pt;
    color: #475569;
    font-weight: 400;
    margin: 0;
  }

  .cover-badge-group {
    margin-top: 20px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    background-color: #2563eb;
    color: #ffffff;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 8.5pt;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .badge-dark { background-color: #0f172a; }
  .badge-accent { background-color: #0d9488; }
  .badge-purple { background-color: #9333ea; }

  .cover-body {
    background: #ffffff;
    padding: 22px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .cover-footer {
    display: flex;
    justify-content: space-between;
    font-size: 9pt;
    color: #64748b;
    border-top: 1px solid #cbd5e1;
    padding-top: 15px;
  }

  /* Section Styling */
  .page-break {
    page-break-before: always;
  }

  h1 {
    font-size: 18pt;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 25px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 13pt;
    color: #1e293b;
    margin-top: 18px;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 11pt;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
  }

  p, li {
    font-size: 9.5pt;
    color: #334155;
  }

  ul, ol {
    margin-top: 4px;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  /* Diagrams Container */
  .diagram-container {
    width: 100%;
    margin: 15px 0;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-align: center;
  }

  .diagram-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #475569;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  svg {
    max-width: 100%;
    height: auto;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 9pt;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 7px 9px;
    text-align: left;
  }

  th {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
    font-size: 8.5pt;
  }

  tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .pk { color: #d97706; font-weight: 700; }
  .fk { color: #2563eb; font-weight: 700; }
  .type { font-family: 'Consolas', 'Courier New', monospace; font-size: 8pt; color: #0d9488; }
  .code-inline { font-family: 'Consolas', 'Courier New', monospace; background: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-size: 8.5pt; color: #0f172a; }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .info-box {
    background-color: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    margin: 10px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
  }

  .security-box {
    background-color: #fefce8;
    border-left: 4px solid #ca8a04;
    padding: 10px 14px;
    margin: 10px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px;
    border-radius: 6px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    overflow-x: auto;
  }
</style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-title">Furniture E-Commerce</div>
      <div class="cover-subtitle">Complete Architecture, Data Schemas, APIs & Operational Specifications</div>
      <div class="cover-badge-group">
        <span class="badge">React 19 & SSR</span>
        <span class="badge badge-dark">Node.js / Express 5</span>
        <span class="badge badge-accent">PostgreSQL DB</span>
        <span class="badge badge-purple">Stripe Checkout</span>
        <span class="badge">Cloudinary Media</span>
        <span class="badge badge-dark">Redux Toolkit</span>
      </div>
    </div>

    <div class="cover-body">
      <h3>System Overview & Documentation Purpose</h3>
      <p>This document serves as the comprehensive technical reference manual for the Furniture E-Commerce application. It covers full end-to-end architecture, multi-role use cases, detailed PostgreSQL schemas across all 9 relational entities, interactive flowcharts, full REST API specifications, security mechanisms, directory organization, and deployment workflows.</p>
      
      <h3>Core Technology Specifications</h3>
      <ul>
        <li><strong>Frontend Stack:</strong> React 19, React Router 7, Redux Toolkit, Lucide Icons, Webpack Bundler</li>
        <li><strong>Server-Side Rendering (SSR):** Custom Webpack SSR pipeline with HTML string stream injection</li>
        <li><strong>Backend Engine:</strong> Node.js with Express 5, JWT Authentication & Bcrypt Hashing</li>
        <li><strong>Database Layer:</strong> PostgreSQL pool connections with JSONB dynamic attributes</li>
        <li><strong>External Services:</strong> Stripe API Payment Gateway & Webhook Signature Verification, Cloudinary Asset Hosting</li>
      </ul>
    </div>

    <div class="cover-footer">
      <span>Date Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      <span>Version 1.0.0 | Full System Blueprint</span>
    </div>
  </div>

  <!-- SECTION 1: SYSTEM ARCHITECTURE -->
  <div>
    <h1>1. System Architecture & Overview</h1>
    <p>The system is built as a high-performance e-commerce platform combining initial Server-Side Rendering (SSR) for fast first-page load and search engine indexing with dynamic React single-page application (SPA) interactivity for seamless browsing, cart operations, and administrative dashboards.</p>

    <div class="diagram-container">
      <div class="diagram-title">Figure 1.1: End-to-End System Architecture Overview</div>
      <svg viewBox="0 0 800 370" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/>
          </marker>
        </defs>

        <!-- Client Layer -->
        <rect x="20" y="30" width="180" height="310" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
        <text x="110" y="55" font-weight="bold" fill="#1e3a8a" text-anchor="middle" font-size="14">Client Browser</text>
        <rect x="35" y="80" width="150" height="48" rx="5" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
        <text x="110" y="100" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">React 19 Frontend</text>
        <text x="110" y="116" font-size="9" fill="#475569" text-anchor="middle">(Redux Toolkit, Hooks)</text>

        <rect x="35" y="145" width="150" height="48" rx="5" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
        <text x="110" y="165" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">UI Components</text>
        <text x="110" y="181" font-size="9" fill="#475569" text-anchor="middle">(Cart, Wishlist, Admin)</text>

        <rect x="35" y="210" width="150" height="48" rx="5" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
        <text x="110" y="230" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">Stripe SDK / Element</text>
        <text x="110" y="246" font-size="9" fill="#475569" text-anchor="middle">(Secure Card Processing)</text>

        <rect x="35" y="275" width="150" height="45" rx="5" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
        <text x="110" y="302" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">Local Storage & JWT</text>

        <!-- Server Layer -->
        <rect x="260" y="30" width="260" height="310" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
        <text x="390" y="55" font-weight="bold" fill="#0f172a" text-anchor="middle" font-size="14">Express Node.js Server</text>

        <rect x="280" y="75" width="220" height="45" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="390" y="95" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">SSR Engine</text>
        <text x="390" y="110" font-size="9" fill="#64748b" text-anchor="middle">Webpack Server Bundle</text>

        <rect x="280" y="135" width="220" height="45" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="390" y="155" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">REST Controllers & Routes</text>
        <text x="390" y="170" font-size="9" fill="#64748b" text-anchor="middle">Auth, Products, Cart, Orders, Admin</text>

        <rect x="280" y="195" width="220" height="45" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="390" y="215" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Middleware Layer</text>
        <text x="390" y="230" font-size="9" fill="#64748b" text-anchor="middle">JWT Verify, Rate Limiter, Multer</text>

        <rect x="280" y="255" width="220" height="45" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="390" y="275" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Stripe Webhook Handler</text>
        <text x="390" y="290" font-size="9" fill="#64748b" text-anchor="middle">Raw Body Signature Verification</text>

        <!-- External & Database Layer -->
        <rect x="580" y="30" width="200" height="95" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
        <text x="680" y="55" font-weight="bold" fill="#14532d" text-anchor="middle" font-size="13">PostgreSQL DB</text>
        <text x="680" y="75" font-size="9" fill="#15803d" text-anchor="middle">'pg' Pool Connections</text>
        <text x="680" y="92" font-size="9" fill="#15803d" text-anchor="middle">9 Relational Tables + JSONB</text>

        <rect x="580" y="140" width="200" height="90" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
        <text x="680" y="165" font-weight="bold" fill="#713f12" text-anchor="middle" font-size="13">Stripe API</text>
        <text x="680" y="185" font-size="9" fill="#a16207" text-anchor="middle">Payment Intents & Webhooks</text>

        <rect x="580" y="245" width="200" height="95" rx="8" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
        <text x="680" y="270" font-weight="bold" fill="#581c87" text-anchor="middle" font-size="13">Cloudinary Cloud</text>
        <text x="680" y="290" font-size="9" fill="#7e22ce" text-anchor="middle">Image Hosting & CDN</text>

        <!-- Connectors -->
        <line x1="200" y1="105" x2="260" y2="105" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="200" y1="160" x2="260" y2="160" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="500" y1="80" x2="580" y2="80" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="500" y1="180" x2="580" y2="180" stroke="#ca8a04" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="500" y1="280" x2="580" y2="280" stroke="#9333ea" stroke-width="2" marker-end="url(#arrow)"/>
      </svg>
    </div>
  </div>

  <!-- SECTION 2: USE CASES & ROLES -->
  <div class="page-break">
    <h1>2. System Use Cases & Role Matrix</h1>
    <p>The application defines clear operational privileges across three user roles: Guests, Authenticated Customers, and System Administrators.</p>

    <h2>2.1 Guest (Unauthenticated User) Capabilities</h2>
    <ul>
      <li><strong>Catalog Browsing:</strong> Explore furniture categories, filter products by category, price, or keywords, and view detailed product specs.</li>
      <li><strong>Interactive Gallery:</strong> Scroll through image carousels powered by Embla / Keen-Slider.</li>
      <li><strong>Reviews Inspection:</strong> Read customer product reviews and overall ratings without login requirement.</li>
      <li><strong>User Registration:</strong> Create a new customer account using full name, valid email, and secure password.</li>
    </ul>

    <h2>2.2 Authenticated Customer Capabilities</h2>
    <ul>
      <li><strong>Cart Session Management:</strong> Add products to cart, increment/decrement item quantities, and remove items with real-time total price calculation.</li>
      <li><strong>Wishlist Operations:</strong> Bookmark products to personal wishlist for future sessions.</li>
      <li><strong>Stripe Checkout Integration:</strong> Initiate secure payments via Stripe Checkout sessions, compute dynamic shipping rates, and complete transactions.</li>
      <li><strong>Order History & Tracking:</strong> Access historical order list, view itemized breakdown, and check status (<span class="code-inline">pending</span>, <span class="code-inline">paid</span>, <span class="code-inline">shipped</span>, <span class="code-inline">completed</span>).</li>
      <li><strong>Profile Customization:</strong> Update profile info, contact numbers, shipping addresses, and upload personal avatar images directly to Cloudinary.</li>
      <li><strong>Product Reviews:</strong> Submit star ratings and text reviews for purchased products.</li>
    </ul>

    <h2>2.3 Administrator Capabilities</h2>
    <ul>
      <li><strong>Analytics Dashboard:</strong> View system statistics including total sales revenue, order volumes, customer registrations, and inventory counts.</li>
      <li><strong>Product & Category Management (CRUD):** Add new furniture items, edit prices/descriptions/stock, delete items, and create categories with Cloudinary image uploads.</li>
      <li><strong>Order Fulfillment Controls:</strong> Inspect all store orders, view user details, and update fulfillment statuses.</li>
      <li><strong>Customer Management:</strong> View user accounts and contact details.</li>
      <li><strong>Dynamic Store Settings (JSONB):</strong> Update store information (name, email, phone, currency), toggle Stripe test mode, configure flat-rate shipping or free-shipping thresholds, and manage Cloudinary presets.</li>
    </ul>
  </div>

  <!-- SECTION 3: WORKFLOW FLOWCHARTS -->
  <div class="page-break">
    <h1>3. System Workflows & Flowcharts</h1>

    <h2>3.1 Customer Journey & Checkout Flow</h2>
    <div class="diagram-container">
      <div class="diagram-title">Figure 3.1: Customer Shopping & Checkout Flowchart</div>
      <svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569"/>
          </marker>
        </defs>

        <ellipse cx="380" cy="25" rx="60" ry="18" fill="#0f172a"/>
        <text x="380" y="29" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Customer Enters</text>

        <rect x="290" y="70" width="180" height="35" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="380" y="92" font-size="9" font-weight="bold" fill="#1e40af" text-anchor="middle">Browse Furniture Catalog</text>

        <polygon points="380,135 470,165 380,195 290,165" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
        <text x="380" y="169" font-size="8.5" font-weight="bold" fill="#92400e" text-anchor="middle">Authenticated?</text>

        <rect x="90" y="147" width="150" height="35" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="165" y="169" font-size="9" font-weight="bold" fill="#334155" text-anchor="middle">Sign Up / JWT Login</text>

        <rect x="530" y="147" width="170" height="35" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="615" y="169" font-size="9" font-weight="bold" fill="#166534" text-anchor="middle">Add to Cart / Wishlist</text>

        <rect x="290" y="225" width="180" height="35" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="380" y="247" font-size="9" font-weight="bold" fill="#1e40af" text-anchor="middle">Proceed to Checkout</text>

        <rect x="290" y="290" width="180" height="35" rx="5" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
        <text x="380" y="312" font-size="9" font-weight="bold" fill="#6b21a8" text-anchor="middle">Stripe Payment Gateway</text>

        <rect x="290" y="355" width="180" height="35" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
        <text x="380" y="377" font-size="9" font-weight="bold" fill="#14532d" text-anchor="middle">Order Placed & Cleared Cart</text>

        <ellipse cx="380" cy="415" rx="60" ry="14" fill="#16a34a"/>
        <text x="380" y="418" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Complete</text>

        <!-- Lines -->
        <line x1="380" y1="43" x2="380" y2="70" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="380" y1="105" x2="380" y2="135" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="290" y1="165" x2="240" y2="165" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <text x="265" y="157" font-size="8" font-weight="bold" fill="#dc2626">No</text>
        <line x1="165" y1="147" x2="165" y2="87" stroke="#475569" stroke-width="1.5"/>
        <line x1="165" y1="87" x2="290" y2="87" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="470" y1="165" x2="530" y2="165" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <text x="495" y="157" font-size="8" font-weight="bold" fill="#16a34a">Yes</text>
        <line x1="615" y1="182" x2="615" y2="242" stroke="#475569" stroke-width="1.5"/>
        <line x1="615" y1="242" x2="470" y2="242" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="380" y1="260" x2="380" y2="290" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="380" y1="325" x2="380" y2="355" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="380" y1="390" x2="380" y2="401" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
      </svg>
    </div>

    <h2>3.2 Admin Catalog & Store Management Flowchart</h2>
    <div class="diagram-container">
      <div class="diagram-title">Figure 3.2: Admin Workflow Diagram</div>
      <svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="85" width="130" height="35" rx="5" fill="#0f172a"/>
        <text x="85" y="106" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Admin Login</text>

        <rect x="180" y="85" width="130" height="35" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
        <text x="245" y="106" font-size="8.5" font-weight="bold" fill="#92400e" text-anchor="middle">Verify Role & JWT</text>

        <rect x="350" y="15" width="170" height="32" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="435" y="35" font-size="8.5" font-weight="bold" fill="#1e40af" text-anchor="middle">Manage Products (CRUD)</text>

        <rect x="350" y="62" width="170" height="32" rx="5" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
        <text x="435" y="82" font-size="8.5" font-weight="bold" fill="#6b21a8" text-anchor="middle">Upload Cloudinary Images</text>

        <rect x="350" y="109" width="170" height="32" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="435" y="129" font-size="8.5" font-weight="bold" fill="#166534" text-anchor="middle">Update Order Status</text>

        <rect x="350" y="156" width="170" height="32" rx="5" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5"/>
        <text x="435" y="176" font-size="8.5" font-weight="bold" fill="#c2410c" text-anchor="middle">Configure JSONB Settings</text>

        <rect x="570" y="85" width="160" height="35" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
        <text x="650" y="106" font-size="9" font-weight="bold" fill="#14532d" text-anchor="middle">PostgreSQL Database</text>

        <line x1="150" y1="102" x2="180" y2="102" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <line x1="310" y1="102" x2="330" y2="102" stroke="#475569" stroke-width="1.5"/>
        <path d="M 330 102 L 330 31 L 350 31" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 330 102 L 330 78 L 350 78" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 330 102 L 330 125 L 350 125" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 330 102 L 330 172 L 350 172" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>

        <path d="M 520 31 L 550 31 L 550 102 L 570 102" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 520 78 L 570 102" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 520 125 L 570 102" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
        <path d="M 520 172 L 550 172 L 550 102 L 570 102" fill="none" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow2)"/>
      </svg>
    </div>
  </div>

  <!-- SECTION 4: DATABASE SCHEMA & ER DIAGRAM -->
  <div class="page-break">
    <h1>4. Database ER Diagram & Relational Schemas</h1>
    <p>The system utilizes PostgreSQL with 9 relational tables enforcing foreign key constraints, unique indexes, cascading deletes, and JSONB dynamic key-value metadata.</p>

    <div class="diagram-container">
      <div class="diagram-title">Figure 4.1: PostgreSQL Relational ER Diagram</div>
      <svg viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
        <style>
          .er-title { font-size: 10px; font-weight: bold; fill: #ffffff; }
          .er-field { font-size: 8.5px; fill: #1e293b; }
          .er-pk { font-size: 8.5px; font-weight: bold; fill: #d97706; }
          .er-fk { font-size: 8.5px; font-weight: bold; fill: #2563eb; }
          .cardinality { font-size: 8.5px; font-weight: bold; fill: #0f172a; }
        </style>

        <!-- USERS -->
        <g transform="translate(30, 30)">
          <rect x="0" y="0" width="160" height="150" rx="5" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#2563eb"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">USERS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-field">email (UNIQUE)</text>
          <text x="10" y="70" class="er-field">password</text>
          <text x="10" y="85" class="er-field">name, phone</text>
          <text x="10" y="100" class="er-field">address, image_url</text>
          <text x="10" y="115" class="er-field">reset_token</text>
          <text x="10" y="130" class="er-field">created_at, updated_at</text>
        </g>

        <!-- CATEGORIES -->
        <g transform="translate(560, 30)">
          <rect x="0" y="0" width="160" height="95" rx="5" fill="#ffffff" stroke="#0d9488" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#0d9488"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">CATEGORIES</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-field">name</text>
          <text x="10" y="70" class="er-field">image_url, image_public_id</text>
          <text x="10" y="85" class="er-field">created_at</text>
        </g>

        <!-- PRODUCTS -->
        <g transform="translate(560, 165)">
          <rect x="0" y="0" width="160" height="150" rx="5" fill="#ffffff" stroke="#0d9488" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#0d9488"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">PRODUCTS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">category_id (FK)</text>
          <text x="10" y="70" class="er-field">name, price</text>
          <text x="10" y="85" class="er-field">description, stock</text>
          <text x="10" y="100" class="er-field">sku (UNIQUE)</text>
          <text x="10" y="115" class="er-field">image_url</text>
          <text x="10" y="130" class="er-field">created_at, updated_at</text>
        </g>

        <!-- CART -->
        <g transform="translate(295, 30)">
          <rect x="0" y="0" width="160" height="100" rx="5" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#9333ea"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">CART (Join)</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">user_id (FK CASCADE)</text>
          <text x="10" y="70" class="er-fk">product_id (FK CASCADE)</text>
          <text x="10" y="85" class="er-field">quantity</text>
        </g>

        <!-- WISHLIST -->
        <g transform="translate(295, 150)">
          <rect x="0" y="0" width="160" height="85" rx="5" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#9333ea"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">WISHLIST (Join)</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">user_id (FK CASCADE)</text>
          <text x="10" y="70" class="er-fk">product_id (FK CASCADE)</text>
        </g>

        <!-- ORDERS -->
        <g transform="translate(30, 250)">
          <rect x="0" y="0" width="160" height="115" rx="5" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#16a34a"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">ORDERS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">user_id (FK CASCADE)</text>
          <text x="10" y="70" class="er-field">total_price, status</text>
          <text x="10" y="85" class="er-field">shipping_address</text>
          <text x="10" y="100" class="er-field">created_at, updated_at</text>
        </g>

        <!-- ORDER ITEMS -->
        <g transform="translate(295, 250)">
          <rect x="0" y="0" width="160" height="115" rx="5" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#16a34a"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">ORDER_ITEMS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">order_id (FK CASCADE)</text>
          <text x="10" y="70" class="er-fk">product_id (FK)</text>
          <text x="10" y="85" class="er-field">quantity, price</text>
          <text x="10" y="100" class="er-field">created_at</text>
        </g>

        <!-- REVIEWS -->
        <g transform="translate(295, 380)">
          <rect x="0" y="0" width="160" height="100" rx="5" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#ea580c"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">REVIEWS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-fk">product_id (FK)</text>
          <text x="10" y="70" class="er-fk">user_id (FK)</text>
          <text x="10" y="85" class="er-field">rating, comment</text>
        </g>

        <!-- SETTINGS -->
        <g transform="translate(560, 380)">
          <rect x="0" y="0" width="160" height="100" rx="5" fill="#ffffff" stroke="#475569" stroke-width="2"/>
          <rect x="0" y="0" width="160" height="24" rx="4" fill="#475569"/>
          <text x="80" y="16" class="er-title" text-anchor="middle">SETTINGS</text>
          <text x="10" y="40" class="er-pk">id (PK)</text>
          <text x="10" y="55" class="er-field">category</text>
          <text x="10" y="70" class="er-field">key (UNIQUE)</text>
          <text x="10" y="85" class="er-field">value (JSONB)</text>
        </g>

        <!-- RELATIONAL LINES -->
        <path d="M 190 75 L 295 75" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="200" y="70" class="cardinality">1</text>
        <text x="280" y="70" class="cardinality">N</text>

        <path d="M 110 180 L 110 250" stroke="#64748b" stroke-width="1.5"/>
        <text x="118" y="195" class="cardinality">1</text>
        <text x="118" y="240" class="cardinality">N</text>

        <path d="M 190 300 L 295 300" stroke="#64748b" stroke-width="1.5"/>
        <text x="200" y="295" class="cardinality">1</text>
        <text x="280" y="295" class="cardinality">N</text>

        <path d="M 640 125 L 640 165" stroke="#64748b" stroke-width="1.5"/>
        <text x="648" y="140" class="cardinality">1</text>
        <text x="648" y="160" class="cardinality">N</text>
      </svg>
    </div>

    <h2>4.1 Table: <span class="code-inline">users</span></h2>
    <table>
      <thead>
        <tr><th>Column</th><th>Data Type</th><th>Constraints & Defaults</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td><td>Unique auto-incrementing user ID</td></tr>
        <tr><td>email</td><td class="type">VARCHAR(255)</td><td>NOT NULL, UNIQUE</td><td>User login email address</td></tr>
        <tr><td>password</td><td class="type">VARCHAR(255)</td><td>NOT NULL</td><td>Bcrypt hashed user password</td></tr>
        <tr><td>name</td><td class="type">VARCHAR(255)</td><td>NOT NULL</td><td>Full user profile name</td></tr>
        <tr><td>phone</td><td class="type">VARCHAR(20)</td><td>NULL</td><td>Contact telephone number</td></tr>
        <tr><td>address</td><td class="type">TEXT</td><td>NULL</td><td>Physical shipping address</td></tr>
        <tr><td>image_url</td><td class="type">TEXT</td><td>NULL</td><td>Cloudinary avatar image URL</td></tr>
        <tr><td>image_public_id</td><td class="type">VARCHAR(255)</td><td>NULL</td><td>Cloudinary asset public reference ID</td></tr>
        <tr><td>reset_token</td><td class="type">TEXT</td><td>NULL</td><td>Password reset security token</td></tr>
        <tr><td>reset_token_expiry</td><td class="type">TIMESTAMP</td><td>NULL</td><td>Reset token expiration timestamp</td></tr>
        <tr><td>created_at</td><td class="type">TIMESTAMP</td><td>DEFAULT CURRENT_TIMESTAMP</td><td>Record creation timestamp</td></tr>
        <tr><td>updated_at</td><td class="type">TIMESTAMP</td><td>DEFAULT CURRENT_TIMESTAMP</td><td>Last modification timestamp</td></tr>
      </tbody>
    </table>

    <h2>4.2 Table: <span class="code-inline">categories</span> & <span class="code-inline">products</span></h2>
    <div class="grid-2">
      <div>
        <h3><span class="code-inline">categories</span></h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td>name</td><td class="type">VARCHAR(100)</td><td>NOT NULL</td></tr>
            <tr><td>image_url</td><td class="type">TEXT</td><td>Cloudinary image URL</td></tr>
            <tr><td>image_public_id</td><td class="type">VARCHAR(255)</td><td>Cloudinary public ID</td></tr>
            <tr><td>created_at</td><td class="type">TIMESTAMP</td><td>DEFAULT CURRENT_TIMESTAMP</td></tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3><span class="code-inline">products</span></h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td class="fk">category_id</td><td class="type">INT</td><td>FK -> categories(id)</td></tr>
            <tr><td>name</td><td class="type">VARCHAR(255)</td><td>NOT NULL</td></tr>
            <tr><td>price</td><td class="type">DECIMAL(10,2)</td><td>NOT NULL</td></tr>
            <tr><td>stock</td><td class="type">INTEGER</td><td>DEFAULT 0</td></tr>
            <tr><td>sku</td><td class="type">VARCHAR(100)</td><td>UNIQUE</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- SECTION 4 CONTINUED: CART, WISHLIST, ORDERS, SETTINGS -->
  <div class="page-break">
    <h2>4.3 Tables: <span class="code-inline">cart</span>, <span class="code-inline">wishlist</span>, <span class="code-inline">orders</span>, <span class="code-inline">order_items</span>, <span class="code-inline">reviews</span></h2>
    
    <div class="grid-2">
      <div>
        <h3><span class="code-inline">cart</span> (User Shopping Session)</h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Constraints</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td class="fk">user_id</td><td class="type">INT</td><td>FK -> users(id) ON DELETE CASCADE</td></tr>
            <tr><td class="fk">product_id</td><td class="type">INT</td><td>FK -> products(id) ON DELETE CASCADE</td></tr>
            <tr><td>quantity</td><td class="type">INT</td><td>DEFAULT 1</td></tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3><span class="code-inline">wishlist</span> (Bookmarked Items)</h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Constraints</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td class="fk">user_id</td><td class="type">INT</td><td>FK -> users(id) ON DELETE CASCADE</td></tr>
            <tr><td class="fk">product_id</td><td class="type">INT</td><td>FK -> products(id) ON DELETE CASCADE</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <h3><span class="code-inline">orders</span> (Transactions)</h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td class="fk">user_id</td><td class="type">INT</td><td>FK -> users(id) ON DELETE CASCADE</td></tr>
            <tr><td>total_price</td><td class="type">DECIMAL(10,2)</td><td>Final amount in USD</td></tr>
            <tr><td>status</td><td class="type">VARCHAR(50)</td><td>DEFAULT 'pending' (paid/shipped)</td></tr>
            <tr><td>shipping_address</td><td class="type">TEXT</td><td>Delivery address</td></tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3><span class="code-inline">reviews</span> (User Ratings)</h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td class="pk">id</td><td class="type">SERIAL</td><td>PRIMARY KEY</td></tr>
            <tr><td class="fk">product_id</td><td class="type">INT</td><td>FK -> products(id)</td></tr>
            <tr><td class="fk">user_id</td><td class="type">INT</td><td>FK -> users(id)</td></tr>
            <tr><td>rating</td><td class="type">INTEGER</td><td>Star rating (1 - 5)</td></tr>
            <tr><td>comment</td><td class="type">TEXT</td><td>Feedback text</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2>4.4 JSONB Settings Specification (<span class="code-inline">settings</span>)</h2>
    <p>Admin configuration options are stored as key-value pairs utilizing PostgreSQL's <span class="code-inline">JSONB</span> type to avoid dynamic schema migrations when altering store rules.</p>
    <table>
      <thead>
        <tr><th>Key</th><th>Category</th><th>JSONB Data Payload Structure</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-inline">store_info</span></td>
          <td>store</td>
          <td><span class="code-inline">{ "name": "My Furniture Shop", "email": "contact@shop.com", "phone": "+90 555 000 0000", "currency": "USD" }</span></td>
        </tr>
        <tr>
          <td><span class="code-inline">stripe</span></td>
          <td>payment</td>
          <td><span class="code-inline">{ "enabled": true, "testMode": true }</span></td>
        </tr>
        <tr>
          <td><span class="code-inline">shipping_rules</span></td>
          <td>shipping</td>
          <td><span class="code-inline">{ "flatRate": 10, "freeShippingOver": 100 }</span></td>
        </tr>
        <tr>
          <td><span class="code-inline">cloudinary</span></td>
          <td>media</td>
          <td><span class="code-inline">{ "cloudName": "", "uploadPreset": "", "maxSizeMB": 5, "formats": ["jpg", "png", "webp"] }</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 5: REST API SPECIFICATION -->
  <div class="page-break">
    <h1>5. REST API Endpoint Specification</h1>
    <p>All REST API endpoints return standardized JSON responses. Protected endpoints require a valid JWT token passed via the <span class="code-inline">Authorization: Bearer &lt;TOKEN&gt;</span> header.</p>

    <table>
      <thead>
        <tr><th>Endpoint Path</th><th>HTTP Method</th><th>Auth Role Required</th><th>Function & Purpose</th></tr>
      </thead>
      <tbody>
        <tr><td><span class="code-inline">/api/auth/signup</span></td><td>POST</td><td>Public</td><td>Registers new user account</td></tr>
        <tr><td><span class="code-inline">/api/auth/login</span></td><td>POST</td><td>Public</td><td>Authenticates user & returns JWT</td></tr>
        <tr><td><span class="code-inline">/api/auth/me</span></td><td>GET</td><td>Bearer Token</td><td>Returns authenticated user profile</td></tr>
        <tr><td><span class="code-inline">/api/auth/profile</span></td><td>PUT</td><td>Bearer Token</td><td>Updates user info & Cloudinary avatar</td></tr>
        <tr><td><span class="code-inline">/api/products</span></td><td>GET</td><td>Public</td><td>Fetches product list with filters</td></tr>
        <tr><td><span class="code-inline">/api/products/:id</span></td><td>GET</td><td>Public</td><td>Fetches single product details</td></tr>
        <tr><td><span class="code-inline">/api/products</span></td><td>POST</td><td>Admin Token</td><td>Creates new product + image upload</td></tr>
        <tr><td><span class="code-inline">/api/categories</span></td><td>GET / POST</td><td>Public / Admin</td><td>Manages furniture categories</td></tr>
        <tr><td><span class="code-inline">/api/cart</span></td><td>GET / POST / DELETE</td><td>Bearer Token</td><td>Manages user cart session & quantities</td></tr>
        <tr><td><span class="code-inline">/api/wishlist</span></td><td>GET / POST / DELETE</td><td>Bearer Token</td><td>Manages user product bookmarks</td></tr>
        <tr><td><span class="code-inline">/api/order/create-checkout-session</span></td><td>POST</td><td>Bearer Token</td><td>Generates Stripe payment checkout session</td></tr>
        <tr><td><span class="code-inline">/api/order/webhook</span></td><td>POST</td><td>Stripe Signature</td><td>Stripe payment webhook clearance listener</td></tr>
        <tr><td><span class="code-inline">/api/reviews/product/:id</span></td><td>GET / POST</td><td>Public / Bearer Token</td><td>Fetches and adds item reviews</td></tr>
        <tr><td><span class="code-inline">/api/admin/stats</span></td><td>GET</td><td>Admin Token</td><td>Fetches store analytics & sales stats</td></tr>
        <tr><td><span class="code-inline">/api/settings</span></td><td>GET / PUT</td><td>Admin Token</td><td>Reads and updates JSONB store settings</td></tr>
      </tbody>
    </table>

    <h1>6. Security, Authentication & Webhooks</h1>
    <div class="security-box">
      <strong>Security & Data Integrity Guarantees:</strong>
      <ul>
        <li><strong>Password Protection:</strong> Hashed using bcrypt with 10 salt rounds prior to DB persistence.</li>
        <li><strong>JWT Stateless Verification:</strong> Tokens signed with secret keys, verified on protected routes.</li>
        <li><strong>Stripe Webhook Signature Verification:</strong> Raw body parsing ensures webhook payloads originate directly from Stripe.</li>
        <li><strong>Rate Limiting & Helmet:</strong> HTTP security headers configured via <span class="code-inline">helmet</span> and DDoS rate limiting active on auth endpoints.</li>
      </ul>
    </div>
  </div>

  <!-- SECTION 7: DIRECTORY STRUCTURE & SETUP -->
  <div class="page-break">
    <h1>7. Repository Structure & Operational Setup</h1>

    <h2>7.1 Directory Organization</h2>
    <pre>
c:\\Users\\HP\\furnitures\\
├── backend/
│   ├── controllers/       # Route controllers (products, auth, orders, admin)
│   ├── database/          # PostgreSQL client setup & initDB script
│   ├── middleware/        # JWT auth verification, rate limiting, error handlers
│   ├── routes/            # Express REST API endpoint definitions
│   └── server.js          # Main Express API entry point & Stripe webhook listener
├── dist/                  # Compiled SSR & server bundle output
├── furniture-react/       # Frontend Application Code
│   └── src/
│       ├── client/        # Client browser entry (main.jsx)
│       └── shared/        # React components, pages, Redux slices, hooks
│           ├── components/# UI modules (Header, Footer, ProductCard, AdminDashboard)
│           ├── contexts/   # React global state contexts
│           ├── services/   # Axios API client services
│           └── slices/     # Redux Toolkit state slices
├── ssr/                    # Webpack Server-Side Rendering template engine   # PDF documentation generator script
├── webpack.client.js      # Client React bundle Webpack configuration
└── webpack.server.js      # Server SSR bundle Webpack configuration
</pre>

    <h2>7.2 Environment Configuration (<span class="code-inline">.env</span>)</h2>
    <table>
      <thead><tr><th>Variable Key</th><th>Description</th><th>Example / Default Value</th></tr></thead>
      <tbody>
        <tr><td><span class="code-inline">PORT</span></td><td>Backend server port</td><td><span class="code-inline">5000</span></td></tr>
        <tr><td><span class="code-inline">DATABASE_URL</span></td><td>PostgreSQL connection string</td><td><span class="code-inline">postgres://user:pass@localhost:5432/furniture</span></td></tr>
        <tr><td><span class="code-inline">JWT_SECRET</span></td><td>Secret key for signing auth tokens</td><td><span class="code-inline">super_secret_jwt_key_12345</span></td></tr>
        <tr><td><span class="code-inline">STRIPE_SECRET_KEY</span></td><td>Stripe API secret key</td><td><span class="code-inline">sk_test_...</span></td></tr>
        <tr><td><span class="code-inline">STRIPE_WEBHOOK_SECRET</span></td><td>Stripe webhook signature secret</td><td><span class="code-inline">whsec_...</span></td></tr>
        <tr><td><span class="code-inline">CLOUDINARY_CLOUD_NAME</span></td><td>Cloudinary account cloud name</td><td><span class="code-inline">demo_cloud</span></td></tr>
      </tbody>
    </table>

    <h2>7.3 Quick Start & Build Instructions</h2>
    <div class="info-box">
      <strong>Execution Commands:</strong>
      <ol>
        <li><strong>Install Dependencies:</strong> <span class="code-inline">npm install</span></li>
        <li><strong>Initialize Database:</strong> <span class="code-inline">node backend/database/initDB.js</span></li>
        <li><strong>Run Development Server (Concurrent Client & Server):</strong> <span class="code-inline">npm run dev</span></li>
      </ol>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(__dirname, 'temp_doc.html');
const pdfOutputPath = path.join(__dirname, 'DOCUMENTATION.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
console.log('Temporary HTML document created at:', tempHtmlPath);

// Locate Edge executable
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (!fs.existsSync(edgePath)) {
  console.error('Edge browser not found at expected path:', edgePath);
  process.exit(1);
}

console.log('Rendering HTML to PDF via Microsoft Edge Headless...');
try {
  const cmd = `"${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfOutputPath}" --no-margins "${tempHtmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('PDF rendered successfully to:', pdfOutputPath);
} catch (err) {
  console.error('Error generating PDF:', err);
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
    console.log('Cleaned up temporary HTML file.');
  }
}
