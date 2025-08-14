package com.hospital.dto.request;

import lombok.Data;

@Data
public class OrderRequest {
    private Long patientId;
    private Long inventoryId;
    private Integer quantity;
    private String status; // Optional, for updating order status

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 