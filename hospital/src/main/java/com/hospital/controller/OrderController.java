package com.hospital.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.request.OrderRequest;
import com.hospital.dto.response.OrderResponse;
import com.hospital.entity.Order;
import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.service.OrderService;
import com.hospital.security.SecurityUtil;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        // Get the authenticated user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String patientEmail = userDetails.getUsername();

        // Find the patient by email
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with email: " + patientEmail));

        // Set the patient ID from the authenticated user
        request.setPatientId(patient.getPatientId());

        OrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByPatient(@PathVariable Long patientId) {
//        List<Order> orders = orderService.getOrdersByPatientId(patientId);
//        List<OrderResponse> responses = orders.stream()
//                .map(this::mapToOrderResponse)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(responses);
    	List<OrderResponse> responses = orderService.getOrdersByPatientId(patientId);
    	return ResponseEntity.ok(responses);

    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> responses = orderService.getAllOrdersAsResponse();
        return ResponseEntity.ok(responses);
    }

    // Admin endpoint to get all orders
    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAdminOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (!securityUtil.isAdmin(authentication)) {
            return ResponseEntity.status(403).build();
        }
        
        List<OrderResponse> responses = orderService.getAllOrdersAsResponse();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable Long orderId, @RequestBody OrderRequest request) {
        OrderResponse response = orderService.updateOrder(orderId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
