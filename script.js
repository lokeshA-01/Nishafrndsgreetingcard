
/* =========================================
   1. ELEMENTS AND SETTINGS
   ========================================= */

const envelopeWrapper = document.getElementById("envelopeWrapper");
const openButton = document.getElementById("openButton");
const topButton = document.getElementById("topButton");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================
   2. CREATE DECORATIVE LAYERS
   ========================================= */

function createLayer(className) {
    const layer = document.createElement("div");

    layer.className = className;
    layer.setAttribute("aria-hidden", "true");

    document.body.appendChild(layer);

    return layer;
}

let petalLayer = null;
let confettiLayer = null;

if (!reducedMotion) {
    petalLayer = createLayer("petal-layer");
    confettiLayer = createLayer("confetti-layer");
}


/* =========================================
   3. FLOATING FLOWERS AND PETALS 🌸
   ========================================= */

function createPetals() {
    if (!petalLayer || reducedMotion) {
        return;
    }

    const petalSymbols = ["🌸", "🌷", "✿", "❀", "♡"];
    const petalCount = 14;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement("span");

        petal.className = "falling-petal";
        petal.textContent =
            petalSymbols[i % petalSymbols.length];

        const duration = 13 + Math.random() * 10;
        const delay = -(Math.random() * duration);

        petal.style.setProperty(
            "--left",
            `${Math.random() * 100}%`
        );

        petal.style.setProperty(
            "--size",
            `${14 + Math.random() * 15}px`
        );

        petal.style.setProperty(
            "--opacity",
            `${0.25 + Math.random() * 0.4}`
        );

        petal.style.setProperty(
            "--duration",
            `${duration}s`
        );

        petal.style.setProperty(
            "--delay",
            `${delay}s`
        );

        petal.style.setProperty(
            "--drift",
            `${-70 + Math.random() * 140}px`
        );

        petalLayer.appendChild(petal);
    }
}

createPetals();


/* =========================================
   4. CONFETTI BURST 🎉
   ========================================= */

function celebrate(originX, originY, amount = 32) {
    if (!confettiLayer || reducedMotion) {
        return;
    }

    const symbols = [
        "💗", "💕", "🌸", "🌷",
        "✨", "✦", "♡", "🎉", "🌼"
    ];

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti-piece";

        piece.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 90 + Math.random() * 230;

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance + 80;

        const duration = 1.5 + Math.random() * 1.3;

        piece.style.setProperty(
            "--start-x",
            `${originX}px`
        );

        piece.style.setProperty(
            "--start-y",
            `${originY}px`
        );

        piece.style.setProperty(
            "--move-x",
            `${moveX}px`
        );

        piece.style.setProperty(
            "--move-y",
            `${moveY}px`
        );

        piece.style.setProperty(
            "--rotation",
            `${Math.random() * 900 - 450}deg`
        );

        piece.style.setProperty(
            "--size",
            `${13 + Math.random() * 16}px`
        );

        piece.style.setProperty(
            "--duration",
            `${duration}s`
        );

        confettiLayer.appendChild(piece);

        // Remove each particle after its animation finishes.
        window.setTimeout(function () {
            piece.remove();
        }, duration * 1000 + 150);
    }
}


/* =========================================
   5. OPEN THE ENVELOPE 💌
   ========================================= */

let isOpened = false;

if (envelopeWrapper && openButton) {
    openButton.addEventListener("click", function () {

        if (!isOpened) {
            isOpened = true;

            envelopeWrapper.classList.add("is-open");

            openButton.textContent =
                "Continue to Your Surprise ↓";

            // Celebration starts around the envelope.
            if (!reducedMotion) {
                const rect = envelopeWrapper.getBoundingClientRect();

                celebrate(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    42
                );
            }

            // Let the envelope open before scrolling.
            window.setTimeout(function () {
                const welcomeSection =
                    document.getElementById("welcome");

                if (welcomeSection) {
                    welcomeSection.scrollIntoView({
                        behavior: reducedMotion ? "auto" : "smooth",
                        block: "start"
                    });
                }
            }, reducedMotion ? 0 : 1000);

        } else {
            const welcomeSection =
                document.getElementById("welcome");

            if (welcomeSection) {
                welcomeSection.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });
            }
        }
    });
}


/* =========================================
   6. SMOOTH SCROLL FOR SECTION LINKS
   ========================================= */

const sectionLinks =
    document.querySelectorAll('a[href^="#"]');

sectionLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
        });

    });

});


/* =========================================
   7. REVEAL ELEMENTS ON SCROLL ✨
   ========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Each card animates only once.
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

} else {

    // Fallback for older browsers.
    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });

}


/* =========================================
   8. FINAL PAGE CELEBRATION 💗
   ========================================= */

const finalSection = document.getElementById("surprise");

if (
    finalSection &&
    "IntersectionObserver" in window &&
    !reducedMotion
) {
    let finalCelebrationPlayed = false;

    const finalObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (
                    entry.isIntersecting &&
                    !finalCelebrationPlayed
                ) {
                    finalCelebrationPlayed = true;

                    const rect =
                        finalSection.getBoundingClientRect();

                    celebrate(
                        window.innerWidth / 2,
                        Math.max(100, Math.min(
                            rect.top + 100,
                            window.innerHeight - 100
                        )),
                        24
                    );

                    observer.disconnect();
                }

            });

        },
        {
            threshold: 0.3
        }
    );

    finalObserver.observe(finalSection);
}


/* =========================================
   9. BACK TO THE BEGINNING ↑
   ========================================= */

if (topButton) {
    topButton.addEventListener("click", function () {

        const invitationSection =
            document.getElementById("invitation");

        if (invitationSection) {
            invitationSection.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }

    });
}
