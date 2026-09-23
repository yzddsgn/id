// =====================================================
// TRUNCATE JUDUL PRODUK (h3) — VERSI FIX (anti self-trigger)
// =====================================================

let productTitleObserver = null;

function truncateProductTitles() {

    // Putuskan observer sementara supaya perubahan yang KITA
    // buat sendiri (style, textContent) tidak memicu observer
    // untuk memanggil ulang fungsi ini terus-menerus.
    if (productTitleObserver) {
        productTitleObserver.disconnect();
    }

    document.querySelectorAll(".card h3").forEach(function (h3) {

        if (h3.offsetParent === null || h3.clientWidth === 0) {
            return;
        }

        if (!h3.dataset.fullText) {
            h3.dataset.fullText = h3.textContent.trim();
        }

        const fullText = h3.dataset.fullText;

        h3.style.whiteSpace = "nowrap";
        h3.style.overflow = "hidden";
        h3.style.textOverflow = "clip";

        h3.textContent = fullText;

        if (h3.scrollWidth <= h3.clientWidth) {
            return;
        }

        let text = fullText;

        while (h3.scrollWidth > h3.clientWidth && text.length > 0) {
            text = text.slice(0, -1);
            h3.textContent = text.trim() + "...";
        }

    });

    // Sambungkan lagi observer setelah semua perubahan DOM
    // di atas selesai.
    if (productTitleObserver) {
        productTitleObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"]
        });
    }

}

let truncateDebounceTimeout;

function scheduleTruncate() {
    clearTimeout(truncateDebounceTimeout);
    truncateDebounceTimeout = setTimeout(truncateProductTitles, 150);
}

function initTruncateObserver() {

    if (productTitleObserver) {
        return; // cegah observer dobel kalau fungsi ini terpanggil 2x
    }

    productTitleObserver = new MutationObserver(function (mutations) {

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

    productTitleObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
    });

}

document.addEventListener("DOMContentLoaded", function () {
    truncateProductTitles();
    initTruncateObserver();
});

window.addEventListener("load", truncateProductTitles);
window.addEventListener("resize", scheduleTruncate);

window.truncateProductTitles = truncateProductTitles;