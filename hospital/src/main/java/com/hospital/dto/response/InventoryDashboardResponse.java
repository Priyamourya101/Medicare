package com.hospital.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDashboardResponse {
    private long totalItems;
    private long outOfStockItems;
    private long lowStockItems;
    private long expiringItems;
    private List<InventoryResponse> lowStockList;
    private List<InventoryResponse> expiringList;
} 