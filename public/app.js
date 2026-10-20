const videoLink = document.querySelector("#video-launch");
const videoContainer = document.querySelector("#video-container");
const videoStatus = document.querySelector("#video-status");

videoLink?.addEventListener("click", (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  const player = document.createElement("iframe");
  player.src = "https://www.youtube-nocookie.com/embed/QyZS4qw0xKk?autoplay=1&rel=0";
  player.title = "balcon, la lyric video de magenta";
  player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  player.allowFullscreen = true;
  player.referrerPolicy = "strict-origin-when-cross-origin";
  videoStatus.textContent = "chargement du lecteur youtube. le lien voir sur youtube reste disponible sous la vidéo.";
  player.addEventListener("load", () => {
    videoStatus.textContent = "lecteur youtube chargé. si la vidéo ne démarre pas, utilise le lien voir sur youtube.";
  }, { once: true });
  videoContainer.replaceChildren(player);
  player.focus();
});

const copyButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");

if (navigator.clipboard?.writeText && copyButton) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("rudy.magenta74@gmail.com");
      copyStatus.textContent = "adresse copiée.";
    } catch {
      copyStatus.textContent = "copie indisponible. tu peux sélectionner l’adresse ci-dessus.";
    }
  });
}
