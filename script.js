/* ============================================================
   BARD — A DIFFERENT KIND OF BEGINNING
   SCRIPT.JS
   ============================================================ */


/* ============================================================
   SCROLL REVEALS
   ============================================================ */

const revealElements = document.querySelectorAll(
    ".text-block, .editorial-image, .statement, .chapter-break, .image-pair, .full-bleed-type, .ending"
);

if (revealElements.length) {

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

}


/* ============================================================
   HEADER
   FADE OUT OVER HERO / RETURN AFTER HERO
   ============================================================ */

const header = document.querySelector(".site-header");
const heroSection = document.querySelector(".hero");

if (header && heroSection) {

    const headerObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    header.classList.remove("is-visible");

                } else {

                    header.classList.add("is-visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    headerObserver.observe(heroSection);

}


/* ============================================================
   IMAGE PARALLAX
   ============================================================ */

const parallaxImages = document.querySelectorAll(
    ".editorial-image img"
);

function updateParallax() {

    const viewportHeight = window.innerHeight;

    parallaxImages.forEach((image) => {

        const rect =
            image.getBoundingClientRect();

        if (
            rect.bottom < 0 ||
            rect.top > viewportHeight
        ) {
            return;
        }

        const center =
            rect.top + rect.height / 2;

        const distance =
            center - viewportHeight / 2;

        const movement =
            distance * -0.035;

        image.style.transform =
            `translate3d(0, ${movement}px, 0)`;

    });

}

if (parallaxImages.length) {

    window.addEventListener(
        "scroll",
        updateParallax,
        { passive: true }
    );

}


/* ============================================================
   SMOOTH INTERNAL LINKS
   ============================================================ */

const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
);

internalLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* ============================================================
   INSET VIMEO VIDEO
   ENTIRE VIDEO CLICKABLE
   PLAY / PAUSE
   AUDIO
   PROGRESS
   SEEK
   ============================================================ */

const insetVideo =
    document.querySelector(".inset-video");

if (
    insetVideo &&
    typeof Vimeo !== "undefined"
) {

    const iframe =
        insetVideo.querySelector("iframe");

    const frame =
        insetVideo.querySelector(
            ".inset-video-frame"
        );

    const control =
        insetVideo.querySelector(
            ".inset-video-control"
        );

    const audioControl =
        insetVideo.querySelector(
            ".inset-video-audio"
        );

    const progress =
        insetVideo.querySelector(
            ".inset-video-progress"
        );

    const progressFill =
        insetVideo.querySelector(
            ".inset-video-progress-fill"
        );


    /* ========================================================
       CREATE VIMEO PLAYER
       ======================================================== */

    if (iframe) {

        const player =
            new Vimeo.Player(iframe);


        /* ====================================================
           CLICK ANYWHERE ON VIDEO
           PLAY / PAUSE
           ==================================================== */

        if (frame) {

            frame.addEventListener(
                "click",
                async (event) => {

                    /*
                       Controls have their own actions.
                       Don't let their clicks also
                       trigger play / pause.
                    */

                    if (
                        event.target.closest(
                            ".inset-video-controls"
                        )
                    ) {
                        return;
                    }

                    try {

                        const paused =
                            await player.getPaused();

                        if (paused) {

                            await player.play();

                        } else {

                            await player.pause();

                        }

                    } catch (error) {

                        console.error(
                            "Vimeo playback error:",
                            error
                        );

                    }

                }
            );

        }


        /* ====================================================
           PLAY / PAUSE BUTTON
           ==================================================== */

        if (control) {

            control.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    try {

                        const paused =
                            await player.getPaused();

                        if (paused) {

                            await player.play();

                        } else {

                            await player.pause();

                        }

                    } catch (error) {

                        console.error(
                            "Vimeo playback error:",
                            error
                        );

                    }

                }
            );

        }


        /* ====================================================
           PLAY EVENT
           ==================================================== */

        player.on("play", () => {

            insetVideo.classList.add(
                "is-playing"
            );

            if (control) {

                control.setAttribute(
                    "aria-label",
                    "Pause video"
                );

                control.setAttribute(
                    "aria-pressed",
                    "true"
                );

            }

        });


        /* ====================================================
           PAUSE EVENT
           ==================================================== */

        player.on("pause", () => {

            insetVideo.classList.remove(
                "is-playing"
            );

            if (control) {

                control.setAttribute(
                    "aria-label",
                    "Play video"
                );

                control.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

        });


        /* ====================================================
           ENDED EVENT
           ==================================================== */

        player.on("ended", () => {

            insetVideo.classList.remove(
                "is-playing"
            );

            if (control) {

                control.setAttribute(
                    "aria-label",
                    "Replay video"
                );

                control.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

            if (progressFill) {

                progressFill.style.width =
                    "100%";

            }

        });


        /* ====================================================
           AUDIO CONTROL
           ==================================================== */

        if (audioControl) {

            audioControl.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    try {

                        const muted =
                            await player.getMuted();

                        await player.setMuted(
                            !muted
                        );

                        audioControl.classList.toggle(
                            "is-unmuted",
                            muted
                        );

                        audioControl.setAttribute(
                            "aria-label",
                            muted
                                ? "Mute video"
                                : "Turn sound on"
                        );

                        audioControl.setAttribute(
                            "aria-pressed",
                            muted
                                ? "true"
                                : "false"
                        );

                    } catch (error) {

                        console.error(
                            "Vimeo audio error:",
                            error
                        );

                    }

                }
            );

        }


        /* ====================================================
           TIME UPDATE
           ==================================================== */

        player.on(
            "timeupdate",
            (data) => {

                if (
                    !progressFill ||
                    !data.duration
                ) {
                    return;
                }

                const percentage =
                    (
                        data.seconds /
                        data.duration
                    ) * 100;

                progressFill.style.width =
                    `${percentage}%`;

                if (progress) {

                    progress.style.setProperty(
                        "--progress",
                        percentage
                    );

                    progress.setAttribute(
                        "aria-valuenow",
                        Math.round(percentage)
                    );

                }

            }
        );


        /* ====================================================
           PROGRESS / SEEK
           ==================================================== */

        if (
            progress &&
            progressFill
        ) {

            let dragging = false;


            /* ------------------------------------------------
               SEEK FUNCTION
               ------------------------------------------------ */

            const seek = async (event) => {

                const rect =
                    progress.getBoundingClientRect();

                const position =
                    (
                        event.clientX -
                        rect.left
                    ) / rect.width;

                const clamped =
                    Math.max(
                        0,
                        Math.min(1, position)
                    );

                const duration =
                    await player.getDuration();

                if (!duration) {
                    return;
                }

                await player.setCurrentTime(
                    duration * clamped
                );

                const percentage =
                    clamped * 100;

                progressFill.style.width =
                    `${percentage}%`;

                progress.style.setProperty(
                    "--progress",
                    percentage
                );

                progress.setAttribute(
                    "aria-valuenow",
                    Math.round(percentage)
                );

            };


            /* ------------------------------------------------
               CLICK TO SEEK
               ------------------------------------------------ */

            progress.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    try {

                        await seek(event);

                    } catch (error) {

                        console.error(
                            "Vimeo seek error:",
                            error
                        );

                    }

                }
            );


            /* ------------------------------------------------
               POINTER DOWN
               ------------------------------------------------ */

            progress.addEventListener(
                "pointerdown",
                async (event) => {

                    event.stopPropagation();

                    dragging = true;

                    progress.setPointerCapture(
                        event.pointerId
                    );

                    try {

                        await seek(event);

                    } catch (error) {

                        console.error(
                            "Vimeo seek error:",
                            error
                        );

                    }

                }
            );


            /* ------------------------------------------------
               POINTER MOVE
               ------------------------------------------------ */

            progress.addEventListener(
                "pointermove",
                async (event) => {

                    if (!dragging) {
                        return;
                    }

                    try {

                        await seek(event);

                    } catch (error) {

                        console.error(
                            "Vimeo seek error:",
                            error
                        );

                    }

                }
            );


            /* ------------------------------------------------
               POINTER UP
               ------------------------------------------------ */

            progress.addEventListener(
                "pointerup",
                () => {

                    dragging = false;

                }
            );


            /* ------------------------------------------------
               POINTER CANCEL
               ------------------------------------------------ */

            progress.addEventListener(
                "pointercancel",
                () => {

                    dragging = false;

                }
            );

        }


        /* ====================================================
           INITIAL AUDIO STATE
           ==================================================== */

        player
            .getMuted()
            .then((muted) => {

                if (!audioControl) {
                    return;
                }

                audioControl.classList.toggle(
                    "is-unmuted",
                    !muted
                );

                audioControl.setAttribute(
                    "aria-label",
                    muted
                        ? "Turn sound on"
                        : "Mute video"
                );

                audioControl.setAttribute(
                    "aria-pressed",
                    muted
                        ? "false"
                        : "true"
                );

            })
            .catch((error) => {

                console.error(
                    "Vimeo audio state error:",
                    error
                );

            });

    }

}


/* ============================================================
   FULL WIDTH VIDEO LOAD STATE
   ============================================================ */

const videoFrames =
    document.querySelectorAll(
        ".video-frame iframe"
    );

videoFrames.forEach((iframe) => {

    iframe.addEventListener(
        "load",
        () => {

            iframe
                .closest(".video-frame")
                ?.classList.add("is-loaded");

        }
    );

});



/* ============================================================
   SCROLL-DRIVEN IMAGE GALLERY
   ============================================================ */

const imageGallery = document.querySelector(".image-scroll-section");

if (imageGallery) {

    const galleryImages =
        imageGallery.querySelectorAll(".image-scroll-item");

    const captionNumber =
        imageGallery.querySelector(".caption-number");

    const captionText =
        imageGallery.querySelector(".caption-text");

    const currentImage =
        imageGallery.querySelector(".current-image");


    /* ------------------------------------------------------------
       CAPTIONS
       ------------------------------------------------------------ */

    const captions = [
        "BLITHEWOOD MANOR ON THE ANNANDALE CAMPUS IS HOME TO THE ECONOMICS PROGRAM AT BARD",
        "PROFESSOR PAVLINA TCHERNEVA / THE PRESIDENT OF THE LEVY ECONOMICS INSTITUTE AT BARD.",
        "THE LINCOLN MEMORIAL IN WASHINGTON, D.C.",
        "VIEW OF THE CAPITOL BUILDING FROM THE LINCOLN MEMORIAL",
        "ELECTION@BARD STUDENTS REGISTERING BARD STUDENTS TO VOTE"
    ];


    /* ------------------------------------------------------------
       UPDATE GALLERY
       ------------------------------------------------------------ */

    function updateImageGallery() {

        const rect =
            imageGallery.getBoundingClientRect();

        const sectionHeight =
            imageGallery.offsetHeight;

        const viewportHeight =
            window.innerHeight;

        const scrollDistance =
            sectionHeight - viewportHeight;


        if (scrollDistance <= 0) {
            return;
        }


        /* --------------------------------------------------------
           CALCULATE SCROLL PROGRESS
           -------------------------------------------------------- */

        let progress =
            -rect.top / scrollDistance;

        progress =
            Math.max(0, Math.min(1, progress));


        /* --------------------------------------------------------
           DETERMINE CURRENT IMAGE
           -------------------------------------------------------- */

        const imageIndex =
            Math.min(
                galleryImages.length - 1,
                Math.floor(
                    progress * galleryImages.length
                )
            );


        /* --------------------------------------------------------
           ACTIVATE CURRENT IMAGE
           -------------------------------------------------------- */

        galleryImages.forEach((image, index) => {

            image.classList.toggle(
                "active",
                index === imageIndex
            );

        });


        /* --------------------------------------------------------
           FORMAT NUMBER
           -------------------------------------------------------- */

        const number =
            String(imageIndex + 1).padStart(2, "0");


        /* --------------------------------------------------------
           CAPTION NUMBER
           
           Non-breaking spaces are added here so the gap
           between the number and caption is created by JS.
           -------------------------------------------------------- */

        if (captionNumber) {

            captionNumber.textContent =
                number + "\u00A0\u00A0\u00A0\u00A0";

        }


        /* --------------------------------------------------------
           CAPTION TEXT
           -------------------------------------------------------- */

        if (captionText) {

            captionText.textContent =
                captions[imageIndex] || "";

        }


        /* --------------------------------------------------------
           BOTTOM-RIGHT COUNTER
           -------------------------------------------------------- */

        if (currentImage) {

            currentImage.textContent =
                number;

        }

    }


    /* ------------------------------------------------------------
       SCROLL EVENT
       ------------------------------------------------------------ */

    window.addEventListener(
        "scroll",
        updateImageGallery,
        { passive: true }
    );


    /* ------------------------------------------------------------
       RESIZE EVENT
       ------------------------------------------------------------ */

    window.addEventListener(
        "resize",
        updateImageGallery
    );


    /* ------------------------------------------------------------
       INITIALIZE
       ------------------------------------------------------------ */

    updateImageGallery();

}


/* ============================================================
   PAGE LOAD
   ============================================================ */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

        updateParallax();

    }
);