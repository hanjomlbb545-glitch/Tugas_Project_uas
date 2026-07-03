const { Product, Category } = require('../models');

// Logika lama dashboard penjualan kalian (tetap biarkan di atas)
exports.getSalesDashboard = async (req, res) => { /* ... kode lama ... */ };

// 1. Fungsi menampilkan Form Tambah Barang
exports.getAddProductForm = async (req, res) => {
  try {
    // Ambil semua kategori dari database untuk pilihan dropdown di form
    const categories = await Category.findAll();
    res.render('seller/addProduct', { 
      title: 'Tambah Produk Baru',
      categories,
      user: req.session.user // Supaya tahu siapa penjualnya
    });
  } catch (error) {
    req.flash('error_msg', 'Gagal memuat halaman tambah produk');
    res.redirect('/seller/sales');
  }
};

// 2. Fungsi memproses penyimpanan barang baru ke database
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, categoryId, image } = req.body;
    
    // Validasi input sikit biar aman
    if (!name || !price || !stock || !categoryId) {
      req.flash('error_msg', 'Semua bidang wajib diisi!');
      return res.redirect('/seller/products/add');
    }

    // Simpan ke tabel Products
    await Product.create({
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      categoryId: parseInt(categoryId),
      image: image || '/img/default-product.png', // Fallback jika tidak upload foto
      sellerId: req.session.user.id // ID Penjual diambil dari session user login
    });

    req.flash('success_msg', 'Produk berhasil ditambahkan dan siap dijual!');
    res.redirect('/seller/sales'); // Balikkan ke dashboard jualan
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Terjadi kesalahan saat menambah produk');
    res.redirect('/seller/products/add');
  }
};