# Hospital Inventory Management API Documentation

## Overview

The Inventory Management System provides comprehensive backend functionality for managing hospital inventory items including medicines, equipment, and supplies. This system is accessible only to administrators.

## Base URL

```
/api/admin/inventory
```

## Authentication

All endpoints require admin authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Add New Inventory Item

**POST** `/api/admin/inventory`

**Request Body:**

```json
{
  "name": "Paracetamol 500mg",
  "description": "Pain relief medication",
  "quantity": 1000,
  "unit": "tablets",
  "category": "Medicine",
  "supplier": "PharmaCorp",
  "expiryDate": "2025-12-31",
  "price": 0.5,
  "minimumStock": 100
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "description": "Pain relief medication",
  "quantity": 1000,
  "unit": "tablets",
  "category": "Medicine",
  "supplier": "PharmaCorp",
  "expiryDate": "2025-12-31",
  "price": 0.5,
  "minimumStock": 100,
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-15",
  "stockStatus": "In Stock"
}
```

### 2. Get All Inventory Items

**GET** `/api/admin/inventory`

**Response:** Array of inventory items

### 3. Get Inventory Item by ID

**GET** `/api/admin/inventory/{id}`

**Response:** Single inventory item

### 4. Update Inventory Item

**PUT** `/api/admin/inventory/{id}`

**Request Body:** Same as Add New Inventory Item

### 5. Delete Inventory Item

**DELETE** `/api/admin/inventory/{id}`

### 6. Update Stock Quantity

**PATCH** `/api/admin/inventory/{id}/quantity?quantity=500`

### 7. Get Items by Category

**GET** `/api/admin/inventory/category/{category}`

**Example:** `/api/admin/inventory/category/Medicine`

### 8. Get Low Stock Items

**GET** `/api/admin/inventory/low-stock`

Returns items where quantity ≤ minimum stock

### 9. Get Expiring Items

**GET** `/api/admin/inventory/expiring?date=2025-06-30`

Returns items expiring before the specified date

### 10. Get Items Expiring Within Days

**GET** `/api/admin/inventory/expiring-within-days/{days}`

**Example:** `/api/admin/inventory/expiring-within-days/30`

### 11. Search Inventory

**GET** `/api/admin/inventory/search?searchTerm=paracetamol`

Searches by name or description

### 12. Inventory Dashboard

**GET** `/api/admin/inventory/dashboard`

**Response:**

```json
{
  "totalItems": 10,
  "outOfStockItems": 2,
  "lowStockItems": 3,
  "expiringItems": 1,
  "lowStockList": [...],
  "expiringList": [...]
}
```

## Categories

- **Medicine**: Pharmaceuticals and drugs
- **Equipment**: Medical devices and instruments
- **Supplies**: Consumable medical supplies

## Stock Status

- **In Stock**: Quantity > minimum stock
- **Low Stock**: Quantity ≤ minimum stock
- **Out of Stock**: Quantity = 0

## Error Responses

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Sample Usage with curl

### Add new item:

```bash
curl -X POST http://localhost:8080/api/admin/inventory \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aspirin 100mg",
    "description": "Pain relief and blood thinner",
    "quantity": 500,
    "unit": "tablets",
    "category": "Medicine",
    "supplier": "PharmaCorp",
    "expiryDate": "2025-12-31",
    "price": 0.30,
    "minimumStock": 50
  }'
```

### Get all items:

```bash
curl -X GET http://localhost:8080/api/admin/inventory \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get dashboard:

```bash
curl -X GET http://localhost:8080/api/admin/inventory/dashboard \
  -H "Authorization: Bearer <your-jwt-token>"
```
