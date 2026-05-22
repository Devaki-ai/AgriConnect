async function predict() {
    const fields = ["n", "p", "k", "temp", "hum", "ph", "rain"];
    const values = {};

    // Validate all fields
    for (const id of fields) {
        const val = document.getElementById(id).value.trim();
        if (val === "") {
            alert("⚠️ Please fill all fields!");
            return;
        }
        values[id] = Number(val);
    }

    const btn = document.getElementById("predictBtn");
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");

    btn.disabled = true;
    loading.style.display = "block";
    result.innerHTML = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                N: values.n,
                P: values.p,
                K: values.k,
                temperature: values.temp,
                humidity: values.hum,
                ph: values.ph,
                rainfall: values.rain
            })
        });

        const data = await response.json();

        if (data.error) {
            result.innerHTML = `<p class="error">❌ ${data.error}</p>`;
            return;
        }

        let html = "<h3>🌾 Recommended Crops</h3>";

        data.top3.forEach((crop, index) => {
            const info = data.details[crop] || {};
            const isTop = index === 0;

            html += `
                <div class="card ${isTop ? "top" : ""}">
                    <b>${isTop ? "👑 " : ""}${crop.toUpperCase()}</b>
                    <p>🌱 <b>Variety:</b> ${info.variety || "-"}</p>
                    <p>⏱ <b>Duration:</b> ${info.duration || "-"}</p>
                    <p>${info.water || "-"} <b>Water:</b> ${info.water || "-"}</p>
                    <p>💰 <b>Profit:</b> ${info.profit || "-"}</p>
                    <p>✅ <b>Benefits:</b> ${(info.benefits || []).join(", ")}</p>
                </div>
            `;
        });

        result.innerHTML = html;

    } catch (err) {
        result.innerHTML = `<p class="error">❌ Could not connect to server. Make sure the backend is running.</p>`;
        console.error(err);
    } finally {
        btn.disabled = false;
        loading.style.display = "none";
    }
}
