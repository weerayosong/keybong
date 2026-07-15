if (typeof englishDictionary === "undefined") {
    alert(
        "ไม่พบไฟล์ data.js กรุณาตรวจสอบให้แน่ใจว่าไฟล์อยู่ในโฟลเดอร์เดียวกัน",
    );
}

const keybrSequence = [
    "e",
    "n",
    "i",
    "a",
    "r",
    "l",
    "t",
    "o",
    "s",
    "u",
    "d",
    "y",
    "c",
    "g",
    "h",
    "p",
    "m",
    "k",
    "b",
    "w",
    "f",
    "z",
    "v",
    "x",
    "q",
    "j",
];
const keyboardLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
];

let activeLetters = ["e", "n", "i", "a", "r", "l", "t"];
let currentFocusKey = "t";
let currentStreak = 0;
let globalSpans = [];

let textToType = "";
let currentIndex = 0;
let totalKeystrokes = 0;
let errorCount = 0;
let startTime = null;
let isLessonFinished = false;

// --- ระบบเสียง (Zen Mode: Binaural Beats + Minimal Tick) ---
let soundEnabled = false; // เริ่มต้นด้วยการปิดเสียงไว้ก่อน
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let ambientOsc1, ambientOsc2, ambientGain;

function startAmbientSound() {
    if (!soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc2 = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    // เพิ่ม Panner เพื่อแยกเสียงออกหูซ้าย-ขวา (Binaural Effect)
    const pannerLeft = audioCtx.createStereoPanner();
    const pannerRight = audioCtx.createStereoPanner();
    pannerLeft.pan.value = -1; // ซ้ายสุด
    pannerRight.pan.value = 1; // ขวาสุด

    ambientOsc1.type = "sine";
    ambientOsc2.type = "sine";

    // ปรับความถี่เป็น 432Hz
    ambientOsc1.frequency.value = 432;
    ambientOsc2.frequency.value = 436; // ต่างกัน 4Hz เพื่อให้เกิดคลื่น Theta

    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);

    ambientOsc1.connect(pannerLeft);
    pannerLeft.connect(ambientGain);

    ambientOsc2.connect(pannerRight);
    pannerRight.connect(ambientGain);

    ambientGain.connect(audioCtx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
}

function stopAmbientSound() {
    if (ambientGain) {
        // Fade out นุ่มๆ ก่อนหยุด
        ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        setTimeout(() => {
            if (ambientOsc1) ambientOsc1.stop();
            if (ambientOsc2) ambientOsc2.stop();
        }, 500);
    }
}

function playTypeSound(isError) {
    if (!soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (isError) {
        // เสียงพิมพ์ผิด: ทุ้มๆ สั้นๆ สไตล์ Error
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
            40,
            audioCtx.currentTime + 0.1,
        );

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.1,
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else {
        // เสียงพิมพ์ถูก: Minimal Tick (คล้ายเสียงเม็ดน้ำ หรือ UI Click สมัยใหม่)
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime); // ความถี่สูง ใสๆ
        osc.frequency.exponentialRampToValueAtTime(
            100,
            audioCtx.currentTime + 0.03,
        ); // ดรอปอย่างรวดเร็ว

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // ไม่ดังรบกวน Ambient
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.03,
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    }

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

// DOM Elements
const textContainer = document.getElementById("typing-area");
const keyboardContainer = document.getElementById("keyboard-container");
const lettersGrid = document.getElementById("letters-grid");
const applyBtn = document.getElementById("apply-settings");
const soundBtn = document.getElementById("toggle-sound");
const wpmDisplay = document.getElementById("wpm-display");
const accDisplay = document.getElementById("acc-display");
const currentKeyDisplay = document.getElementById("current-key-display");
const streakDisplay = document.getElementById("current-streak");
const targetAccInput = document.getElementById("target-acc");
const targetRoundsInput = document.getElementById("target-rounds");
const hintStreak = document.getElementById("hint-streak");

soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundBtn.innerHTML = "🎧 โหมดสมาธิ (ON)";
        soundBtn.className =
            "ml-2 px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs transition cursor-pointer flex items-center gap-1 shadow-[0_0_8px_rgba(22,163,74,0.6)]";
        startAmbientSound();
    } else {
        soundBtn.innerHTML = "🔇 ปิดเสียง";
        soundBtn.className =
            "ml-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs transition cursor-pointer flex items-center gap-1";
        stopAmbientSound();
    }
    soundBtn.blur();
});

targetRoundsInput.addEventListener("change", (e) => {
    hintStreak.textContent = e.target.value;
});

function renderLettersSettings() {
    lettersGrid.innerHTML = "";
    keybrSequence.forEach((letter) => {
        const isActive = activeLetters.includes(letter);
        const isFocus = currentFocusKey === letter;

        const btn = document.createElement("button");
        let baseStyle =
            "w-8 h-8 flex items-center justify-center rounded text-[13px] uppercase font-mono font-bold transition-all cursor-pointer ";
        if (isFocus) {
            baseStyle +=
                "bg-blue-600 text-white ring-2 ring-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.6)] scale-110 mx-1 z-10 ";
        } else if (isActive) {
            baseStyle += "bg-[#10b981] text-white hover:bg-[#059669] ";
        } else {
            baseStyle +=
                "bg-[#27272a] text-gray-500 border border-gray-700 hover:text-gray-300 ";
        }

        btn.className = baseStyle;
        btn.textContent = letter;

        btn.onclick = () => {
            if (!isActive) activeLetters.push(letter);
            currentFocusKey = letter;
            currentKeyDisplay.textContent = currentFocusKey.toUpperCase();
            renderLettersSettings();
            initLesson();
        };

        btn.oncontextmenu = (e) => {
            e.preventDefault();
            if (isFocus) return;
            if (isActive) {
                activeLetters = activeLetters.filter((l) => l !== letter);
            } else {
                activeLetters.push(letter);
            }
            renderLettersSettings();
            initLesson();
        };

        lettersGrid.appendChild(btn);
    });
}

function renderKeyboard() {
    keyboardContainer.innerHTML = "";
    keyboardLayout.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "key-row";
        row.forEach((key) => {
            const keyDiv = document.createElement("div");
            keyDiv.className = "key";
            keyDiv.id = `key-${key}`;
            keyDiv.textContent = key;
            rowDiv.appendChild(keyDiv);
        });
        keyboardContainer.appendChild(rowDiv);
    });
    const spaceRow = document.createElement("div");
    spaceRow.className = "key-row mt-1";
    const spaceKey = document.createElement("div");
    spaceKey.className = "key key-space";
    spaceKey.id = "key-space";
    spaceRow.appendChild(spaceKey);
    keyboardContainer.appendChild(spaceRow);
}

function generateWords() {
    if (activeLetters.length === 0) return ["please", "select", "letters"];
    const validWords = englishDictionary.filter((word) => {
        return word
            .split("")
            .every((char) => activeLetters.includes(char.toLowerCase()));
    });
    const wordCount = Math.floor(Math.random() * 3) + 18;
    if (validWords.length === 0) return ["error", "need", "more", "letters"];

    let words = [];
    for (let i = 0; i < wordCount; i++) {
        let candidateWords = validWords;
        if (currentFocusKey && Math.random() < 0.5) {
            const focusWords = validWords.filter((w) =>
                w.includes(currentFocusKey),
            );
            if (focusWords.length > 0) candidateWords = focusWords;
        }
        words.push(
            candidateWords[Math.floor(Math.random() * candidateWords.length)],
        );
    }
    return words;
}

function initLesson() {
    const wordsArray = generateWords();
    textToType = wordsArray.join(" ") + " ";

    currentIndex = 0;
    totalKeystrokes = 0;
    errorCount = 0;
    startTime = null;
    isLessonFinished = false;
    globalSpans = [];

    wpmDisplay.textContent = "0";
    accDisplay.textContent = "100";
    streakDisplay.textContent = currentStreak;
    currentKeyDisplay.textContent = currentFocusKey.toUpperCase();
    textContainer.innerHTML = "";

    wordsArray.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word-container";
        word.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.dataset.error = "false";
            wordDiv.appendChild(span);
            globalSpans.push(span);
        });
        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = "·";
        spaceSpan.dataset.error = "false";
        wordDiv.appendChild(spaceSpan);
        globalSpans.push(spaceSpan);
        textContainer.appendChild(wordDiv);
    });
    updateVisuals();
}

function updateVisuals() {
    let expectedChar = textToType[currentIndex] || "";
    globalSpans.forEach((span, index) => {
        span.className = "transition-colors duration-100";
        const hasError = span.dataset.error === "true";
        if (index < currentIndex) {
            span.classList.add(hasError ? "char-error-past" : "char-correct");
        } else if (index === currentIndex && !isLessonFinished) {
            span.classList.add(
                hasError ? "cursor-error" : "cursor-active",
                "text-gray-100",
            );
        } else {
            span.classList.add("char-pending");
        }
    });

    document
        .querySelectorAll(".key")
        .forEach((k) => k.classList.remove("target"));
    if (!isLessonFinished && expectedChar) {
        const keyId =
            expectedChar === " "
                ? "key-space"
                : `key-${expectedChar.toLowerCase()}`;
        const targetKey = document.getElementById(keyId);
        if (targetKey) targetKey.classList.add("target");
    }
}

function calculateStats() {
    if (!startTime) return 100;
    const timeElapsed = (new Date() - startTime) / 60000;
    const wordsTyped = currentIndex / 5;
    const wpm = Math.round(wordsTyped / timeElapsed);
    wpmDisplay.textContent = wpm > 0 && wpm !== Infinity ? wpm : 0;

    let accuracy = 100;
    if (globalSpans.length > 0) {
        // ใช้ความยาวของข้อความทั้งหมดเป็นฐาน ผิดปุ๊บหักเปอร์เซ็นต์ปั๊บ ไม่มีฟื้นฟู
        accuracy = Math.round(
            ((globalSpans.length - errorCount) / globalSpans.length) * 100,
        );
        // กันกรณีรัวแป้นผิดจนแต้มติดลบ
        accuracy = Math.max(0, accuracy);
    }
    accDisplay.textContent = accuracy;
    return accuracy;
}

function handleLessonComplete() {
    isLessonFinished = true;
    const finalAccuracy = calculateStats();
    const targetAcc = parseInt(targetAccInput.value, 10);
    const targetRounds = parseInt(targetRoundsInput.value, 10);

    if (finalAccuracy >= targetAcc) {
        currentStreak++;
        if (currentStreak >= targetRounds) {
            currentStreak = 0;
            const currentIdx = keybrSequence.indexOf(currentFocusKey);
            if (currentIdx !== -1 && currentIdx + 1 < keybrSequence.length) {
                const nextLetter = keybrSequence[currentIdx + 1];
                if (!activeLetters.includes(nextLetter))
                    activeLetters.push(nextLetter);
                currentFocusKey = nextLetter;
                renderLettersSettings();

                setTimeout(() => {
                    alert(
                        `🎉 ยินดีด้วย! ปลดล็อคตัวอักษรใหม่: [ ${nextLetter.toUpperCase()} ]`,
                    );
                }, 100);
            }
        }
    } else {
        currentStreak = 0;
    }

    streakDisplay.textContent = currentStreak;
    setTimeout(initLesson, 800);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        currentStreak = 0;
        initLesson();
        return;
    }

    if (isLessonFinished) return;
    if (e.code === "Space" && e.target === document.body) e.preventDefault();
    if (e.key.length !== 1) return;

    if (!startTime) startTime = new Date();
    totalKeystrokes++;

    const expectedChar = textToType[currentIndex];
    const currentSpan = globalSpans[currentIndex];

    const keyId = e.key === " " ? "key-space" : `key-${e.key.toLowerCase()}`;
    const pressedKeyUI = document.getElementById(keyId);
    if (pressedKeyUI) {
        pressedKeyUI.classList.add("pressed");
        setTimeout(() => pressedKeyUI.classList.remove("pressed"), 100);
    }

    if (e.key === expectedChar) {
        playTypeSound(false);
        currentIndex++;
        if (currentIndex >= globalSpans.length - 1) {
            updateVisuals();
            handleLessonComplete();
        } else {
            updateVisuals();
        }
    } else {
        playTypeSound(true);
        if (currentSpan.dataset.error === "false") {
            errorCount++;
            currentSpan.dataset.error = "true";
        }
        updateVisuals();
    }

    calculateStats();
});

applyBtn.addEventListener("click", () => {
    currentStreak = 0;
    initLesson();
    applyBtn.blur();
});

renderLettersSettings();
renderKeyboard();
initLesson();
