// =====================================================
// TRUNCATE JUDUL PRODUK (h3) — WORK DI SEMUA MODE
// (desktop PC/laptop, "desktop site" di HP, dan mobile
// responsive biasa) — VERSI DIPERBAIKI
// =====================================================
//
// Perbaikan dari versi sebelumnya:
// 1. Melewati (skip) elemen yang sedang tersembunyi
//    (display:none / clientWidth 0), misalnya card yang
//    lagi di-filter — supaya judulnya tidak rusak jadi "...".
// 2. Otomatis mendeteksi card baru yang ditambahkan ke DOM
//    secara dinamis (misalnya di halaman Cart) lewat
//    MutationObserver, tidak lagi hanya mengandalkan event
//    "load" atau pemanggilan manual.
// 3. Juga mendengarkan perubahan atribut style/class (untuk
//    menangkap saat filter menyembunyikan/menampilkan card),
//    lalu menjadwalkan ulang truncate.
// 4. Dijalankan di DOMContentLoaded (lebih cepat) DAN saat
//    load (untuk jaga-jaga reflow akibat gambar/font selesai
//    dimuat).
// =====================================================

function truncateProductTitles() {

    document.querySelectorAll(".card h3").forEach(function (h3) {

        // Lewati elemen yang sedang tidak terlihat/tidak
        // punya lebar (misalnya card lagi disembunyikan oleh
        // filter) — mencegah judul rusak jadi "...".
        if (h3.offsetParent === null || h3.clientWidth === 0) {
            return;
        }

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

        // Selalu kembalikan ke teks penuh dulu sebelum diukur,
        // supaya hasil truncate sebelumnya tidak ikut terukur.
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
// DEBOUNCE (dipakai untuk resize & mutation observer,
// supaya tidak dipanggil berkali-kali dalam waktu singkat)
// -------------------------------------------------

let truncateDebounceTimeout;

function scheduleTruncate() {

    clearTimeout(truncateDebounceTimeout);

    truncateDebounceTimeout = setTimeout(truncateProductTitles, 150);
}


// -------------------------------------------------
// AUTO-DETECT PERUBAHAN DOM
// Menangkap:
// - Card baru ditambahkan (misalnya render dinamis di
//   halaman Cart)
// - Card disembunyikan / dimunculkan lagi (filter), lewat
//   perubahan atribut style/class
// -------------------------------------------------

function initTruncateObserver() {

    const observer = new MutationObserver(function (mutations) {

        let shouldRun = false;

        for (const mutation of mutations) {

            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                shouldRun = true;
                break;
            }

            if (
                mutation.type === "attributes" &&
                (mutation.attributeName === "style" || mutation.attributeName === "class")
            ) {
                shouldRun = true;
                break;
            }
        }

        if (shouldRun) {
            scheduleTruncate();
        }

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
    });

}


// -------------------------------------------------
// INISIALISASI
// -------------------------------------------------

document.addEventListener("DOMContentLoaded", truncateProductTitles);
window.addEventListener("load", truncateProductTitles);
window.addEventListener("resize", scheduleTruncate);

document.addEventListener("DOMContentLoaded", initTruncateObserver);

// Supaya bisa dipanggil manual setelah render produk
// dinamis (misalnya di halaman cart), kalau memang perlu.
window.truncateProductTitles = truncateProductTitles;