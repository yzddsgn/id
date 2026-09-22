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



const heroSlides = [
    {
        image: "https://yzddsgn.github.io/id/assets/products/model/model 1.jpg",
        title: "NEW ARRIVAL - GRAPHIC TEE",
        text: "Desain grafis bold dengan sablon tahan lama, dibuat untuk yang berani tampil beda."
    },
    {
        image: "https://yzddsgn.github.io/id/assets/products/model/model 2.jpg",
        title: "NEW ARRIVAL - HARDCORE SERIES",
        text: "Koleksi hardcore terbaru, cotton combed 24s tebal dan nyaman dipakai seharian."
    },
    {
        image: "https://yzddsgn.github.io/id/assets/products/model/model 3.jpg",
        title: "NEW ARRIVAL - CITY MAP EDITION",
        text: "Rayakan kotamu lewat desain peta eksklusif, limited stock tiap kota."
    },
    {
        image: "https://yzddsgn.github.io/id/assets/products/model/model 4.jpg",
        title: "NEW ARRIVAL - DEATHCORE DROP",
        text: "Statement piece untuk kamu yang enggak takut tampil gelap dan berkarakter."
    }
];

const heroMedia = document.getElementById("heroMedia");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const dots = document.querySelectorAll(".hero-dot");

let currentSlide = 0;
let slideTimer;


function showSlide(index) {

    currentSlide = index;

    const slide = heroSlides[currentSlide];

    heroMedia.style.backgroundImage =
        "url('" + slide.image + "')";

    heroTitle.textContent = slide.title;
    heroText.textContent = slide.text;

    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });
}


function nextSlide() {

    currentSlide++;

    if (currentSlide >= heroSlides.length) {
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



// =====================================================
// IMAGE ZOOM / LIGHTBOX
// Klik/tap gambar produk -> tampil membesar di tengah layar
// Responsif: desktop, tablet, semua versi mobile
// =====================================================
//
// Cara pakai:
// - Gabungkan file ini dengan script lain kamu,
//   atau panggil lewat <script src="image-zoom.js"></script>
// - Otomatis aktif untuk semua elemen <img> di dalam .card
//   (baik yang sudah ada di HTML, maupun yang ditambahkan
//   belakangan lewat JS, karena pakai event delegation).
// =====================================================


// -------------------------------------------------
// STYLE (disuntik sekali saja)
// -------------------------------------------------

function injectImageZoomStyle() {

    if (document.getElementById("imageZoomStyle")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "imageZoomStyle";

    style.textContent = `

        .card img {
            cursor: zoom-in;
        }

        #imageZoomOverlay {

            position: fixed;
            inset: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(6px);

            opacity: 0;

            z-index: 999999;

            transition: opacity 0.25s ease;

            box-sizing: border-box;
        }

        #imageZoomOverlay.show {
            opacity: 1;
        }

        #imageZoomOverlay img {

            max-width: 90vw;
            max-height: 85vh;

            width: auto;
            height: auto;

            object-fit: contain;

            border-radius: 12px;

            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

            cursor: default;

            transform: scale(0.9);

            transition: transform 0.25s ease;

            user-select: none;
            -webkit-user-drag: none;
        }

        #imageZoomOverlay.show img {
            transform: scale(1);
        }

        #imageZoomClose {

            position: fixed;

            top: 18px;
            right: 20px;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: none;
            border-radius: 50%;

            background: rgba(255, 255, 255, 0.12);
            color: #fff;

            font-size: 22px;
            line-height: 1;

            cursor: pointer;

            transition: background 0.2s ease, transform 0.2s ease;
        }

        #imageZoomClose:hover {
            background: rgba(255, 255, 255, 0.22);
            transform: rotate(90deg);
        }

        @media (max-width: 500px) {

            #imageZoomClose {
                top: 12px;
                right: 12px;

                width: 36px;
                height: 36px;

                font-size: 20px;
            }

            #imageZoomOverlay img {
                max-width: 94vw;
                max-height: 80vh;
            }

        }

    `;

    document.head.appendChild(style);
}


// -------------------------------------------------
// BUKA OVERLAY
// -------------------------------------------------

let lastFocusedElement = null;

function openImageZoom(src, alt) {

    injectImageZoomStyle();

    closeImageZoom();

    lastFocusedElement = document.activeElement;

    const overlay = document.createElement("div");

    overlay.id = "imageZoomOverlay";

    overlay.innerHTML = `
        <button
            id="imageZoomClose"
            type="button"
            aria-label="Tutup"
        >
            ×
        </button>

        <img
            src="${src}"
            alt="${alt || ""}"
        >
    `;

    document.body.appendChild(overlay);

    document.body.style.overflow = "hidden";

    // Klik area gelap (di luar gambar) -> tutup
    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            closeImageZoom();
        }

    });

    overlay.querySelector("#imageZoomClose")
        .addEventListener("click", closeImageZoom);

    document.addEventListener("keydown", handleImageZoomEscape);

    // trigger animasi masuk
    setTimeout(function () {
        overlay.classList.add("show");
    }, 10);

}


// -------------------------------------------------
// TUTUP OVERLAY
// -------------------------------------------------

function closeImageZoom() {

    const overlay = document.getElementById("imageZoomOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.remove("show");

    document.removeEventListener("keydown", handleImageZoomEscape);

    setTimeout(function () {

        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        document.body.style.overflow = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

    }, 250);

}


function handleImageZoomEscape(event) {

    if (event.key === "Escape") {
        closeImageZoom();
    }

}


// -------------------------------------------------
// EVENT DELEGATION
// Menangkap klik pada SEMUA gambar produk,
// termasuk yang ditambahkan dinamis lewat JS nanti.
// -------------------------------------------------

document.addEventListener("click", function (event) {

    const img = event.target.closest(".card img");

    if (!img) {
        return;
    }

    openImageZoom(img.currentSrc || img.src, img.alt);

});


// Inject style dari awal
injectImageZoomStyle();



(function () {
    const header = document.querySelector('header');
    let lastScroll = window.scrollY;
    let ticking = false;

    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function onScroll() {
        const currentScroll = window.scrollY;

        if (!isMobile()) {
            header.classList.remove('nav-hidden');
            lastScroll = currentScroll;
            ticking = false;
            return;
        }

        if (currentScroll <= 0) {
            header.classList.remove('nav-hidden');
        } else if (currentScroll > lastScroll) {
            header.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll) {
            header.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', function () {
        if (!isMobile()) {
            header.classList.remove('nav-hidden');
        }
    });
})();