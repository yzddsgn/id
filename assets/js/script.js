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