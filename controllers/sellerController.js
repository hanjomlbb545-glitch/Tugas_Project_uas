exports.getAddProductForm = async (req, res) => {
  try {
    
    const categories = await Category.findAll().catch(() => []);
    
    res.render('seller/addProduct', { 
      title: 'Tambah Produk Baru',
      categories: categories || [],
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error("Error muat halaman:", error);
    res.redirect('/seller/sales');
  }
};