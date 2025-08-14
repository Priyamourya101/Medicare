package com.hospital.service;

import com.hospital.dto.request.InventoryRequest;
import com.hospital.dto.response.InventoryResponse;
import com.hospital.serviceImpl.InventoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class InventoryServiceTest {

    @Autowired
    private InventoryService inventoryService;

    @Test
    public void testAddInventoryItem() {
        InventoryRequest request = InventoryRequest.builder()
                .name("Test Medicine")
                .description("Test description")
                .quantity(100)
                .unit("tablets")
                .category("Medicine")
                .supplier("Test Supplier")
                .expiryDate(LocalDate.now().plusMonths(6))
                .price(new BigDecimal("10.50"))
                .minimumStock(10)
                .build();

        InventoryResponse response = inventoryService.addInventoryItem(request);

        assertNotNull(response);
        assertEquals("Test Medicine", response.getName());
        assertEquals(100, response.getQuantity());
        assertEquals("In Stock", response.getStockStatus());
    }

    @Test
    public void testGetAllInventoryItems() {
        List<InventoryResponse> items = inventoryService.getAllInventoryItems();
        assertNotNull(items);
        assertFalse(items.isEmpty());
    }

    @Test
    public void testGetLowStockItems() {
        List<InventoryResponse> lowStockItems = inventoryService.getLowStockItems();
        assertNotNull(lowStockItems);
        // All items in low stock should have "Low Stock" status
        lowStockItems.forEach(item -> 
            assertTrue("Low Stock".equals(item.getStockStatus()) || "Out of Stock".equals(item.getStockStatus()))
        );
    }

    @Test
    public void testSearchInventory() {
        List<InventoryResponse> searchResults = inventoryService.searchInventory("Paracetamol");
        assertNotNull(searchResults);
        // Should find items containing "Paracetamol"
        assertFalse(searchResults.isEmpty());
    }
} 