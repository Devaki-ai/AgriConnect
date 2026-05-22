function predict() {

    let N = document.getElementById("N").value;
    let P = document.getElementById("P").value;
    let K = document.getElementById("K").value;
    let temp = document.getElementById("temp").value;
    let humidity = document.getElementById("humidity").value;
    let ph = document.getElementById("ph").value;
    let rainfall = document.getElementById("rainfall").value;

    // 🔴 Validation
    if (!N || !P || !K || !temp || !humidity || !ph || !rainfall) {
        alert("⚠️ Please fill all fields");
        return;
    }

    // Show loading
    document.getElementById("loading").style.display = "block";
    document.getElementById("result").innerHTML = "";

    let data = {
        N: +N,
        P: +P,
        K: +K,
        temperature: +temp,
        humidity: +humidity,
        ph: +ph,
        rainfall: +rainfall
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {let html = `<h2>🌾 Top 3 Recommended Crops</h2>`;

result.top3.forEach(crop => {
    let d = result.details[crop] || {};

    html += `
    <div style="margin-bottom:15px;">
        <h3>${crop}</h3>
        <p><b>Variety:</b> ${d.variety || "-"}</p>
        <p><b>Duration:</b> ${d.duration || "-"}</p>
        <p><b>Water:</b> ${d.water || "-"}</p>
        <p><b>Profit:</b> ${d.profit || "-"}</p>
        <p><b>Benefits:</b> ${(d.benefits || []).join(", ")}</p>
    </div>
    `;
});

document.getElementById("result").innerHTML = html;}
        // 🔥 Hide loading
        
    )
    .catch(err => {
        document.getElementById("loading").style.display = "none";
        alert("❌ Error connecting to server");
        console.log(err);
    });
}