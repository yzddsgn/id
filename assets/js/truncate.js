// =====================================================
// TRUNCATE JUDUL PRODUK (h3) — WORK DI SEMUA MODE
// (desktop PC/laptop, "desktop site" di HP, dan mobile
// responsive biasa)
// =====================================================
//
// Cara pakai:
// - Simpan / gabungkan file ini bersama script lain kamu
//   (misalnya di bawah cart.js, atau file terpisah lalu
//   di-import lewat <script src="truncate-title.js"></script>)
// - Otomatis jalan saat halaman dimuat & saat resize.
// - Kalau kamu render produk secara dinamis lewat JS
//   (misalnya di halaman cart), panggil ulang fungsi
//   truncateProductTitles() setelah render selesai.
//
// Beda dari versi sebelumnya:
// - TIDAK ada lagi pengecekan window.innerWidth <= 768.
//   Truncation sekarang murni berdasarkan lebar render
//   asli elemen h3 (scrollWidth vs clientWidth), jadi
//   otomatis tetap jalan walau device melaporkan viewport
//   lebar (mode "desktop site" di HP) atau di PC/laptop,
//   karena breakpoint viewport nggak lagi jadi acuan.
// =====================================================

function truncateProductTitles() {

    document.querySelectorAll(".card h3").forEach(function (h3) {

        // Simpan teks asli sekali saja,
        // supaya bisa dikembalikan lagi
        // sebelum diukur ulang.
        if (!h3.dataset.fullText) {
            h3.dataset.fullText = h3.textContent.trim();
        }

        const fullText = h3.dataset.fullText;

        // Paksa 1 baris supaya bisa diukur lebarnya,
        // berlaku sama di semua ukuran layar.
        h3.style.whiteSpace = "nowrap";
        h3.style.overflow = "hidden";
        h3.style.textOverflow = "clip";

        h3.textContent = fullText;

        // Kalau muat, tidak perlu dipotong
        if (h3.scrollWidth <= h3.clientWidth) {
            return;
        }

        // Potong huruf sedikit demi sedikit
        // sampai muat + "..."
        let text = fullText;

        while (h3.scrollWidth > h3.clientWidth && text.length > 0) {

            text = text.slice(0, -1);

            h3.textContent = text.trim() + "...";
        }

    });

}


// -------------------------------------------------
// DEBOUNCE RESIZE
// (supaya tidak dipanggil ratusan kali saat resize)
// -------------------------------------------------

let resizeTimeout;

function handleResize() {

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(truncateProductTitles, 150);
}


window.addEventListener("load", truncateProductTitles);
window.addEventListener("resize", handleResize);

// Supaya bisa dipanggil manual setelah render produk
// dinamis (misalnya di halaman cart).
window.truncateProductTitles = truncateProductTitles;