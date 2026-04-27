/* Čeština 2.0 – prezentační deck (sdílená navigace a interakce) */
(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const progressBar = document.querySelector('.progress__bar');
    const counter = document.querySelector('.counter');

    if (!slides.length) return;

    let current = 0;
    let fragmentIndex = 0;

    function fragmentsOf(slide) {
        return Array.from(slide.querySelectorAll('.fragment'));
    }

    function render() {
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        if (progressBar) {
            progressBar.style.width = ((current + 1) / slides.length * 100) + '%';
        }
        if (counter) {
            counter.textContent = (current + 1) + ' / ' + slides.length;
        }
        history.replaceState(null, '', '#' + (current + 1));
    }

    function go(n, resetFrags = true) {
        current = Math.max(0, Math.min(slides.length - 1, n));
        if (resetFrags) {
            fragmentsOf(slides[current]).forEach(f => f.classList.remove('visible'));
            fragmentIndex = 0;
        }
        render();
    }

    function next() {
        const frags = fragmentsOf(slides[current]);
        if (fragmentIndex < frags.length) {
            frags[fragmentIndex].classList.add('visible');
            fragmentIndex++;
        } else if (current < slides.length - 1) {
            go(current + 1);
        }
    }

    function prev() {
        const frags = fragmentsOf(slides[current]);
        if (fragmentIndex > 0) {
            fragmentIndex--;
            frags[fragmentIndex].classList.remove('visible');
        } else if (current > 0) {
            // Při skoku zpět zobrazíme předchozí slide se všemi fragmenty odhalenými
            current = current - 1;
            const prevFrags = fragmentsOf(slides[current]);
            prevFrags.forEach(f => f.classList.add('visible'));
            fragmentIndex = prevFrags.length;
            render();
        }
    }

    document.addEventListener('keydown', e => {
        const k = e.key;
        if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') {
            e.preventDefault();
            next();
        } else if (k === 'ArrowLeft' || k === 'PageUp') {
            e.preventDefault();
            prev();
        } else if (k === 'Home') {
            e.preventDefault();
            go(0);
        } else if (k === 'End') {
            e.preventDefault();
            go(slides.length - 1);
        } else if (k === 'f' || k === 'F') {
            e.preventDefault();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
        } else if (k === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Klik na flip kartičku = otočení (nejde dál ve slidu)
    document.addEventListener('click', e => {
        const card = e.target.closest('.flip-card');
        if (card) {
            e.preventDefault();
            card.classList.toggle('flipped');
            return;
        }
        if (e.target.closest('a, button, input, .no-advance')) return;
        next();
    });

    // Dotyk – swipe vlevo/vpravo
    let touchX = 0;
    document.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    document.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchX;
        if (Math.abs(dx) > 60) dx < 0 ? next() : prev();
    }, { passive: true });

    // Start – respektuj hash v URL
    const startHash = parseInt(location.hash.slice(1), 10);
    if (!isNaN(startHash) && startHash >= 1 && startHash <= slides.length) {
        go(startHash - 1);
    } else {
        render();
    }
})();
