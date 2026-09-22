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