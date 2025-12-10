import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Import instance axios kita

const ItemTable = () => {
  const [products, setProducts] = useState([]);
  
  // State untuk Modal dan Form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    qty: ''
  });

  // 1. READ - Ambil data dari backend
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Persiapan Tambah Data
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ name: '', price: '', qty: '' }); // Reset form
    setShowModal(true);
  };

  // Persiapan Edit Data
  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id); // Simpan ID yang mau diedit
    setFormData({
      name: product.name,
      price: product.price,
      qty: product.qty
    });
    setShowModal(true);
  };

  // 2. CREATE & UPDATE - Simpan data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Logika Update (PUT/PATCH)
        await api.patch(`/products/${currentId}`, formData);
        alert('Data berhasil diupdate!');
      } else {
        // Logika Create (POST)
        await api.post('/products', formData);
        alert('Data berhasil ditambahkan!');
      }
      
      setShowModal(false); // Tutup modal
      fetchProducts(); // Refresh tabel
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  // 3. DELETE - Hapus data
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refresh tabel setelah hapus
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Daftar Barang (Items)</h2>
        <button className="btn" onClick={handleAdd}>+ Tambah Barang</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Produk</th>
              <th>Harga (Rp)</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id || index}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 'bold', color: '#fff' }}>{product.name}</td>
                  <td>Rp {parseInt(product.price).toLocaleString('id-ID')}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: product.qty > 5 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: product.qty > 5 ? '#34d399' : '#ef4444'
                    }}>
                      {product.qty} pcs
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn" 
                      style={{ fontSize: '0.8rem', marginRight: '5px' }}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => handleDelete(product.id || product.uuid)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  Belum ada data barang.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL / POPUP FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Produk</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-control" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Harga</label>
                <input 
                  type="number" 
                  name="price"
                  className="form-control" 
                  value={formData.price}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Stok (Qty)</label>
                <input 
                  type="number" 
                  name="qty"
                  className="form-control" 
                  value={formData.qty}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn" style={{ background: '#555' }} onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ItemTable;