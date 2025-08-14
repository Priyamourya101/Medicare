package com.hospital.service;

import com.hospital.dto.request.InventoryRequest;
import com.hospital.dto.response.InventoryResponse;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {

    InventoryResponse addInventoryItem(InventoryRequest request);
    
    InventoryResponse updateInventoryItem(Long id, InventoryRequest request);
    
    InventoryResponse getInventoryItemById(Long id);
    
    List<InventoryResponse> getAllInventoryItems();
    
    List<InventoryResponse> getInventoryByCategory(String category);
    
    List<InventoryResponse> getLowStockItems();
    
    List<InventoryResponse> getExpiringItems(LocalDate date);
    
    List<InventoryResponse> searchInventory(String searchTerm);
    
    void deleteInventoryItem(Long id);
    
    InventoryResponse updateStockQuantity(Long id, Integer newQuantity);
    
    List<InventoryResponse> getExpiringItemsWithinDays(int days);
} 