const revealButton = document.getElementById("revealButton");
const paperFlip = document.getElementById("paperFlip");
const paperBack = document.querySelector(".paper-back");
const paperPage3 = document.querySelector(".paper-page3");
const paperPage4 = document.querySelector(".paper-page4");
const messageSection = document.getElementById("messageSection");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const responseMsg = document.getElementById("responseMsg");
const responseButtons = document.querySelector(".response-buttons");
const btnNextPage1 = document.getElementById("btnNextPage1");
const btnNextPage3 = document.getElementById("btnNextPage3");
const btnPrevPage3 = document.getElementById("btnPrevPage3");
const btnPrevPage4 = document.getElementById("btnPrevPage4");
const btnYesFinal = document.getElementById("btnYesFinal");
const btnNoFinal = document.getElementById("btnNoFinal");
const responseMsgFinal = document.getElementById("responseMsgFinal");
const responseButtonsFinal = document.querySelector(".response-buttons-final");

let isResponseVisible = false;
let currentPage = "back"; // back | page3 | page4

const emailJsConfig = {
  publicKey: "4XT0_9CM71QFSagKI",
  serviceId: "service_jc2e7jo",
  templateId: "template_zk25hxs",
};

let emailJsReady = false;

if (
  window.emailjs &&
  emailJsConfig.publicKey !== "YOUR_PUBLIC_KEY" &&
  emailJsConfig.serviceId !== "YOUR_SERVICE_ID" &&
  emailJsConfig.templateId !== "YOUR_TEMPLATE_ID"
) {
  window.emailjs.init({ publicKey: emailJsConfig.publicKey });
  emailJsReady = true;
}

async function sendAnswerEmail(answer) {
  if (!emailJsReady) return false;
  const payload = {
    answer,
    answered_at: new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "medium",
    }),
    source: window.location.href,
  };
  try {
    await window.emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, payload);
    return true;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return false;
  }
}

function updateResponseButtonsVisibility() {
  if (!paperBack || !responseButtons) return;
  const distanceToBottom =
    paperBack.scrollHeight - (paperBack.scrollTop + paperBack.clientHeight);
  const showThreshold = 24;
  const hideThreshold = 96;
  if (!isResponseVisible && distanceToBottom <= showThreshold) {
    isResponseVisible = true;
    responseButtons.classList.add("is-visible");
  } else if (isResponseVisible && distanceToBottom > hideThreshold) {
    isResponseVisible = false;
    responseButtons.classList.remove("is-visible");
  }
}

function updateFinalResponseButtonsVisibility() {
  if (!paperPage4 || !responseButtonsFinal) return;
  const distanceToBottom =
    paperPage4.scrollHeight - (paperPage4.scrollTop + paperPage4.clientHeight);
  if (distanceToBottom <= 24) {
    responseButtonsFinal.classList.add("is-visible");
  } else if (distanceToBottom > 96) {
    responseButtonsFinal.classList.remove("is-visible");
  }
}

if (paperBack && responseButtons) {
  paperBack.addEventListener("scroll", updateResponseButtonsVisibility);
}

if (paperPage4 && responseButtonsFinal) {
  paperPage4.addEventListener("scroll", updateFinalResponseButtonsVisibility);
}

// Flip front → back
if (revealButton && paperFlip) {
  revealButton.addEventListener("click", () => {
    revealButton.disabled = true;
    revealButton.textContent = "Membalik kertas...";
    requestAnimationFrame(() => {
      paperFlip.classList.add("is-flipped");
      updateResponseButtonsVisibility();
    });
  });
}

// Back → Page 3
function goToPage3() {
  currentPage = "page3";
  paperBack.style.display = "none";
  paperPage3.classList.add("is-active");
  paperPage3.scrollTop = 0;
  // keep the flipped state so the letter-paper bg stays
  paperFlip.classList.add("show-page3");
}

// Page 3 → Back
function goToBack() {
  currentPage = "back";
  paperPage3.classList.remove("is-active");
  paperBack.style.display = "";
  paperFlip.classList.remove("show-page3");
  paperBack.scrollTop = paperBack.scrollHeight;
}

// Page 3 → Page 4
function goToPage4() {
  currentPage = "page4";
  paperPage3.classList.remove("is-active");
  paperPage4.classList.add("is-active");
  paperPage4.scrollTop = 0;
  paperFlip.classList.remove("show-page3");
  paperFlip.classList.add("show-page4");
}

// Page 4 → Page 3
function goToPage3FromPage4() {
  currentPage = "page3";
  paperPage4.classList.remove("is-active");
  paperPage3.classList.add("is-active");
  paperPage3.scrollTop = 0;
  paperFlip.classList.remove("show-page4");
  paperFlip.classList.add("show-page3");
}

if (btnNextPage1) btnNextPage1.addEventListener("click", goToPage3);
if (btnPrevPage3) btnPrevPage3.addEventListener("click", goToBack);
if (btnNextPage3) btnNextPage3.addEventListener("click", goToPage4);
if (btnPrevPage4) btnPrevPage4.addEventListener("click", goToPage3FromPage4);

// Response buttons (page 2 / back)
if (btnYes && btnNo && responseMsg) {
  btnYes.addEventListener("click", async () => {
    responseMsg.style.display = "block";
    responseMsg.textContent = "Makasih, jawabanmu sudah tersimpan. ♡";
    btnYes.disabled = true;
    btnNo.disabled = true;
    const emailSent = await sendAnswerEmail("Ya, mau");
    if (!emailSent && emailJsReady) {
      responseMsg.textContent = "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }
  });

  btnNo.addEventListener("click", async () => {
    responseMsg.style.display = "block";
    responseMsg.textContent = "Terima kasih sudah jawab dengan jujur.";
    btnYes.disabled = true;
    btnNo.disabled = true;
    const emailSent = await sendAnswerEmail("Belum bisa");
    if (!emailSent && emailJsReady) {
      responseMsg.textContent = "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }
  });

  btnNo.addEventListener("mouseenter", () => {
    if (btnNo.disabled || !responseButtons || !responseButtons.classList.contains("is-visible")) return;
    const offsetX = Math.floor(Math.random() * 161) - 80;
    const offsetY = Math.floor(Math.random() * 81) - 40;
    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    btnNo.style.transition = "transform 0.3s ease";
  });
}

// Response buttons (page 4 / final)
if (btnYesFinal && btnNoFinal && responseMsgFinal) {
  btnYesFinal.addEventListener("click", async () => {
    responseMsgFinal.style.display = "block";
    responseMsgFinal.textContent = "Makasih, jawabanmu sudah tersimpan. ♡";
    btnYesFinal.disabled = true;
    btnNoFinal.disabled = true;
    const emailSent = await sendAnswerEmail("Ya, mau (dari halaman terakhir)");
    if (!emailSent && emailJsReady) {
      responseMsgFinal.textContent = "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }
  });

  btnNoFinal.addEventListener("click", async () => {
    responseMsgFinal.style.display = "block";
    responseMsgFinal.textContent = "Terima kasih sudah jawab dengan jujur.";
    btnYesFinal.disabled = true;
    btnNoFinal.disabled = true;
    const emailSent = await sendAnswerEmail("Belum bisa (dari halaman terakhir)");
    if (!emailSent && emailJsReady) {
      responseMsgFinal.textContent = "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }
  });

  btnNoFinal.addEventListener("mouseenter", () => {
    if (btnNoFinal.disabled || !responseButtonsFinal || !responseButtonsFinal.classList.contains("is-visible")) return;
    const offsetX = Math.floor(Math.random() * 161) - 80;
    const offsetY = Math.floor(Math.random() * 81) - 40;
    btnNoFinal.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    btnNoFinal.style.transition = "transform 0.3s ease";
  });
}

