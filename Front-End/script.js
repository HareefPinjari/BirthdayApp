/**
 * ====================================================================
 * ❤️ BIRTHDAY WEBSITE FOR AYESHA JI ❤️
 * Logic:
 *  - If basic correct password is provided -> Unlocks Birthday Page + Confetti
 *  - First time correct password -> Intentionally triggers prank video & shows hint
 *  - Incorrect password -> Shows video in popup modal + plays video
 *  - "Click Here, for Surprise" button -> Shows funny video popup modal
 *  - Full Android Mobile Compatibility (touch-friendly, autoplay fallbacks, dvh layout)
 * ====================================================================
 */

// 🔐 Secret Passwords accepted (case-insensitive & trimmed)
const VALID_PASSWORDS = ["love123", "laddu123", "laddu143", "laddu", "ayesha", "ayeshaji", "ayesha ji", "love"];

// Prank state: first correct password attempt triggers intentional wrong password prank
let hasPranked = false;

// DOM Elements
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const messageEl = document.getElementById("message");
const loginSection = document.getElementById("loginSection");
const birthdaySection = document.getElementById("birthdaySection");
const videoPopup = document.getElementById("videoPopup");
const birthdayVideo = document.getElementById("birthdayVideo");
const heartsContainer = document.getElementById("heartsContainer");
const hintBox = document.getElementById("hintBox");
const hintText = document.getElementById("hintText");
const surpriseVideoPopup = document.getElementById("surpriseVideoPopup");
const surpriseVideo = document.getElementById("surpriseVideo");
const wishesVideoPopup = document.getElementById("wishesVideoPopup");
const wishesVideo = document.getElementById("wishesVideo");

// ====================================================================
// 1. PASSWORD VERIFICATION LOGIC
// ====================================================================
function checkPassword() {
    const enteredPassword = passwordInput.value.trim().toLowerCase();

    if (VALID_PASSWORDS.includes(enteredPassword)) {
        if (!hasPranked) {
            // 😜 FIRST ATTEMPT WITH CORRECT PASSWORD:
            // Intentionally fail as wrong password & play the prank video!
            hasPranked = true;

            // Reveal actual password in the hint section
            showHintPassword();

            // Trigger wrong password shake animation, message & video popup
            handleIncorrectPassword();
        } else {
            // ✅ SECOND+ CORRECT ATTEMPT:
            // Unlocks Birthday Page + Confetti + Celebration!
            handleSuccessfulLogin();
        }
    } else {
        // ❌ INCORRECT PASSWORD -> Show video popup
        handleIncorrectPassword();
    }
}

/**
 * Shows the actual password in the hint section after the prank
 */
function showHintPassword() {
    if (hintBox) {
        if (hintText) {
            hintText.innerHTML = '💡 Hint: Haha! Kaise Laga mera Mazak you! 😜 Ee loo - Correct password : <strong>laddu143</strong> 💕';
        }
        hintBox.classList.remove("hidden");
    }
}

/**
 * Executes when the correct password is entered
 */
function handleSuccessfulLogin() {
    // Clear any previous error messages
    messageEl.textContent = "";
    messageEl.className = "status-message";

    // Smooth transition: Hide login card & show celebration page
    loginSection.classList.add("hidden");
    birthdaySection.classList.remove("hidden");

    // Launch celebratory confetti burst!
    launchConfetti();

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Executes when an incorrect or empty password is entered
 */
function handleIncorrectPassword() {
    // 1. Shake animation on login box
    loginSection.classList.remove("shake");
    void loginSection.offsetWidth; // Trigger reflow for animation restart
    loginSection.classList.add("shake");

    // 2. Display error message
    messageEl.textContent = "Oops! Kya re Bandiya, Kya hoga re tera 🙈 Watch this video & try again!";
    messageEl.className = "status-message error";

    // 3. Show Video Modal Popup
    openVideoModal();
}

// ====================================================================
// 2. VIDEO POPUP MODAL CONTROLS (PRANK / INCORRECT PASSWORD)
// ====================================================================
function openVideoModal() {
    if (!videoPopup || !birthdayVideo) return;

    videoPopup.classList.remove("hidden");

    // Rewind and attempt auto-play (handles Android Chrome autoplay restrictions)
    birthdayVideo.currentTime = 0;
    const playPromise = birthdayVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Unmuted autoplay restricted on Android, falling back to muted:", error);
            birthdayVideo.muted = true;
            birthdayVideo.play().catch(err => console.log("Muted autoplay also blocked:", err));
        });
    }
}

function closeVideoModal() {
    if (!videoPopup || !birthdayVideo) return;

    // Pause video and rewind
    try {
        birthdayVideo.pause();
        birthdayVideo.currentTime = 0;
    } catch (e) {}

    // Hide modal
    videoPopup.classList.add("hidden");

    // Refocus password input so she can try again easily
    if (passwordInput) {
        passwordInput.focus();
        passwordInput.select();
    }
}

// Close when clicking outside the modal content card
function handleOverlayClick(event) {
    if (event.target === videoPopup) {
        closeVideoModal();
    }
}

// ====================================================================
// 2B. SURPRISE FUNNY VIDEO MODAL CONTROLS
// ====================================================================
function openSurpriseVideoModal() {
    if (!surpriseVideoPopup || !surpriseVideo) return;

    surpriseVideoPopup.classList.remove("hidden");
    surpriseVideo.currentTime = 0;
    const playPromise = surpriseVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Unmuted autoplay restricted on Android, falling back to muted:", error);
            surpriseVideo.muted = true;
            surpriseVideo.play().catch(err => console.log("Muted autoplay also blocked:", err));
        });
    }
}

function closeSurpriseVideoModal() {
    if (!surpriseVideoPopup || !surpriseVideo) return;

    try {
        surpriseVideo.pause();
        surpriseVideo.currentTime = 0;
    } catch (e) {}
    surpriseVideoPopup.classList.add("hidden");
}

function handleSurpriseOverlayClick(event) {
    if (event.target === surpriseVideoPopup) {
        closeSurpriseVideoModal();
    }
}

// ====================================================================
// 2C. WISHES VIDEO MODAL CONTROLS (ON LOCK AGAIN)
// ====================================================================
function openWishesVideoModal() {
    if (!wishesVideoPopup || !wishesVideo) return;

    wishesVideoPopup.classList.remove("hidden");
    wishesVideo.currentTime = 0;
    const playPromise = wishesVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Unmuted autoplay restricted on Android mobile, falling back to muted:", error);
            wishesVideo.muted = true;
            wishesVideo.play().catch(err => console.log("Muted autoplay also blocked:", err));
        });
    }
}

function closeWishesVideoModal() {
    if (!wishesVideoPopup || !wishesVideo) return;

    try {
        wishesVideo.pause();
        wishesVideo.currentTime = 0;
    } catch (e) {}

    wishesVideoPopup.classList.add("hidden");

    // Return to login page on popup close
    resetToLoginPage();
}

function handleWishesOverlayClick(event) {
    if (event.target === wishesVideoPopup) {
        closeWishesVideoModal();
    }
}

function handleLockAgain() {
    // Stop any birthday melody playing
    stopMusic();

    // Open Wishes Video popup
    openWishesVideoModal();
}

// Close modal with 'Escape' key, or submit password with 'Enter' key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (wishesVideoPopup && !wishesVideoPopup.classList.contains("hidden")) {
            closeWishesVideoModal();
        } else if (videoPopup && !videoPopup.classList.contains("hidden")) {
            closeVideoModal();
        } else if (surpriseVideoPopup && !surpriseVideoPopup.classList.contains("hidden")) {
            closeSurpriseVideoModal();
        }
    } else if (e.key === "Enter" && birthdaySection && birthdaySection.classList.contains("hidden")) {
        checkPassword();
    }
});

// ====================================================================
// 3. PASSWORD VISIBILITY TOGGLE (Show/Hide 👁️)
// ====================================================================
function togglePasswordVisibility() {
    const toggleBtn = document.getElementById("togglePasswordBtn");
    if (!passwordInput) return;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        if (toggleBtn) toggleBtn.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        if (toggleBtn) toggleBtn.textContent = "👁️";
    }
}

// ====================================================================
// 4. RELOCK FUNCTIONALITY
// ====================================================================
function resetToLoginPage() {
    // Stop any music playing
    stopMusic();

    // Close any open video modals
    closeVideoModal();
    closeSurpriseVideoModal();
    if (wishesVideoPopup) {
        try {
            if (wishesVideo) {
                wishesVideo.pause();
                wishesVideo.currentTime = 0;
            }
        } catch (e) {}
        wishesVideoPopup.classList.add("hidden");
    }

    // Reset sections
    birthdaySection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    // Reset prank state and hint box
    hasPranked = false;
    if (hintBox) {
        hintBox.classList.add("hidden");
    }

    // Clear password input
    passwordInput.value = "";
    messageEl.textContent = "";
    passwordInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function relockPage(skipVideo = false) {
    if (skipVideo === true) {
        resetToLoginPage();
    } else {
        handleLockAgain();
    }
}

// ====================================================================
// 5. FLOATING BACKGROUND HEARTS GENERATOR (Mobile Optimized)
// ====================================================================
const heartIcons = ["❤️", "💖", "💕", "🌸", "✨", "💗", "🌷"];

function createFloatingHeart() {
    if (!heartsContainer) return;
    // Cap active floating hearts to preserve mobile GPU/battery performance
    if (heartsContainer.childElementCount >= 16) return;

    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    // Randomize position, size, and speed
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.floor(Math.random() * 16 + 14) + "px";
    heart.style.animationDuration = (Math.random() * 6 + 6) + "s";
    heart.style.animationDelay = (Math.random() * 2) + "s";

    heartsContainer.appendChild(heart);

    // Remove element after animation ends
    setTimeout(() => {
        heart.remove();
    }, 12000);
}

// Spawn ambient hearts continuously
setInterval(createFloatingHeart, 1000);
for (let i = 0; i < 8; i++) {
    createFloatingHeart();
}

// ====================================================================
// 6. CONFETTI CELEBRATION (Pure JS HTML5 Canvas with High-DPI Support)
// ====================================================================
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    const isMobile = width < 600;
    const pieceCount = isMobile ? 75 : 120;
    const pieces = [];
    const colors = ["#ff4f81", "#ff758c", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5", "#ffffff"];

    for (let i = 0; i < pieceCount; i++) {
        pieces.push({
            x: width / 2,
            y: height / 2,
            r: Math.random() * 5 + 3,
            d: Math.random() * 120,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleInc: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0,
            vx: (Math.random() - 0.5) * (isMobile ? 14 : 18),
            vy: (Math.random() - 0.5) * (isMobile ? 14 : 18) - 4,
            gravity: 0.35,
            opacity: 1
        });
    }

    let animationFrameId;
    let startTime = Date.now();

    function draw() {
        ctx.clearRect(0, 0, width, height);
        let alive = false;

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.tiltAngle += p.tiltAngleInc;
            p.tilt = Math.sin(p.tiltAngle) * 12;

            if (Date.now() - startTime > 1500) {
                p.opacity -= 0.015;
            }

            if (p.opacity > 0 && p.y < height + 50) {
                alive = true;
                ctx.beginPath();
                ctx.lineWidth = p.r / 2;
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });

        if (alive) {
            animationFrameId = requestAnimationFrame(draw);
        } else {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, width, height);
        }
    }

    draw();
}

// Window resize listener
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const canvas = document.getElementById("confettiCanvas");
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }, 200);
});

// ====================================================================
// 7. SWEET BIRTHDAY MELODY SYNTHESIZER (Web Audio API - Mobile Supported)
// ====================================================================
let audioCtx = null;
let isMusicPlaying = false;
let melodyTimeoutId = null;

const birthdayNotes = [
    { note: 261.63, dur: 350 }, // C4
    { note: 261.63, dur: 350 }, // C4
    { note: 293.66, dur: 700 }, // D4
    { note: 261.63, dur: 700 }, // C4
    { note: 349.23, dur: 700 }, // F4
    { note: 329.63, dur: 1200 },// E4

    { note: 261.63, dur: 350 }, // C4
    { note: 261.63, dur: 350 }, // C4
    { note: 293.66, dur: 700 }, // D4
    { note: 261.63, dur: 700 }, // C4
    { note: 392.00, dur: 700 }, // G4
    { note: 349.23, dur: 1200 },// F4

    { note: 261.63, dur: 350 }, // C4
    { note: 261.63, dur: 350 }, // C4
    { note: 523.25, dur: 700 }, // C5
    { note: 440.00, dur: 700 }, // A4
    { note: 349.23, dur: 700 }, // F4
    { note: 329.63, dur: 700 }, // E4
    { note: 293.66, dur: 1000 },// D4

    { note: 466.16, dur: 350 }, // A#4
    { note: 466.16, dur: 350 }, // A#4
    { note: 440.00, dur: 700 }, // A4
    { note: 349.23, dur: 700 }, // F4
    { note: 392.00, dur: 700 }, // G4
    { note: 349.23, dur: 1400 } // F4
];

function playNote(freq, duration) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration / 1000) - 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + (duration / 1000));
    } catch (e) {
        console.error("Audio error:", e);
    }
}

function toggleMusic() {
    const musicBtn = document.getElementById("musicBtn");
    if (isMusicPlaying) {
        stopMusic();
        if (musicBtn) musicBtn.textContent = "🎵 Play Birthday Song";
    } else {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        isMusicPlaying = true;
        if (musicBtn) musicBtn.textContent = "⏸️ Pause Song";

        let currentNoteIndex = 0;
        function playNextNote() {
            if (!isMusicPlaying) return;
            if (currentNoteIndex >= birthdayNotes.length) {
                // Loop or finish
                currentNoteIndex = 0;
            }
            const current = birthdayNotes[currentNoteIndex];
            playNote(current.note, current.dur);
            currentNoteIndex++;
            melodyTimeoutId = setTimeout(playNextNote, current.dur + 60);
        }

        playNextNote();
    }
}

function stopMusic() {
    isMusicPlaying = false;
    if (melodyTimeoutId) clearTimeout(melodyTimeoutId);
    const musicBtn = document.getElementById("musicBtn");
    if (musicBtn) musicBtn.textContent = "🎵 Play Birthday Song";
}
