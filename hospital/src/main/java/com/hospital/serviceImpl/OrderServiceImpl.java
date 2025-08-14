package com.hospital.serviceImpl;

import com.hospital.dto.request.OrderRequest;
import com.hospital.dto.response.OrderResponse;
import com.hospital.entity.Inventory;
import com.hospital.entity.Order;
import com.hospital.entity.Patient;
import com.hospital.repository.InventoryRepository;
import com.hospital.repository.OrderRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    /**
     * Place a new order
     */
    @Override
    public OrderResponse placeOrder(OrderRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID"));

        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid inventory item ID"));

        Order order = new Order();
        order.setPatient(patient);
        order.setInventoryItem(inventory);
        order.setQuantity(request.getQuantity());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);
        return toOrderResponse(savedOrder);
    }

    /**
     * Get orders by patient ID
     */
    @Override
    public List<OrderResponse> getOrdersByPatientId(Long patientId) {
        List<Order> orders = orderRepository.findByPatientIdWithDetails(patientId);
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update an order
     */
    @Transactional
    @Override
    public OrderResponse updateOrder(Long orderId, OrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (request.getQuantity() != null) {
            order.setQuantity(request.getQuantity());
        }
        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }

        Order savedOrder = orderRepository.save(order);
        return toOrderResponse(savedOrder);
    }

    /**
     * Delete an order
     */
    @Override
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }

    /**
     * Get all orders as response DTOs
     */
    @Override
    public List<OrderResponse> getAllOrdersAsResponse() {
        List<Order> orders = orderRepository.findAllWithDetails();
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Order entity to OrderResponse DTO
     */
    private OrderResponse toOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setPatientId(order.getPatient() != null ? order.getPatient().getPatientId() : null);
        response.setInventoryId(order.getInventoryItem() != null ? order.getInventoryItem().getId() : null);
        response.setQuantity(order.getQuantity());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());

        if (order.getPatient() != null) {
            response.setPatientName(order.getPatient().getFirstName() + " " + order.getPatient().getLastName());
            response.setPatientEmail(order.getPatient().getEmail());
            response.setPatientPhone(order.getPatient().getPhoneNumber());
        }
        if (order.getInventoryItem() != null) {
            response.setInventoryName(order.getInventoryItem().getName());
        }

        return response;
    }
}
