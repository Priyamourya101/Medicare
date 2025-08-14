import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { Table, Button, Form, Modal, Alert, Container } from 'react-bootstrap';

// Custom styles for a professional, blue-themed inventory page
const pageStyles = `
  /* Page Container */
  .inventory-container {
    background: linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%);
    min-height: 100vh;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Page Header */
  .page-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
    position: relative;
    overflow: hidden;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    font-size: 1rem;
    font-weight: 400;
    opacity: 0.85;
    margin: 0;
  }

  /* Dashboard Cards */
  .dashboard-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .dashboard-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #3b82f6;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .dashboard-card.total {
    border-left-color: #10b981;
  }

  .dashboard-card.out-of-stock {
    border-left-color: #ef4444;
  }

  .dashboard-card.low-stock {
    border-left-color: #f59e0b;
  }

  .dashboard-card.expiring {
    border-left-color: #f97316;
  }

  .card-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .card-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
  }

  .card-icon {
    font-size: 2.25rem;
    opacity: 0.15;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #3b82f6;
  }

  /* Search and Actions Section */
  .actions-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }

  .search-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1;
    min-width: 320px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background: #f9fafb;
  }

  .search-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }

  .btn-search {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 0.95rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  }

  .btn-add {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 0.95rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  /* Table Styling */
  .table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .table {
    margin-bottom: 0;
  }

  .table thead th {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    padding: 0.9rem 1rem;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  .table tbody td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
    font-size: 0.9rem;
    color: #374151;
  }

  .table tbody tr:hover {
    background-color: #f9fafb;
  }

  .table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Status Badges */
  .status-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-in-stock {
    background: #d1fae5;
    color: #065f46;
  }

  .status-low-stock {
    background: #fef3c7;
    color: #92400e;
  }

  .status-out-of-stock {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Action Buttons */
  .btn-edit {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    font-size: 0.8rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  }

  .btn-delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    font-size: 0.8rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-delete:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  }

  /* Alert Styling */
  .alert {
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .alert-danger {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
  }

  /* Modal Styles */
  .modal-content {
    border: none;
    border-radius: 12px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    padding: 1.25rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .modal-header .btn-close {
    filter: invert(1);
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .modal-header .btn-close:hover {
    opacity: 1;
  }

  .modal-title {
    font-weight: 600;
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
    background: #f9fafb;
  }

  .modal-footer {
    border-top: none;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 0 0 12px 12px;
    position: sticky;
    bottom: 0;
    z-index: 1000;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    background: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .form-control:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }

  .form-control::placeholder {
    color: #9ca3af;
  }

  .btn-custom-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 0.95rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-custom-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  .btn-custom-secondary {
    background: #6b7280;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 0.95rem;
    color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-custom-secondary:hover {
    background: #4b5563;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
  }

  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .form-col {
    flex: 1;
  }

  .required-field::after {
    content: " *";
    color: #ef4444;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .inventory-container {
      padding: 1rem;
    }

    .page-header {
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.75rem;
    }

    .dashboard-row {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .search-container {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input {
      min-width: auto;
    }

    .modal-content {
      max-height: 95vh;
    }

    .modal-body {
      padding: 1.25rem;
    }

    .modal-footer {
      padding: 0.75rem 1.25rem;
    }

    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .form-col {
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    .dashboard-row {
      grid-template-columns: 1fr;
    }

    .table-responsive {
      font-size: 0.85rem;
    }

    .modal-content {
      border-radius: 0;
      max-height: 100vh;
    }

    .modal-header {
      border-radius: 0;
      padding: 1rem;
    }

    .modal-footer {
      border-radius: 0;
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }

    .form-label {
      font-size: 0.8rem;
    }

    .form-control {
      padding: 0.6rem 0.8rem;
      font-size: 0.9rem;
    }
  }
`;

const API_BASE = 'api/admin/inventory';

const initialFormItem = {
  name: '',
  description: '',
  quantity: '',
  unit: '',
  category: '',
  supplier: '',
  expiryDate: '',
  price: '',
  minimumStock: ''
};

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formItem, setFormItem] = useState(initialFormItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setItems(res.data);
    } catch {
      setError('Error fetching inventory items');
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/dashboard`);
      setDashboard(res.data);
    } catch {
      setError('Error loading dashboard');
    }
  };

  const handleAddItem = async () => {
    try {
      await axiosInstance.post(API_BASE, {
        ...formItem,
        quantity: Number(formItem.quantity),
        price: Number(formItem.price),
        minimumStock: Number(formItem.minimumStock)
      });
      setShowModal(false);
      setFormItem(initialFormItem);
      fetchItems();
      fetchDashboard();
    } catch {
      setError('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        fetchItems();
        fetchDashboard();
      } catch {
        setError('Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingItem(item);
    setFormItem({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      supplier: item.supplier || '',
      expiryDate: item.expiryDate || '',
      price: item.price,
      minimumStock: item.minimumStock || ''
    });
    setShowModal(true);
  };

  const handleUpdateItem = async () => {
    try {
      await axiosInstance.put(`${API_BASE}/${editingItem.id}`, {
        ...formItem,
        quantity: Number(formItem.quantity),
        price: Number(formItem.price),
        minimumStock: Number(formItem.minimumStock)
      });
      setShowModal(false);
      setIsEditMode(false);
      setEditingItem(null);
      setFormItem(initialFormItem);
      fetchItems();
      fetchDashboard();
    } catch {
      setError('Failed to update item');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }
    try {
      const res = await axiosInstance.get(`${API_BASE}/search?searchTerm=${searchTerm}`);
      setItems(res.data);
    } catch {
      setError('Search failed');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingItem(null);
    setFormItem(initialFormItem);
  };

  useEffect(() => {
    fetchItems();
    fetchDashboard();
  }, []);

  // Inject custom page styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = pageStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="inventory-container">
      <Container fluid>
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Hospital Inventory Management</h1>
          <p className="page-subtitle">Efficiently manage and track hospital inventory</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Dashboard Cards */}
        <div className="dashboard-row">
          <div className="dashboard-card total">
            <div className="card-title">Total Items</div>
            <div className="card-value">{dashboard.totalItems || 0}</div>
            <div className="card-icon">📦</div>
          </div>
          <div className="dashboard-card out-of-stock">
            <div className="card-title">Out of Stock</div>
            <div className="card-value">{dashboard.outOfStockItems || 0}</div>
            <div className="card-icon">⚠️</div>
          </div>
          <div className="dashboard-card low-stock">
            <div className="card-title">Low Stock</div>
            <div className="card-value">{dashboard.lowStockItems || 0}</div>
            <div className="card-icon">📉</div>
          </div>
          <div className="dashboard-card expiring">
            <div className="card-title">Expiring Soon</div>
            <div className="card-value">{dashboard.expiringItems || 0}</div>
            <div className="card-icon">⏰</div>
          </div>
        </div>

        {/* Search and Actions Section */}
        <div className="actions-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, category, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-search" onClick={handleSearch}>
              🔍 Search
            </button>
            <button className="btn-add" onClick={() => setShowModal(true)}>
              ➕ Add Item
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="table-container">
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Supplier</th>
                  <th>Expiry Date</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      📭 No items found. Add an item to get started!
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{item.supplier}</td>
                      <td>{item.expiryDate}</td>
                      <td><strong>${item.price}</strong></td>
                      <td>
                        <span className={`status-badge ${
                          item.stockStatus === 'In Stock' ? 'status-in-stock' :
                          item.stockStatus === 'Low Stock' ? 'status-low-stock' :
                          'status-out-of-stock'
                        }`}>
                          {item.stockStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-edit" onClick={() => handleEdit(item)}>
                            ✏️ Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Add/Edit Item Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        dialogClassName="modal-dialog-centered"
        backdrop="static"
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Basic Information Section */}
            <div className="form-group">
              <Form.Label className="required-field">Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={formItem.name}
                onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter item description"
                value={formItem.description}
                onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
              />
            </div>

            {/* Two Column Layout for Quantity and Unit */}
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <Form.Label className="required-field">Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formItem.quantity}
                    onChange={(e) => setFormItem({ ...formItem, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <Form.Label className="required-field">Unit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., pieces, boxes, kg"
                    value={formItem.unit}
                    onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Two Column Layout for Category and Supplier */}
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <Form.Label className="required-field">Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Medicine, Equipment"
                    value={formItem.category}
                    onChange={(e) => setFormItem({ ...formItem, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter supplier name"
                    value={formItem.supplier}
                    onChange={(e) => setFormItem({ ...formItem, supplier: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Two Column Layout for Expiry Date and Price */}
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formItem.expiryDate}
                    onChange={(e) => setFormItem({ ...formItem, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <Form.Label className="required-field">Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    min="0"
                    value={formItem.price}
                    onChange={(e) => setFormItem({ ...formItem, price: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Minimum Stock */}
            <div className="form-group">
              <Form.Label>Minimum Stock Level</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                min="0"
                value={formItem.minimumStock}
                onChange={(e) => setFormItem({ ...formItem, minimumStock: e.target.value })}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-custom-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="btn-custom-primary" onClick={isEditMode ? handleUpdateItem : handleAddItem}>
            {isEditMode ? 'Update Item' : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}