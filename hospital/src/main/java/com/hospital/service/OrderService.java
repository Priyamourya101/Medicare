package com.hospital.service;

import java.util.List;

import com.hospital.dto.request.OrderRequest;
import com.hospital.dto.response.OrderResponse;
import com.hospital.entity.Order;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);
    List<OrderResponse> getOrdersByPatientId(Long patientId);
    OrderResponse updateOrder(Long orderId, OrderRequest request);
    void deleteOrder(Long orderId);
    List<OrderResponse> getAllOrdersAsResponse();
//	List<Order> getOrdersByPatientIdRaw(Long patientId);
} 