# Phase 5: Manufacturing CRM System - Comprehensive Specifications

**Version**: 1.0
**Date**: March 13, 2026
**Status**: Specification & Planning Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Core Modules](#core-modules)
6. [API Specifications](#api-specifications)
7. [UI/UX Specifications](#uiux-specifications)
8. [Implementation Phases](#implementation-phases)

---

## Project Overview

### Purpose
Create a Manufacturing-focused Customer Relationship Management (CRM) system integrated with the Ribbon UI component framework. The system will manage organizations, contacts, products/services, opportunities, quotes, and invoices with advanced features like document versioning, polymorphic relations, and audit trails.

### Key Features
- Document revision system with conflict detection
- Polymorphic data modeling for flexible relationships
- Comprehensive audit logging
- Custom field system for extensibility
- Master/Detail organization structure
- Advanced address management with polymorphic support
- Quote-to-Invoice workflow
- Vector-based search capabilities (SQLite with vector extensions)

### Target Users
Manufacturing businesses managing:
- Customer/Organization relationships
- Sales opportunities and quotes
- Order management
- Service delivery
- Financial tracking

---

## System Architecture

### Architectural Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Tauri Desktop App                       │
├─────────────────────────────────────────────────────────────┤
│  Ribbon UI Framework (Phase 1-4 Components)                 │
│  ├── Ribbon (Main navigation)                               │
│  ├── Toolbar (Quick actions)                                │
│  ├── Sidebar (Navigation/Filters)                           │
│  └── 20 Core Components (Forms, Tables, etc.)               │
├─────────────────────────────────────────────────────────────┤
│  CRM Application Layer                                       │
│  ├── Organizations Module                                   │
│  ├── Contacts Module                                        │
│  ├── Products/Services Module                               │
│  ├── Opportunities Module                                   │
│  ├── Quotes Module                                          │
│  ├── Invoices Module                                        │
│  └── Address Management Module                              │
├─────────────────────────────────────────────────────────────┤
│  API Layer (REST + Local IPC)                               │
│  ├── Organization API                                       │
│  ├── Contact API                                            │
│  ├── Product API                                            │
│  ├── Opportunity API                                        │
│  ├── Quote API                                              │
│  ├── Invoice API                                            │
│  ├── Address API                                            │
│  └── Audit API                                              │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── SQLite Database                                        │
│  ├── Vector Extensions (Semantic Search)                    │
│  ├── Document History System                                │
│  └── Audit Trail System                                     │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Polymorphic Relations**: Support flexible entity relationships
2. **Document Versioning**: Track all changes with revision history
3. **Audit Compliance**: Complete audit trail for compliance
4. **Extensibility**: Custom fields for domain-specific attributes
5. **Data Integrity**: Referential integrity and conflict detection
6. **Performance**: Indexed searches with vector support

---

## Technology Stack

### Frontend
- **Framework**: React with Ribbon UI components (Phases 1-4)
- **Desktop**: Tauri (Rust backend, web frontend)
- **State Management**: React Context + Hooks
- **HTTP Client**: Tauri invoke for IPC

### Backend
- **Runtime**: Tauri (Rust)
- **HTTP Server**: Tauri built-in endpoints
- **Database**: SQLite with vector extensions
- **ORM**: sqlx (Rust SQLite client)

### Database
- **Primary**: SQLite 3.45+
- **Extensions**:
  - Vector extension for semantic search
  - JSON1 extension for JSON fields
  - FTS5 for full-text search
- **History**: sqlite-history for versioning

### Development
- **Language**: TypeScript (Frontend), Rust (Backend)
- **Package Manager**: pnpm (Frontend), Cargo (Backend)
- **Build Tool**: Vite + Tauri

---

## Database Schema

### 1. Core Tables

#### organizations
```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  vat_number TEXT,
  trade_currency TEXT DEFAULT 'USD',
  organization_type ENUM ('HEAD_OFFICE', 'BRANCH'),
  parent_organization_id TEXT, -- FK for branches
  description TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (parent_organization_id)
    REFERENCES organizations(id)
);
```

#### contacts
```sql
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,

  organization_id TEXT NOT NULL,
  office_assignment TEXT, -- 'HEAD_OFFICE' or specific branch ID
  role_id TEXT, -- FK to contact_roles

  title TEXT,
  department TEXT,
  bio TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (role_id) REFERENCES contact_roles(id)
);
```

#### contact_roles
```sql
CREATE TABLE contact_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., 'Sales Manager', 'Purchasing', etc.
  description TEXT,
  organization_id TEXT, -- Can be org-specific or global

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);
```

#### addresses (Polymorphic)
```sql
CREATE TABLE addresses (
  id TEXT PRIMARY KEY,

  -- Polymorphic fields
  entity_type TEXT NOT NULL, -- 'ORGANIZATION', 'CONTACT'
  entity_id TEXT NOT NULL,
  address_type TEXT NOT NULL, -- 'OFFICE', 'DELIVERY', 'INVOICE'

  -- Address fields
  line1 TEXT NOT NULL,
  line2 TEXT,
  line3 TEXT,
  line4 TEXT,
  county TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,

  -- Contact info for address
  default_email TEXT,
  phone_number TEXT,
  mobile_number TEXT,
  fax_number TEXT,

  is_default_invoice BOOLEAN DEFAULT FALSE,
  is_default_delivery BOOLEAN DEFAULT FALSE,

  -- Constraints: Only 1 default per type per entity

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  UNIQUE(entity_type, entity_id, address_type, is_default_invoice)
    WHERE is_default_invoice = TRUE,
  UNIQUE(entity_type, entity_id, address_type, is_default_delivery)
    WHERE is_default_delivery = TRUE
);
```

#### products_services
```sql
CREATE TABLE products_services (
  id TEXT PRIMARY KEY,

  name TEXT NOT NULL,
  description TEXT,
  product_type_id TEXT NOT NULL, -- FK to product_types

  -- Base fields
  sku TEXT UNIQUE,
  unit_price DECIMAL(12, 4),
  cost_price DECIMAL(12, 4),
  currency TEXT DEFAULT 'USD',
  unit_of_measure TEXT, -- 'UNIT', 'HOUR', 'KG', etc.

  -- Stock management
  is_service BOOLEAN DEFAULT FALSE,
  stock_quantity INT DEFAULT 0,
  min_stock_level INT,

  -- Custom fields (JSON)
  custom_fields JSON, -- {"field_name": value, ...}

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (product_type_id) REFERENCES product_types(id)
);
```

#### product_types
```sql
CREATE TABLE product_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., 'Windows', 'Doors', 'Hardware'
  description TEXT,

  -- Taxonomy/category
  parent_type_id TEXT, -- For hierarchical categories

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (parent_type_id) REFERENCES product_types(id)
);
```

#### product_type_fields (Custom Fields)
```sql
CREATE TABLE product_type_fields (
  id TEXT PRIMARY KEY,
  product_type_id TEXT NOT NULL,

  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- 'TEXT', 'NUMBER', 'DATE', 'ENUM', 'JSON'
  field_label TEXT,
  description TEXT,

  is_required BOOLEAN DEFAULT FALSE,
  sort_order INT,

  -- Field metadata
  validation_rules JSON, -- {"min": 0, "max": 100, ...}
  default_value TEXT,
  enum_values JSON, -- ["Option1", "Option2", ...]

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### opportunities
```sql
CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,

  name TEXT NOT NULL,
  description TEXT,

  organization_id TEXT NOT NULL,
  contact_id TEXT, -- Primary contact

  -- Opportunity details
  estimated_value DECIMAL(12, 4),
  currency TEXT DEFAULT 'USD',
  probability DECIMAL(3, 2), -- 0.00 to 1.00

  -- Dates
  expected_close_date DATE,

  -- Stage
  stage_id TEXT NOT NULL, -- FK to opportunity_stages

  -- Source
  source TEXT, -- 'INBOUND', 'OUTBOUND', 'REFERRAL', etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (stage_id) REFERENCES opportunity_stages(id)
);
```

#### opportunity_stages
```sql
CREATE TABLE opportunity_stages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);
```

#### quotes
```sql
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,

  organization_id TEXT NOT NULL,
  contact_id TEXT,
  opportunity_id TEXT,

  -- Quote details
  title TEXT,
  description TEXT,

  -- Dates
  quote_date DATE NOT NULL,
  expiry_date DATE,

  -- Amounts
  subtotal DECIMAL(12, 4),
  tax_amount DECIMAL(12, 4),
  tax_rate DECIMAL(5, 2),
  discount_amount DECIMAL(12, 4),
  total DECIMAL(12, 4),
  currency TEXT DEFAULT 'USD',

  -- Addresses
  delivery_address_id TEXT,
  invoice_address_id TEXT,

  -- Status
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'CONVERTED'

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
  FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
  FOREIGN KEY (invoice_address_id) REFERENCES addresses(id)
);
```

#### quote_line_items
```sql
CREATE TABLE quote_line_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,

  product_service_id TEXT,
  description TEXT NOT NULL,

  quantity DECIMAL(10, 4),
  unit_price DECIMAL(12, 4),
  discount_percent DECIMAL(5, 2),
  line_total DECIMAL(12, 4),

  sort_order INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (product_service_id) REFERENCES products_services(id)
);
```

#### invoices
```sql
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,

  organization_id TEXT NOT NULL,
  contact_id TEXT,
  quote_id TEXT, -- Original quote if converted

  -- Invoice details
  title TEXT,
  description TEXT,

  -- Dates
  invoice_date DATE NOT NULL,
  due_date DATE,

  -- Amounts
  subtotal DECIMAL(12, 4),
  tax_amount DECIMAL(12, 4),
  tax_rate DECIMAL(5, 2),
  discount_amount DECIMAL(12, 4),
  total DECIMAL(12, 4),
  currency TEXT DEFAULT 'USD',

  -- Payment tracking
  amount_paid DECIMAL(12, 4) DEFAULT 0,
  payment_due DECIMAL(12, 4),

  -- Addresses
  delivery_address_id TEXT,
  invoice_address_id TEXT,

  -- Status
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  updated_by TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
  FOREIGN KEY (invoice_address_id) REFERENCES addresses(id)
);
```

#### invoice_line_items
```sql
CREATE TABLE invoice_line_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,

  product_service_id TEXT,
  description TEXT NOT NULL,

  quantity DECIMAL(10, 4),
  unit_price DECIMAL(12, 4),
  discount_percent DECIMAL(5, 2),
  line_total DECIMAL(12, 4),

  sort_order INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (product_service_id) REFERENCES products_services(id)
);
```

### 2. Versioning & History Tables

#### document_revisions
```sql
CREATE TABLE document_revisions (
  id TEXT PRIMARY KEY,

  -- Document reference
  document_type TEXT NOT NULL, -- 'QUOTE', 'INVOICE', 'ORGANIZATION', etc.
  document_id TEXT NOT NULL,

  revision_number INT NOT NULL,

  -- Data snapshot
  record_data JSON NOT NULL, -- Complete JSON of document at this revision

  -- Change metadata
  change_summary TEXT,
  changed_fields JSON, -- ["field1", "field2", ...]

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  change_reason TEXT,

  -- Conflict detection
  parent_revision_id TEXT,
  is_conflict BOOLEAN DEFAULT FALSE,
  conflict_resolution_notes TEXT,

  UNIQUE(document_type, document_id, revision_number),
  FOREIGN KEY (parent_revision_id)
    REFERENCES document_revisions(id)
);
```

#### document_links
```sql
CREATE TABLE document_links (
  id TEXT PRIMARY KEY,

  source_document_type TEXT NOT NULL,
  source_document_id TEXT NOT NULL,
  source_revision_id TEXT,

  target_document_type TEXT NOT NULL,
  target_document_id TEXT NOT NULL,
  target_revision_id TEXT,

  link_type TEXT NOT NULL, -- 'QUOTE_TO_INVOICE', 'ORG_TO_CONTACT', etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,

  FOREIGN KEY (source_revision_id)
    REFERENCES document_revisions(id),
  FOREIGN KEY (target_revision_id)
    REFERENCES document_revisions(id)
);
```

### 3. Audit Trail

#### audit_log
```sql
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,

  -- Entity reference
  entity_type TEXT NOT NULL, -- 'ORGANIZATION', 'CONTACT', 'QUOTE', etc.
  entity_id TEXT NOT NULL,

  -- Action
  action TEXT NOT NULL, -- 'CREATE', 'READ', 'UPDATE', 'DELETE'

  -- Changes
  old_values JSON,
  new_values JSON,
  changed_fields JSON,

  -- User & context
  user_id TEXT,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,

  -- Metadata
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,

  -- Query tracking
  query_executed TEXT
);
```

### 4. Vector Search Tables (Optional)

#### document_embeddings
```sql
CREATE TABLE document_embeddings (
  id TEXT PRIMARY KEY,

  document_type TEXT NOT NULL,
  document_id TEXT NOT NULL,

  content TEXT, -- Searchable content
  embedding VECTOR(384), -- Vector embedding for semantic search

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (document_id)
    REFERENCES {appropriate table}(id)
);
```

---

## Core Modules

### 1. Organization Module

#### Responsibilities
- Manage organization records (Head Office and Branches)
- Handle master/detail relationships
- Store organization-specific settings (VAT, currency, etc.)

#### Key Features
- Head Office with multiple Branches
- Organization hierarchy
- VAT Number and Trade Currency management
- Contact association
- Address management

#### Workflows
```
Create Organization
  ├── Create Head Office
  ├── Create Branches (linked to Head Office)
  ├── Add Addresses (with polymorphic support)
  └── Set defaults (delivery, invoice addresses)

View Organization
  ├── Show organization details
  ├── Display all branches
  ├── Show all associated contacts
  └── List all addresses
```

### 2. Contact Module

#### Responsibilities
- Manage contact records
- Assign roles to contacts
- Link contacts to organizations (head office or branch)
- Track contact hierarchy

#### Key Features
- Contact role management
- Office assignment (head office or specific branch)
- Contact information storage
- Contact-specific audit trail

#### Workflows
```
Create Contact
  ├── Enter contact details
  ├── Assign organization (head office or branch)
  ├── Assign role
  └── Add contact addresses

View Contact
  ├── Show contact details
  ├── Display role and office assignment
  ├── Show related opportunities
  └── Show communication history
```

### 3. Address Module

#### Responsibilities
- Manage polymorphic addresses
- Support multiple address types
- Enforce single default per type per entity
- Store address contact information

#### Key Features
- Polymorphic address support (ORGANIZATION, CONTACT)
- Multiple address types (OFFICE, DELIVERY, INVOICE)
- Default address selection with constraints
- Address-specific contact information
- Address validation

#### Workflows
```
Create Address
  ├── Select entity (organization or contact)
  ├── Select address type (office, delivery, invoice)
  ├── Enter address details
  ├── Add contact information
  ├── Set as default (if applicable)
  └── Validate address

Update Default Address
  ├── Select entity and address type
  ├── Choose new default from existing addresses
  └── System prevents duplicate defaults
```

### 4. Products & Services Module

#### Responsibilities
- Manage product/service catalog
- Support custom fields by product type
- Handle product taxonomy
- Manage pricing and stock

#### Key Features
- Product type hierarchy
- Dynamic custom fields per product type
- SKU management
- Pricing (unit, cost, currency)
- Stock tracking
- Service vs Product distinction

#### Workflows
```
Create Product Type
  ├── Define product type name
  ├── Set parent category (if applicable)
  └── Define custom fields for this type

Create Product/Service
  ├── Select product type
  ├── Enter base details (name, description, SKU)
  ├── Enter pricing and units
  ├── Fill custom fields (based on product type)
  └── Set stock information

View Product
  ├── Display base information
  ├── Show product type
  ├── Display custom fields
  └── Show stock and pricing
```

### 5. Opportunity Module

#### Responsibilities
- Track sales opportunities
- Manage opportunity stages
- Calculate pipeline values
- Link to organizations and quotes

#### Key Features
- Opportunity staging
- Value and probability tracking
- Stage transitions
- Opportunity source tracking
- Historical tracking through revisions

#### Workflows
```
Create Opportunity
  ├── Select organization
  ├── Select contact (optional)
  ├── Enter opportunity details
  ├── Set estimated value and probability
  ├── Set expected close date
  └── Assign to stage

Move Opportunity
  ├── Update stage
  ├── Update probability
  └── Create audit trail entry

Convert to Quote
  ├── Create new quote from opportunity
  ├── Link opportunity to quote
  └── Create document link
```

### 6. Quote Module

#### Responsibilities
- Generate and manage quotes
- Track quote versions through revisions
- Convert to invoices
- Manage line items

#### Key Features
- Auto-generated quote numbers
- Quote expiry dates
- Discount and tax calculation
- Line item management
- Quote status workflow
- Conversion to invoice
- Address selection (delivery/invoice)

#### Workflows
```
Create Quote
  ├── Select organization and contact
  ├── Link to opportunity
  ├── Add line items
  ├── Set delivery/invoice addresses
  ├── Calculate totals
  ├── Save as DRAFT
  └── Create initial revision

Send Quote
  ├── Change status to SENT
  ├── Create revision
  └── Create audit entry

Convert to Invoice
  ├── Create new invoice from quote
  ├── Link to original quote
  ├── Initialize invoice items from quote items
  ├── Create document link
  └── Create revision for both documents
```

### 7. Invoice Module

#### Responsibilities
- Generate and manage invoices
- Track payment status
- Support invoice versioning
- Manage line items

#### Key Features
- Auto-generated invoice numbers
- Due date tracking
- Payment tracking
- Status workflow
- Line item management
- Address selection
- Quote linkage

#### Workflows
```
Create Invoice
  ├── Enter invoice details
  ├── Add line items
  ├── Set addresses
  ├── Calculate amounts
  └── Save as DRAFT

Send Invoice
  ├── Change status to SENT
  ├── Create revision
  └── Create audit entry

Record Payment
  ├── Update amount paid
  ├── Update status (if fully paid)
  └── Create audit entry

Update Invoice
  ├── Create new revision
  ├── Check for conflicts
  ├── Store old values
  └── Ask user if data has changed in linked quote
```

---

## API Specifications

### Base API Structure

#### Response Format (JSON)
```typescript
// Success Response
{
  success: true,
  data: {...},
  meta: {
    timestamp: "2026-03-13T10:30:00Z",
    version: "1.0"
  }
}

// Error Response
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable message",
    details: {...}
  }
}
```

### Organization API

#### Endpoints

**GET /api/organizations**
```
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 50)
  - search: string (text search)
  - type: 'HEAD_OFFICE' | 'BRANCH'
  - includeDeleted: boolean (default: false)

Response:
  - organizations: Organization[]
  - total: number
  - pages: number
```

**GET /api/organizations/:id**
```
Response:
  - organization: Organization
  - branches: Organization[]
  - contacts: Contact[]
  - addresses: Address[]
  - recentActivity: AuditLog[]
```

**POST /api/organizations**
```
Body:
  {
    name: string,
    type: 'HEAD_OFFICE' | 'BRANCH',
    parentOrganizationId: string (optional),
    vatNumber: string,
    tradeCurrency: string,
    website: string,
    email: string,
    phone: string
  }

Response:
  - organization: Organization
  - revision: DocumentRevision
```

**PUT /api/organizations/:id**
```
Body: Partial Organization

Response:
  - organization: Organization
  - revision: DocumentRevision
  - changedFields: string[]
```

**DELETE /api/organizations/:id**
```
Query Parameters:
  - soft: boolean (default: true)

Response:
  - success: boolean
  - auditLog: AuditLog
```

### Contact API

#### Endpoints

**GET /api/contacts**
```
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - organizationId: string
  - roleId: string
  - includeDeleted: boolean

Response:
  - contacts: Contact[]
  - total: number
  - pages: number
```

**GET /api/contacts/:id**
```
Response:
  - contact: Contact
  - organization: Organization
  - role: ContactRole
  - opportunities: Opportunity[]
  - activityLog: AuditLog[]
```

**POST /api/contacts**
```
Body:
  {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    mobile: string,
    organizationId: string,
    officeAssignment: string,
    roleId: string,
    title: string,
    department: string,
    bio: string
  }

Response:
  - contact: Contact
  - revision: DocumentRevision
```

**PUT /api/contacts/:id**
```
Body: Partial Contact

Response:
  - contact: Contact
  - revision: DocumentRevision
  - changedFields: string[]
```

### Address API

#### Endpoints

**GET /api/addresses**
```
Query Parameters:
  - entityType: 'ORGANIZATION' | 'CONTACT'
  - entityId: string
  - addressType: string

Response:
  - addresses: Address[]
```

**POST /api/addresses**
```
Body:
  {
    entityType: 'ORGANIZATION' | 'CONTACT',
    entityId: string,
    addressType: 'OFFICE' | 'DELIVERY' | 'INVOICE',
    line1: string,
    line2: string,
    line3: string,
    line4: string,
    county: string,
    postalCode: string,
    country: string,
    defaultEmail: string,
    phoneNumber: string,
    mobileNumber: string,
    isDefaultInvoice: boolean,
    isDefaultDelivery: boolean
  }

Response:
  - address: Address
  - revision: DocumentRevision
```

**PUT /api/addresses/:id**
```
Body: Partial Address

Response:
  - address: Address
  - revision: DocumentRevision
```

**PUT /api/addresses/:id/set-default**
```
Body:
  {
    addressType: 'INVOICE' | 'DELIVERY'
  }

Response:
  - address: Address
  - previousDefault: Address | null
  - revision: DocumentRevision
```

### Products & Services API

#### Endpoints

**GET /api/products**
```
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - productTypeId: string
  - isService: boolean

Response:
  - products: ProductService[]
  - total: number
  - pages: number
```

**GET /api/product-types**
```
Response:
  - productTypes: ProductType[]
  - with hierarchy structure
```

**POST /api/product-types**
```
Body:
  {
    name: string,
    description: string,
    parentTypeId: string (optional),
    customFields: ProductTypeField[]
  }

Response:
  - productType: ProductType
  - customFields: ProductTypeField[]
```

**POST /api/products**
```
Body:
  {
    name: string,
    description: string,
    productTypeId: string,
    sku: string,
    unitPrice: number,
    costPrice: number,
    currency: string,
    unitOfMeasure: string,
    isService: boolean,
    stockQuantity: number,
    minStockLevel: number,
    customFields: {[key: string]: value}
  }

Response:
  - product: ProductService
  - revision: DocumentRevision
```

### Opportunities API

#### Endpoints

**GET /api/opportunities**
```
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - organizationId: string
  - stageId: string
  - statusFilter: string

Response:
  - opportunities: Opportunity[]
  - pipelineValue: number
  - total: number
```

**POST /api/opportunities**
```
Body:
  {
    name: string,
    description: string,
    organizationId: string,
    contactId: string,
    estimatedValue: number,
    currency: string,
    probability: number,
    expectedCloseDate: date,
    stageId: string,
    source: string
  }

Response:
  - opportunity: Opportunity
  - revision: DocumentRevision
```

**PUT /api/opportunities/:id/move-stage**
```
Body:
  {
    newStageId: string,
    probability: number (optional)
  }

Response:
  - opportunity: Opportunity
  - revision: DocumentRevision
  - stageHistory: OpportunityStageChange[]
```

### Quotes API

#### Endpoints

**GET /api/quotes**
```
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - organizationId: string
  - status: string
  - dateRange: {from: date, to: date}

Response:
  - quotes: Quote[]
  - total: number
```

**GET /api/quotes/:id**
```
Response:
  - quote: Quote
  - lineItems: QuoteLineItem[]
  - organization: Organization
  - contact: Contact
  - opportunity: Opportunity (optional)
  - revisions: DocumentRevision[]
  - relatedDocuments: DocumentLink[]
```

**POST /api/quotes**
```
Body:
  {
    organizationId: string,
    contactId: string,
    opportunityId: string (optional),
    quoteDate: date,
    expiryDate: date,
    lineItems: {
      productServiceId: string,
      description: string,
      quantity: number,
      unitPrice: number,
      discountPercent: number
    }[],
    deliveryAddressId: string,
    invoiceAddressId: string,
    taxRate: number
  }

Response:
  - quote: Quote
  - quoteNumber: string
  - revision: DocumentRevision
```

**PUT /api/quotes/:id**
```
Body: Partial Quote

Response:
  - quote: Quote
  - revision: DocumentRevision
  - changedFields: string[]
```

**POST /api/quotes/:id/send**
```
Response:
  - quote: Quote (status: SENT)
  - revision: DocumentRevision
  - auditLog: AuditLog
```

**POST /api/quotes/:id/convert-to-invoice**
```
Response:
  - invoice: Invoice
  - quoteRevision: DocumentRevision
  - invoiceRevision: DocumentRevision
  - documentLink: DocumentLink
```

### Invoices API

#### Endpoints

**GET /api/invoices**
```
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - organizationId: string
  - status: string
  - overdueOnly: boolean
  - dateRange: {from: date, to: date}

Response:
  - invoices: Invoice[]
  - totalOutstanding: number
  - totalOverdue: number
  - total: number
```

**GET /api/invoices/:id**
```
Response:
  - invoice: Invoice
  - lineItems: InvoiceLineItem[]
  - organization: Organization
  - contact: Contact
  - quote: Quote (optional)
  - revisions: DocumentRevision[]
  - paymentHistory: PaymentLog[]
```

**POST /api/invoices**
```
Body:
  {
    organizationId: string,
    contactId: string,
    quoteId: string (optional),
    invoiceDate: date,
    dueDate: date,
    lineItems: {...}[],
    deliveryAddressId: string,
    invoiceAddressId: string,
    taxRate: number
  }

Response:
  - invoice: Invoice
  - invoiceNumber: string
  - revision: DocumentRevision
```

**PUT /api/invoices/:id**
```
Body: Partial Invoice

Response:
  - invoice: Invoice
  - revision: DocumentRevision
  - changedFields: string[]
  - conflictWarning?: {
      relatedQuoteChanged: boolean,
      details: string
    }
```

**POST /api/invoices/:id/record-payment**
```
Body:
  {
    amountPaid: number,
    paymentDate: date,
    paymentMethod: string,
    reference: string (optional)
  }

Response:
  - invoice: Invoice (updated status)
  - paymentLog: PaymentLog
  - revision: DocumentRevision
```

**POST /api/invoices/:id/send**
```
Response:
  - invoice: Invoice (status: SENT)
  - revision: DocumentRevision
  - auditLog: AuditLog
```

### Audit API

#### Endpoints

**GET /api/audit-log**
```
Query Parameters:
  - entityType: string
  - entityId: string
  - action: string
  - userId: string
  - dateRange: {from: date, to: date}
  - page: number
  - limit: number

Response:
  - entries: AuditLog[]
  - total: number
```

**GET /api/audit-log/:id**
```
Response:
  - entry: AuditLog
  - changes: {field: string, oldValue: any, newValue: any}[]
```

### Revision API

#### Endpoints

**GET /api/revisions/:documentType/:documentId**
```
Query Parameters:
  - page: number
  - limit: number
  - includeData: boolean

Response:
  - revisions: DocumentRevision[]
  - total: number
```

**GET /api/revisions/:revisionId**
```
Response:
  - revision: DocumentRevision
  - recordData: object
  - parentRevision: DocumentRevision (optional)
  - childRevisions: DocumentRevision[]
```

**POST /api/revisions/:documentType/:documentId/check-conflicts**
```
Body:
  {
    currentRevisionId: string,
    proposedChanges: object
  }

Response:
  - hasConflict: boolean,
  - conflictingFields: string[],
  - lastRevision: DocumentRevision,
  - recommendation: string
```

---

## UI/UX Specifications

### Navigation Structure

#### Main Ribbon UI Layout
```
┌──────────────────────────────────────────┐
│  Ribbon (Home | Organizations | Sales | Finance | Settings)
├──────────────────────────────────────────┤
│ Toolbar (Quick actions, Search)          │
├─────────────┬──────────────────────────┬──┤
│   Sidebar   │  Main Content Area       │  │
│  (Filters,  │                          │  │
│   Quick     │  • List views            │  │
│   Access)   │  • Detail forms          │  │
│             │  • Dashboard             │  │
└─────────────┴──────────────────────────┴──┘
```

### Page Layouts

#### 1. Organizations List
- Toolbar with: New Organization, Search, Filters, Bulk Actions
- Table view: Name, Type, City, Contact Count, Recent Activity
- Quick actions: Edit, View Details, Delete

#### 2. Organization Detail
- Tabs: Details | Branches | Contacts | Addresses | Opportunities | History
- Master/Detail panel for branches
- Address management section
- Related entities summary

#### 3. Contacts List
- Toolbar with: New Contact, Search, Filters
- Table view: Name, Title, Organization, Email, Phone
- Filter by organization or role
- Quick actions

#### 4. Contact Detail
- Tabs: Details | Addresses | Opportunities | Activity
- Role and office assignment section
- Associated addresses
- Related opportunities

#### 5. Products List
- Toolbar with: New Product, New Product Type, Search, Filters
- Tree view of product types
- Product table with custom fields from type
- Pricing and stock information

#### 6. Opportunity List
- Kanban view (by stage) or List view
- Column headers: Stage, Organization, Value, Probability, Expected Close
- Quick actions to move stages

#### 7. Quote List
- Table view: Quote Number, Organization, Amount, Status, Expiry Date
- Status indicators and filters
- Quick actions: View, Edit, Send, Convert to Invoice

#### 8. Quote Detail
- Tabs: Details | Line Items | Addresses | History | Related Documents
- Customer and opportunity selection
- Line item editor with product lookup
- Tax and discount calculations
- Address selector
- Document timeline

#### 9. Invoice List
- Table view: Invoice Number, Organization, Amount, Status, Due Date
- Payment tracking indicators
- Quick actions: View, Record Payment, Send

#### 10. Invoice Detail
- Tabs: Details | Line Items | Addresses | History | Payments | Related Documents
- Customer information
- Line item display
- Address information
- Payment history
- Related quote (if from quote)

#### 11. Audit Log Viewer
- Table view: Entity, Action, User, Timestamp, Changes
- Filter by entity type, action, user, date range
- Detail view shows old/new values
- Export functionality

### Form Components

#### Organization Form
- Fields: Name, Type, Parent Organization (if branch), VAT Number, Trade Currency
- Section: Contact Information (Website, Email, Phone)
- Address Management Section (Add/Edit/Delete addresses)

#### Contact Form
- Fields: First Name, Last Name, Email, Phone, Mobile
- Organization Selector
- Office Assignment (Head Office or Branch)
- Role Selector
- Title, Department, Bio
- Address Association

#### Address Form
- Entity Selection (Organization or Contact)
- Address Type Selection (Office, Delivery, Invoice)
- Address Lines (1-4)
- County, Postal Code, Country
- Contact Information (Email, Phones, Fax)
- Default flags (with validation for single default per type)

#### Product Form
- Fields: Name, SKU, Description
- Product Type Selection
- Base pricing (Unit Price, Cost Price, Currency)
- Unit of Measure
- Is Service toggle
- Stock Information
- Custom fields (based on product type)

#### Quote Form
- Organization and Contact Selection
- Opportunity Link (optional)
- Quote Date and Expiry Date
- Line Items editor (inline add/edit/delete)
- Delivery and Invoice Address Selection
- Tax and Discount calculations
- Status display

#### Invoice Form
- Organization and Contact Selection
- Quote Link (optional)
- Invoice Date and Due Date
- Line Items display/editor
- Addresses
- Payment tracking section
- Status workflow buttons

### Dialog/Modal Components

#### Conflict Resolution Dialog
When updating a document with potential conflicts:
```
Title: "Document has been modified"

Body:
- Show which fields have changed in the linked document
- Display old value (in linked doc) and new value
- Options:
  1. "Use current data" (override)
  2. "Use updated data" (from linked doc)
  3. "Merge manually" (show both and let user edit)

Buttons: Apply | Cancel
```

#### Document Link Dialog
When creating quotes from opportunities or invoices from quotes:
```
Title: "Create from existing document"

Show:
- Source document details (summary)
- Data that will be copied
- Preview of new document

Buttons: Create | Cancel
```

#### Batch Action Confirmation
```
Title: "Confirm bulk action"

Show:
- Number of records affected
- Action description
- Records to be affected (first 10 with more indicator)

Buttons: Confirm | Cancel
```

### Search & Filters

#### Global Search
- Quick search across all entities
- Filters by entity type
- Recent searches
- Search history

#### List View Filters
- Entity-specific filters
- Status filters
- Date range filters
- Numeric range filters (amounts, quantities)
- Boolean toggles (is deleted, is service, etc.)
- Saved filter sets

---

## Implementation Phases

### Phase 5.1: Foundation & Database Setup
**Duration**: Week 1-2

**Tasks**:
1. Set up Tauri project with SQLite
2. Install vector extensions and dependencies
3. Create all database tables and indexes
4. Set up database migrations system
5. Create database helper functions (CRUD operations)
6. Implement document revision system
7. Implement audit logging system

**Deliverables**:
- SQLite database with all tables
- Migration scripts
- Database initialization
- Helper functions for all CRUD operations

---

### Phase 5.2: Backend API Layer
**Duration**: Week 3-4

**Tasks**:
1. Set up Tauri HTTP server endpoints
2. Implement Organization API
3. Implement Contact API
4. Implement Address API
5. Add request validation
6. Add error handling
7. Add authentication/authorization layer
8. Implement document revision endpoints
9. Implement audit log endpoints

**Deliverables**:
- Fully functional REST API
- Request/response validation
- Error handling middleware
- API documentation

---

### Phase 5.3: Products & Services Module
**Duration**: Week 5

**Tasks**:
1. Implement Products & Services API
2. Implement Product Types API
3. Implement custom fields system
4. Implement Product search endpoints
5. Add inventory tracking

**Deliverables**:
- Complete Products API
- Custom field system
- Product type management

---

### Phase 5.4: Opportunities & Quotes Module
**Duration**: Week 6

**Tasks**:
1. Implement Opportunities API
2. Implement Opportunity Stages
3. Implement Quotes API
4. Implement Quote-to-Invoice conversion
5. Implement document linking system
6. Add conflict detection

**Deliverables**:
- Complete Opportunities API
- Quote management API
- Document linking system

---

### Phase 5.5: Invoices & Payments Module
**Duration**: Week 7

**Tasks**:
1. Implement Invoices API
2. Implement Payment tracking
3. Implement Invoice status workflow
4. Add payment date calculations
5. Implement overdue tracking

**Deliverables**:
- Complete Invoices API
- Payment tracking system
- Invoice workflow

---

### Phase 5.6: Frontend UI Implementation
**Duration**: Week 8-10

**Tasks**:
1. Build Organization pages (list, detail, form)
2. Build Contact pages
3. Build Address management UI
4. Build Products & Services pages
5. Build Opportunities Kanban/List views
6. Build Quote pages and forms
7. Build Invoice pages and forms
8. Build Audit Log viewer
9. Implement conflict resolution UI
10. Implement search and filters

**Deliverables**:
- Full CRM user interface
- All forms and workflows
- Navigation and routing

---

### Phase 5.7: Integration & Testing
**Duration**: Week 11-12

**Tasks**:
1. End-to-end testing
2. Performance optimization
3. Error handling refinement
4. Documentation completion
5. User acceptance testing
6. Bug fixes and polish

**Deliverables**:
- Fully tested and documented CRM system
- User guide
- API documentation
- Deployment guide

---

## Data Validation Rules

### Organization
- Name: Required, max 255 characters
- VAT Number: Format validation if provided
- Trade Currency: Must be valid ISO 4217 code
- Parent Organization: Can only be set if type is BRANCH

### Contact
- First Name, Last Name: Required, max 100 characters each
- Email: Valid email format if provided
- Organization: Required
- Role: Required
- Office Assignment: Must match organization or its branches

### Address
- Line 1: Required, max 200 characters
- Postal Code: Format validation based on country
- Country: Required, valid ISO 3166-1 alpha-2 code
- Only one default invoice address per entity/office
- Only one default delivery address per entity/office

### Product
- Name: Required, max 255 characters
- SKU: Unique if provided
- Unit Price: Must be positive if provided
- Cost Price: Must be less than Unit Price if both provided
- Stock Quantity: Non-negative integer
- Product Type: Required

### Quote
- Quote Number: Auto-generated, unique
- Organization: Required
- Quote Date: Must be <= today
- Expiry Date: Must be > Quote Date
- Line Items: At least one item required
- Total: Auto-calculated, read-only

### Invoice
- Invoice Number: Auto-generated, unique
- Organization: Required
- Invoice Date: Must be <= today
- Due Date: Must be > Invoice Date
- Line Items: At least one item required
- Amount Paid: Cannot exceed Total
- Status: Must follow valid transitions

---

## Security Considerations

1. **Authentication**: User login system (to be detailed in implementation)
2. **Authorization**: Role-based access control (Admin, Manager, User)
3. **Data Encryption**: Sensitive data encrypted at rest
4. **API Security**: API key authentication for endpoints
5. **Audit Trail**: All changes logged and tracked
6. **Input Validation**: All inputs validated and sanitized
7. **CSRF Protection**: CSRF tokens for POST/PUT/DELETE requests

---

## Performance Targets

- List view load time: < 1 second
- Detail page load time: < 500ms
- Search response time: < 500ms
- API response time: < 200ms (p95)
- Database query time: < 100ms (p95)
- Concurrent users: 100+

---

## Appendices

### A. Glossary
- **Organization**: A company or entity in the CRM system
- **Head Office**: Primary organization location
- **Branch**: Secondary organization location linked to Head Office
- **Contact**: A person associated with an organization
- **Opportunity**: A potential sales deal
- **Quote**: A price estimate for an opportunity
- **Invoice**: A billing document for delivered products/services
- **Document Revision**: A snapshot of a document at a point in time
- **Polymorphic Relation**: A relationship that can reference multiple different entity types
- **Audit Log**: A record of all changes made to an entity

### B. Related Documents
- API Documentation (to be generated)
- UI Mockups (to be created)
- Database Schema Diagram (to be generated)
- User Manual (to be created)

---

**End of Phase 5 CRM Specifications**

