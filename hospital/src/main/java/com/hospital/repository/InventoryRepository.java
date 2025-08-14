package com.hospital.repository;

import com.hospital.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByCategory(String category);
    
    List<Inventory> findBySupplier(String supplier);
    
    List<Inventory> findByQuantityLessThanEqual(Integer quantity);
    
    List<Inventory> findByExpiryDateBefore(LocalDate date);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minimumStock")
    List<Inventory> findLowStockItems();
    
    @Query("SELECT i FROM Inventory i WHERE i.expiryDate <= :date")
    List<Inventory> findExpiringItems(@Param("date") LocalDate date);
    
    @Query("SELECT i FROM Inventory i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Inventory> searchByNameOrDescription(@Param("searchTerm") String searchTerm);
    
    boolean existsByNameAndCategory(String name, String category);
} 