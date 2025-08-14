package com.hospital.controller;

import com.hospital.dto.response.InventoryResponse;
import com.hospital.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PublicInventoryController {

    private static final Logger logger = LoggerFactory.getLogger(PublicInventoryController.class);

    @Autowired
    private InventoryService inventoryService;

    // Public endpoint for patients to view available medicines
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

    // Alternative endpoint for inventory items
    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryResponse>> getInventory() {
        logger.info("Getting inventory items for patients");
        try {
            List<InventoryResponse> response = inventoryService.getAllInventoryItems();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting inventory items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
} 