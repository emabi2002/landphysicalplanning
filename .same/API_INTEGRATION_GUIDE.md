# API Integration Guide - Physical Planning System

## Overview

This guide documents the REST API endpoints for integrating the Physical Planning System with the Legal Case Management System and other external systems.

**Base URL**: `https://your-domain.com/api`

**Authentication**: Currently using Supabase Auth (RLS policies apply)

---

## 📋 Table of Contents

1. [Legal Requests API](#legal-requests-api)
2. [Parcel Legal Information API](#parcel-legal-information-api)
3. [Spatial Evidence API](#spatial-evidence-api)
4. [Notifications API](#notifications-api)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Webhook Integration](#webhook-integration)

---

## 🔐 Authentication

All API requests require authentication. Use Supabase Auth tokens in headers:

```http
Authorization: Bearer YOUR_SUPABASE_TOKEN
apikey: YOUR_SUPABASE_ANON_KEY
```

### Getting a Token

```javascript
// JavaScript example
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'legal@lands.gov.pg',
  password: 'your-password'
});

const token = data.session.access_token;
```

---

## 1. Legal Requests API

### Create Legal Request

**Endpoint**: `POST /api/legal-requests`

**Description**: Submit a new request from Legal Division to Physical Planning

**Request Body**:
```json
{
  "legal_case_number": "LC-2024-001",
  "legal_officer_name": "John Doe",
  "legal_officer_email": "john.doe@legal.gov.pg",
  "legal_officer_phone": "+675 123 4567",
  "legal_division_ref": "LD-REF-123",
  "request_type": "zoning_confirmation",
  "subject": "Zoning confirmation for Parcel PM-2024-001",
  "description": "Legal case requires confirmation of current zoning designation for the parcel in question.",
  "urgency": "high",
  "parcel_id": "uuid-of-parcel",
  "sla_days": 5
}
```

**Request Types**:
- `zoning_confirmation`
- `zoning_change_verification`
- `development_approval_verification`
- `compliance_investigation_request`
- `unauthorized_development_report`
- `parcel_history_request`
- `inspection_findings_request`
- `spatial_evidence_request`
- `boundary_dispute_assessment`
- `planning_opinion`
- `other`

**Urgency Levels**:
- `low`
- `normal`
- `high`
- `urgent`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "request_number": "LR-1234567890",
    "status": "submitted",
    "due_date": "2024-03-20T00:00:00Z",
    ...
  },
  "message": "Legal request created successfully"
}
```

---

### Get All Legal Requests

**Endpoint**: `GET /api/legal-requests`

**Query Parameters**:
- `status` - Filter by status
- `urgency` - Filter by urgency
- `legal_case_number` - Filter by legal case
- `assigned_to` - Filter by assigned officer UUID

**Example**:
```http
GET /api/legal-requests?status=submitted&urgency=high
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### Get Single Legal Request

**Endpoint**: `GET /api/legal-requests/[id]`

**Description**: Get complete details including documents and activity history

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "request_number": "LR-1234567890",
    "status": "in_progress",
    "land_parcels": {
      "parcel_number": "PM-2024-001",
      "address": "123 Waigani Drive",
      "geojson": {...}
    },
    "assigned_user": {
      "full_name": "Planning Officer",
      "email": "officer@planning.gov.pg"
    },
    "documents": [...],
    "activity": [...]
  }
}
```

---

### Update Legal Request

**Endpoint**: `PATCH /api/legal-requests/[id]`

**Description**: Update request status or details

**Request Body**:
```json
{
  "status": "completed",
  "response_summary": "Zoning confirmed as R1 - Low Density Residential",
  "findings": "Detailed findings...",
  "recommendations": "Recommendations for legal team...",
  "status_comment": "Response completed and ready for Legal Division"
}
```

**Status Workflow**:
1. `submitted`
2. `received`
3. `assigned`
4. `in_progress`
5. `under_review`
6. `completed`
7. `returned_to_legal`
8. `closed`

---

### Withdraw Legal Request

**Endpoint**: `DELETE /api/legal-requests/[id]`

**Description**: Soft delete - sets status to 'withdrawn'

**Response**:
```json
{
  "success": true,
  "message": "Legal request withdrawn successfully"
}
```

---

## 2. Parcel Legal Information API

### Get All Legal Info for Parcel

**Endpoint**: `GET /api/parcels/[id]/legal-info`

**Description**: Get comprehensive legal-relevant information about a parcel

**Response**:
```json
{
  "success": true,
  "data": {
    "parcel": {
      "id": "uuid",
      "parcel_number": "PM-2024-001",
      "address": "123 Waigani Drive",
      "area_sqm": 1500,
      "owner_name": "John Smith",
      "geojson": {...}
    },
    "zoning": {
      "code": "R1",
      "name": "Residential Zone 1",
      "regulations": {...}
    },
    "applications": [
      {
        "application_number": "APP-2024-001",
        "status": "approved",
        "project_title": "Two Story Residence"
      }
    ],
    "legal_requests": [...],
    "compliance_records": [...],
    "inspections": [...],
    "spatial_evidence": [...],
    "summary": {
      "total_applications": 3,
      "total_legal_requests": 2,
      "pending_legal_requests": 1,
      "compliance_violations": 0,
      "inspections_count": 5,
      "evidence_count": 8
    }
  }
}
```

---

## 3. Spatial Evidence API

### Get Spatial Evidence

**Endpoint**: `GET /api/spatial-evidence`

**Query Parameters**:
- `request_id` - Filter by legal request
- `parcel_id` - Filter by parcel
- `inspection_id` - Filter by inspection
- `evidence_type` - Filter by type

**Example**:
```http
GET /api/spatial-evidence?request_id=uuid&evidence_type=site_photo
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "evidence_type": "site_photo",
      "latitude": -9.4438,
      "longitude": 147.1803,
      "accuracy_meters": 5.2,
      "photo_url": "https://...",
      "description": "Site condition at boundary marker",
      "captured_at": "2024-03-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### Create Spatial Evidence

**Endpoint**: `POST /api/spatial-evidence`

**Request Body**:
```json
{
  "request_id": "uuid",
  "parcel_id": "uuid",
  "evidence_type": "site_photo",
  "description": "Boundary encroachment observed",
  "latitude": -9.4438,
  "longitude": 147.1803,
  "accuracy_meters": 5.0,
  "photo_url": "https://storage.url/photo.jpg"
}
```

**Evidence Types**:
- `site_photo`
- `gps_coordinate`
- `boundary_marker`
- `encroachment`
- `unauthorized_structure`
- `compliance_violation`
- `site_condition`
- `other`

---

## 4. Notifications API

### Get User Notifications

**Endpoint**: `GET /api/notifications`

**Query Parameters**:
- `is_read` - Filter by read status (true/false)
- `type` - Filter by notification type
- `severity` - Filter by severity

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "New Legal Request Assigned",
      "message": "Legal request LR-123 has been assigned to you",
      "type": "legal_request",
      "severity": "urgent",
      "is_read": false,
      "action_url": "/dashboard/legal-requests/uuid",
      "created_at": "2024-03-15T14:30:00Z"
    }
  ]
}
```

---

### Mark Notification as Read

**Endpoint**: `PATCH /api/notifications/[id]`

**Request Body**:
```json
{
  "is_read": true
}
```

---

## 5. Error Handling

All API errors follow this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 6. Webhook Integration

### Legal Request Status Changes

Configure webhooks to receive real-time updates when legal request status changes.

**Webhook URL**: Set in your system

**Payload**:
```json
{
  "event": "legal_request.status_changed",
  "timestamp": "2024-03-15T14:30:00Z",
  "data": {
    "request_id": "uuid",
    "request_number": "LR-123",
    "old_status": "in_progress",
    "new_status": "completed",
    "response_summary": "Response text...",
    "legal_case_number": "LC-2024-001"
  }
}
```

---

## 7. Code Examples

### JavaScript/TypeScript

```typescript
// Create legal request
const createLegalRequest = async () => {
  const response = await fetch('https://your-domain.com/api/legal-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_ANON_KEY
    },
    body: JSON.stringify({
      legal_case_number: 'LC-2024-001',
      legal_officer_name: 'John Doe',
      request_type: 'zoning_confirmation',
      subject: 'Zoning confirmation needed',
      urgency: 'high',
      sla_days: 5
    })
  });

  const data = await response.json();
  return data;
};

// Get parcel legal info
const getParcelLegalInfo = async (parcelId: string) => {
  const response = await fetch(
    `https://your-domain.com/api/parcels/${parcelId}/legal-info`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY
      }
    }
  );

  const data = await response.json();
  return data;
};
```

### Python

```python
import requests

# Create legal request
def create_legal_request(token, case_number):
    url = "https://your-domain.com/api/legal-requests"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }

    data = {
        "legal_case_number": case_number,
        "legal_officer_name": "John Doe",
        "request_type": "zoning_confirmation",
        "subject": "Zoning confirmation needed",
        "urgency": "high",
        "sla_days": 5
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Get request status
def get_request_status(token, request_id):
    url = f"https://your-domain.com/api/legal-requests/{request_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

### cURL

```bash
# Create legal request
curl -X POST https://your-domain.com/api/legal-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "legal_case_number": "LC-2024-001",
    "legal_officer_name": "John Doe",
    "request_type": "zoning_confirmation",
    "subject": "Zoning confirmation needed",
    "urgency": "high",
    "sla_days": 5
  }'

# Get parcel legal info
curl https://your-domain.com/api/parcels/PARCEL_UUID/legal-info \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

---

## 8. Rate Limiting

Current rate limits:
- **Read operations**: 100 requests/minute
- **Write operations**: 30 requests/minute

Exceeded limits return:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

---

## 9. Testing

### Test Environment

Base URL: `https://test.your-domain.com/api`

### Sample Test Data

Request a test account with sample data:
- 5 test parcels
- 10 test legal requests
- Sample zoning data
- Spatial evidence examples

---

## 10. Support

**API Documentation**: https://docs.your-domain.com/api
**Support Email**: api-support@lands.gov.pg
**Status Page**: https://status.your-domain.com

---

## Quick Start Checklist

- [ ] Obtain API credentials (Supabase keys)
- [ ] Test authentication
- [ ] Create test legal request
- [ ] Retrieve legal request status
- [ ] Get parcel legal information
- [ ] Set up webhooks (optional)
- [ ] Implement error handling
- [ ] Move to production

---

**Last Updated**: Version 12
**API Version**: 1.0
