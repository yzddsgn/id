// =========================
// FILTER
// =========================

function filterProduct(category, el) {


    document
        .querySelectorAll(".filter button")
        .forEach(function (btn) {

            btn.classList.remove("active");

        });


    if (el) {

        el.classList.add("active");

    }


    // Hanya filter card produk
    document
        .querySelectorAll(".grid .card")
        .forEach(function (card) {


            if (category === "all") {

                card.style.display = "";

            }

            else if (
                card.classList.contains(category)
            ) {

                card.style.display = "";

            }

            else {

                card.style.display = "none";

            }

        });

}



const heroImages = [
    "https://yzddsgn.github.io/id/assets/products/model/model 1.jpg",
    "https://yzddsgn.github.io/id/assets/products/model/model 2.jpg",
    "https://yzddsgn.github.io/id/assets/products/model/model 3.jpg",
    "https://yzddsgn.github.io/id/assets/products/model/model 4.jpg"
];

const hero = document.getElementById("home");
const dots = document.querySelectorAll(".hero-dot");

let currentSlide = 0;
let slideTimer;


function showSlide(index) {

    currentSlide = index;

    hero.style.backgroundImage =
        "url('" + heroImages[currentSlide] + "')";

    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });
}


function nextSlide() {

    currentSlide++;

    if (currentSlide >= heroImages.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}


function restartTimer() {

    clearInterval(slideTimer);

    slideTimer = setInterval(
        nextSlide,
        5000
    );
}


/* KLIK DOT */
dots.forEach((dot) => {

    dot.addEventListener("click", function () {

        const slide = Number(
            this.dataset.slide
        );

        showSlide(slide);

        restartTimer();

    });

});


/* MULAI OTOMATIS */
showSlide(0);
restartTimer();



// =====================================================
// TRUNCATE JUDUL PRODUK (h3) DI MODE MOBILE
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
// Breakpoint mobile: 768px (samain sama breakpoint
// di CSS kamu, silahkan ubah angkanya kalau perlu).
// =====================================================

const MOBILE_BREAKPOINT = 768;

function truncateProductTitles() {

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    document.querySelectorAll(".card h3").forEach(function (h3) {

        // Simpan teks asli sekali saja,
        // supaya bisa dikembalikan lagi
        // saat layar melebar (desktop).
        if (!h3.dataset.fullText) {
            h3.dataset.fullText = h3.textContent.trim();
        }

        const fullText = h3.dataset.fullText;

        // -------------------------------------------------
        // DESKTOP: kembalikan teks penuh, teks boleh wrap
        // -------------------------------------------------
        if (!isMobile) {

            h3.textContent = fullText;

            h3.style.whiteSpace = "";
            h3.style.overflow = "";
            h3.style.textOverflow = "";

            return;
        }

        // -------------------------------------------------
        // MOBILE: paksa 1 baris supaya bisa diukur lebarnya
        // -------------------------------------------------
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


// Kalau file ini adalah module (import/export),
// buka comment baris di bawah supaya bisa dipanggil
// manual setelah render produk dinamis:
//
// window.truncateProductTitles = truncateProductTitles;