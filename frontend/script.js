async function predict() {
  const ids = ["n", "p", "k", "temp", "hum", "ph", "rain"];
  const labels = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
  const values = {};

  // Validate
  for (let i = 0; i < ids.length; i++) {
    const val = document.getElementById(ids[i]).value.trim();
    if (val === "") {
      showError("Please fill in all fields.");
      return;
    }
    values[labels[i]] = parseFloat(val);
  }

  clearError();
  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();

    if (data.error) {
      showError("Error: " + data.error);
      return;
    }

    renderResults(data);

  } catch (err) {
    showError("Cannot connect to server. Make sure the backend is running.");
  } finally {
    setLoading(false);
  }
}

function renderResults(data) {
  const container = document.getElementById("results");
  let html = "<h2>🌾 Recommended Crops</h2>";

  data.top3.forEach((crop, i) => {
    const info = data.details[crop] || {};
    const isTop = i === 0;

    html += `
      <div class="card ${isTop ? "top" : ""}">
        <div class="crop-name">${isTop ? "👑 " : ""}${crop.toUpperCase()}</div>
        <div class="info-row">🌱 <span>Variety:</span> ${info.variety || "-"}</div>
        <div class="info-row">⏱ <span>Duration:</span> ${info.duration || "-"}</div>
        <div class="info-row">💧 <span>Water:</span> ${info.water || "-"}</div>
        <div class="info-row">💰 <span>Profit:</span> ${info.profit || "-"}</div>
        <div class="info-row">✅ <span>Benefits:</span> ${(info.benefits || []).join(", ")}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function setLoading(state) {
  document.getElementById("loading").style.display = state ? "block" : "none";
  document.getElementById("predictBtn").disabled = state;
  if (state) document.getElementById("results").innerHTML = "";
}

function showError(msg) {
  document.getElementById("results").innerHTML = `<p class="error-msg">❌ ${msg}</p>`;
}

function clearError() {
  document.getElementById("results").innerHTML = "";
}
