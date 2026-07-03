const db = require('../config/db'); // Pastikan titik dua karena di dalam folder controllers

const handlePurchase = async (req, res) => {
    const { product_id, quantity } = req.body;
    const buyer_id = req.session.user.id;

    try {
        const [product] = await db.query('SELECT stock, name FROM products WHERE id = ?', [product_id]);
        
        if (product.length === 0 || product[0].stock < quantity) {
            return res.status(400).send('Stok tidak mencukupi.');
        }

        // 1. Potong Stok di Database
        await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
        
        // 2. Catat Transaksi
        await db.query('INSERT INTO transactions (product_id, buyer_id, quantity, status) VALUES (?, ?, ?, "terjual")', 
            [product_id, buyer_id, quantity]
        );

        // 3. Trigger Real-Time Communication (Socket.io)
        req.io.emit('produkTerjual', {
            nama_produk: product[0].name,
            quantity: quantity,
            nama_pembeli: req.session.user.username
        });

        // 🌟 KUNCI AGAR TIDAK STUCK: Kembalikan pembeli ke halaman katalog produk setelah sukses
        return res.redirect('/products');

    } catch (error) {
        console.error(error);
        // Jika ada error database, server tetap memberi respons berupa teks agar tidak stuck
        return res.status(500).send('Terjadi kesalahan saat memproses pembelian.');
    }
};

module.exports = {
    handlePurchase
};