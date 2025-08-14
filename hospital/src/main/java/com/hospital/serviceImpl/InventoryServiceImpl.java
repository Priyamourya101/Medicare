package com.hospital.serviceImpl;

import com.hospital.dto.request.InventoryRequest;
import com.hospital.dto.response.InventoryResponse;
import com.hospital.entity.Inventory;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.InventoryRepository;
import com.hospital.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public InventoryResponse addInventoryItem(InventoryRequest request) {
        // Check if item with same name and category already exists
        if (inventoryRepository.existsByNameAndCategory(request.getName(), request.getCategory())) {
            throw new IllegalArgumentException("Item with this name and category already exists");
        }

        Inventory inventory = Inventory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .category(request.getCategory())
                .supplier(request.getSupplier())
                .expiryDate(request.getExpiryDate())
                .price(request.getPrice())
                .minimumStock(request.getMinimumStock())
                .build();

        Inventory savedInventory = inventoryRepository.save(inventory);
        return convertToResponse(savedInventory);
    }

    @Override
    public InventoryResponse updateInventoryItem(Long id, InventoryRequest request) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        inventory.setName(request.getName());
        inventory.setDescription(request.getDescription());
        inventory.setQuantity(request.getQuantity());
        inventory.setUnit(request.getUnit());
        inventory.setCategory(request.getCategory());
        inventory.setSupplier(request.getSupplier());
        inventory.setExpiryDate(request.getExpiryDate());
        inventory.setPrice(request.getPrice());
        inventory.setMinimumStock(request.getMinimumStock());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    @Override
    public InventoryResponse getInventoryItemById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        return convertToResponse(inventory);
    }

    @Override
    public List<InventoryResponse> getAllInventoryItems() {
        List<Inventory> inventories = inventoryRepository.findAll();
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getInventoryByCategory(String category) {
        List<Inventory> inventories = inventoryRepository.findByCategory(category);
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getLowStockItems() {
        List<Inventory> inventories = inventoryRepository.findLowStockItems();
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getExpiringItems(LocalDate date) {
        List<Inventory> inventories = inventoryRepository.findExpiringItems(date);
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> searchInventory(String searchTerm) {
        List<Inventory> inventories = inventoryRepository.searchByNameOrDescription(searchTerm);
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteInventoryItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found with id: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    @Override
    public InventoryResponse updateStockQuantity(Long id, Integer newQuantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        if (newQuantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        inventory.setQuantity(newQuantity);
        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    @Override
    public List<InventoryResponse> getExpiringItemsWithinDays(int days) {
        LocalDate expiryDate = LocalDate.now().plusDays(days);
        List<Inventory> inventories = inventoryRepository.findExpiringItems(expiryDate);
        return inventories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private InventoryResponse convertToResponse(Inventory inventory) {
        String stockStatus = determineStockStatus(inventory);
        
        return InventoryResponse.builder()
                .id(inventory.getId())
                .name(inventory.getName())
                .description(inventory.getDescription())
                .quantity(inventory.getQuantity())
                .unit(inventory.getUnit())
                .category(inventory.getCategory())
                .supplier(inventory.getSupplier())
                .expiryDate(inventory.getExpiryDate())
                .price(inventory.getPrice())
                .minimumStock(inventory.getMinimumStock())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .stockStatus(stockStatus)
                .build();
    }

    private String determineStockStatus(Inventory inventory) {
        if (inventory.getQuantity() == 0) {
            return "Out of Stock";
        } else if (inventory.getMinimumStock() != null && inventory.getQuantity() <= inventory.getMinimumStock()) {
            return "Low Stock";
        } else {
            return "In Stock";
        }
    }
} 