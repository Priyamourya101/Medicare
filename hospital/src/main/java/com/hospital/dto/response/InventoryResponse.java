package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long id;
    private String name;
    private String description;
    private Integer quantity;
    private String unit;
    private String category;
    private String supplier;
    private LocalDate expiryDate;
    private BigDecimal price;
    private Integer minimumStock;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String stockStatus; // "In Stock", "Low Stock", "Out of Stock"
} 