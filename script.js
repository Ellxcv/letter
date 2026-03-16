const revealButton = document.getElementById("revealButton");
const paperFlip = document.getElementById("paperFlip");
const paperFront = document.querySelector(".paper-front");
const paperBack = document.querySelector(".paper-back");
const messageSection = document.getElementById("messageSection");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const responseMsg = document.getElementById("responseMsg");

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
  window.emailjs.init({
    publicKey: emailJsConfig.publicKey,
  });
  emailJsReady = true;
}

function syncPaperHeight() {
  if (!paperFlip || !paperFront || !paperBack) {
    return;
  }

  const frontHeight = paperFront.scrollHeight;
  const backHeight = paperBack.scrollHeight;
  paperFlip.style.height = `${Math.max(frontHeight, backHeight)}px`;
}

syncPaperHeight();
window.addEventListener("load", syncPaperHeight);
window.addEventListener("resize", syncPaperHeight);

async function sendAnswerEmail(answer) {
  if (!emailJsReady) {
    return false;
  }

  const payload = {
    answer,
    answered_at: new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "medium",
    }),
    source: window.location.href,
  };

  try {
    await window.emailjs.send(
      emailJsConfig.serviceId,
      emailJsConfig.templateId,
      payload
    );
    return true;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return false;
  }
}

if (revealButton && paperFlip && messageSection) {
  revealButton.addEventListener("click", () => {
    revealButton.disabled = true;
    revealButton.textContent = "Membalik kertas...";

    // Delay kecil supaya state tombol ter-update sebelum animasi berjalan.
    requestAnimationFrame(() => {
      paperFlip.classList.add("is-flipped");
    });
  });
}

if (btnYes && btnNo && responseMsg) {
  btnYes.addEventListener("click", async () => {
    responseMsg.style.display = "block";
    responseMsg.textContent = "Makasih, jawabanmu sudah tersimpan. ♡";
    btnYes.disabled = true;
    btnNo.disabled = true;

    const emailSent = await sendAnswerEmail("Ya, mau");
    if (!emailSent && emailJsReady) {
      responseMsg.textContent =
        "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }

    syncPaperHeight();
  });

  btnNo.addEventListener("click", async () => {
    responseMsg.style.display = "block";
    responseMsg.textContent = "Terima kasih sudah jawab dengan jujur.";
    btnYes.disabled = true;
    btnNo.disabled = true;

    const emailSent = await sendAnswerEmail("Belum bisa");
    if (!emailSent && emailJsReady) {
      responseMsg.textContent =
        "Jawabanmu diterima, tapi email gagal terkirim. Coba lagi nanti.";
    }

    syncPaperHeight();
  });

  btnNo.addEventListener("mouseenter", () => {
    if (btnNo.disabled) {
      return;
    }

    const offsetX = Math.floor(Math.random() * 161) - 80;
    const offsetY = Math.floor(Math.random() * 81) - 40;
    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    btnNo.style.transition = "transform 0.3s ease";
  });
}
