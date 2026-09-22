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