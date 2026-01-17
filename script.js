let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const chatBox = document.getElementById("chatBox");

// URL FUTURA DA API PYTHON
const API_URL = "https://SUA-API-AQUI/chat";

recordBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.start();

  recordBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = async () => {
  mediaRecorder.stop();

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    addMessage("user", "🎤 Mensagem de voz enviada...");

    // ENVIO PARA BACKEND (ainda não ativo)
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      addMessage("ia", data.resposta);
    } catch (err) {
      addMessage(
        "ia",
        "⚠️ IA ainda não conectada. Backend em construção."
      );
    }
  };

  recordBtn.disabled = false;
  stopBtn.disabled = true;
};

function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
