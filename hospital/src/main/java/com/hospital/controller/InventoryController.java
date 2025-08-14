package com.hospital.controller;

import com.hospital.dto.request.InventoryRequest;
import com.hospital.dto.response.InventoryResponse;
import com.hospital.dto.response.InventoryDashboardResponse;
import com.hospital.service.InventoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

    @Autowired
    private InventoryService inventoryService;

    // Public endpoint for patients to view available medicines
    @GetMapping("/public")
    public ResponseEntity<List<InventoryResponse>> getPublicInventory() {
        logger.info("Getting public inventory items for patients");
        try {
            List<InventoryResponse> response = inventoryService.getAllInventoryItems();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting public inventory items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Alternative public endpoint at /api/products
    @GetMapping("/products")
    public ResponseEntity<List<InventoryResponse>> getProducts() {
        logger.info("Getting products for patients");
        try {
            List<InventoryResponse> response = inventoryService.getAllInventoryItems();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting products: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<InventoryResponse> addInventoryItem(@Valid @RequestBody InventoryRequest request) {
        logger.info("Adding new inventory item: {}", request.getName());
        try {
            InventoryResponse response = inventoryService.addInventoryItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error adding inventory item: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> updateInventoryItem(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request) {
        logger.info("Updating inventory item with id: {}", id);
        try {
            InventoryResponse response = inventoryService.updateInventoryItem(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating inventory item: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryItemById(@PathVariable Long id) {
        logger.info("Getting inventory item with id: {}", id);
        try {
            InventoryResponse response = inventoryService.getInventoryItemById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting inventory item: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventoryItems() {
        logger.info("Getting all inventory items");
        try {
            List<InventoryResponse> response = inventoryService.getAllInventoryItems();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting all inventory items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByCategory(@PathVariable String category) {
        logger.info("Getting inventory items by category: {}", category);
        try {
            List<InventoryResponse> response = inventoryService.getInventoryByCategory(category);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting inventory by category: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockItems() {
        logger.info("Getting low stock items");
        try {
            List<InventoryResponse> response = inventoryService.getLowStockItems();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting low stock items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<InventoryResponse>> getExpiringItems(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        logger.info("Getting expiring items before: {}", date);
        try {
            List<InventoryResponse> response = inventoryService.getExpiringItems(date);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting expiring items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/expiring-within-days/{days}")
    public ResponseEntity<List<InventoryResponse>> getExpiringItemsWithinDays(@PathVariable int days) {
        logger.info("Getting items expiring within {} days", days);
        try {
            List<InventoryResponse> response = inventoryService.getExpiringItemsWithinDays(days);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting expiring items within days: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<InventoryResponse>> searchInventory(@RequestParam String searchTerm) {
        logger.info("Searching inventory with term: {}", searchTerm);
        try {
            List<InventoryResponse> response = inventoryService.searchInventory(searchTerm);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching inventory: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable Long id) {
        logger.info("Deleting inventory item with id: {}", id);
        try {
            inventoryService.deleteInventoryItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting inventory item: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryResponse> updateStockQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        logger.info("Updating stock quantity for item {} to {}", id, quantity);
        try {
            InventoryResponse response = inventoryService.updateStockQuantity(id, quantity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating stock quantity: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<InventoryDashboardResponse> getInventoryDashboard() {
        logger.info("Getting inventory dashboard data");
        try {
            List<InventoryResponse> lowStockItems = inventoryService.getLowStockItems();
            List<InventoryResponse> expiringItems = inventoryService.getExpiringItemsWithinDays(30);
            List<InventoryResponse> allItems = inventoryService.getAllInventoryItems();

            long totalItems = allItems.size();
            long outOfStockItems = allItems.stream()
                    .filter(item -> "Out of Stock".equals(item.getStockStatus()))
                    .count();
            long lowStockCount = lowStockItems.size();
            long expiringCount = expiringItems.size();

            InventoryDashboardResponse dashboardResponse = InventoryDashboardResponse.builder()
                    .totalItems(totalItems)
                    .outOfStockItems(outOfStockItems)
                    .lowStockItems(lowStockCount)
                    .expiringItems(expiringCount)
                    .lowStockList(lowStockItems)
                    .expiringList(expiringItems)
                    .build();

            return ResponseEntity.ok(dashboardResponse);
        } catch (Exception e) {
            logger.error("Error getting inventory dashboard: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
} 