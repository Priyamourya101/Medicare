package com.hospital.repository;

import java.util.List;

import com.hospital.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query("SELECT o FROM Order o " +
			"JOIN FETCH o.patient " +
			"JOIN FETCH o.inventoryItem " +
			"WHERE o.patient.patientId = :patientId")
	List<Order> findByPatientIdWithDetails(@Param("patientId") Long patientId);

	@Query("SELECT o FROM Order o " +
			"JOIN FETCH o.patient " +
			"JOIN FETCH o.inventoryItem " +
			"ORDER BY o.orderDate DESC")
	List<Order> findAllWithDetails();

}
