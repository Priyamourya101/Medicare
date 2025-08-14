-- Sample Inventory Data
INSERT INTO inventory (name, description, quantity, unit, category, supplier, expiry_date, price, minimum_stock, created_at, updated_at) VALUES
('Paracetamol 500mg', 'Pain relief medication', 1000, 'tablets', 'Medicine', 'PharmaCorp', '2025-12-31', 0.50, 100, CURRENT_DATE, CURRENT_DATE),
('Amoxicillin 250mg', 'Antibiotic medication', 500, 'capsules', 'Medicine', 'MediSupply', '2025-10-15', 1.20, 50, CURRENT_DATE, CURRENT_DATE),
('Surgical Masks', 'Disposable surgical face masks', 2000, 'pieces', 'Supplies', 'SafetyFirst', '2026-06-30', 0.25, 200, CURRENT_DATE, CURRENT_DATE),
('Syringes 5ml', 'Disposable syringes', 1500, 'pieces', 'Equipment', 'MedEquip', '2025-08-20', 0.75, 150, CURRENT_DATE, CURRENT_DATE),
('Bandages', 'Sterile gauze bandages', 800, 'rolls', 'Supplies', 'FirstAid Co', '2025-11-30', 2.50, 80, CURRENT_DATE, CURRENT_DATE),
('Thermometer', 'Digital thermometer', 50, 'pieces', 'Equipment', 'HealthTech', '2027-01-15', 15.00, 10, CURRENT_DATE, CURRENT_DATE),
('Ibuprofen 400mg', 'Anti-inflammatory medication', 750, 'tablets', 'Medicine', 'PharmaCorp', '2025-09-30', 0.80, 75, CURRENT_DATE, CURRENT_DATE),
('Gloves L', 'Latex gloves large size', 3000, 'pairs', 'Supplies', 'SafetyFirst', '2025-12-31', 0.30, 300, CURRENT_DATE, CURRENT_DATE),
('Stethoscope', 'Professional stethoscope', 25, 'pieces', 'Equipment', 'MedEquip', '2028-03-15', 45.00, 5, CURRENT_DATE, CURRENT_DATE),
('Antiseptic Solution', 'Betadine antiseptic', 200, 'bottles', 'Supplies', 'FirstAid Co', '2025-07-31', 8.50, 20, CURRENT_DATE, CURRENT_DATE); 