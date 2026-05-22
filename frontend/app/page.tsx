"use client";

import { useState } from "react";

interface CropInfo {
  variety: string;
  duration: string;
  water: string;
  profit: string;
  benefits: string[];
}

interface PredictResponse {
  top3: string[];
  details: Record<string, CropInfo>;
  error?: string;
}

const defaultForm = {
  N: "",
  P: "",
  K: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
};

export default function Home() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validate
    for (const [key, val] of Object.entries(form)) {
      if (val.trim() === "") {
        setError(`Please fill in the ${key} field.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(form.N),
          P: Number(form.P),
          K: Number(form.K),
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          ph: Number(form.ph),
          rainfall: Number(form.rainfall),
        }),
      });

      const data: PredictResponse = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not connect to the backend. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  const fields: { label: string; name: keyof typeof defaultForm; placeholder: string; step?: string }[] = [
    { label: "Nitrogen (N)", name: "N", placeholder: "e.g. 90" },
    { label: "Phosphorus (P)", name: "P", placeholder: "e.g. 42" },
    { label: "Potassium (K)", name: "K", placeholder: "e.g. 43" },
    { label: "Temperature (°C)", name: "temperature", placeholder: "e.g. 21" },
    { label: "Humidity (%)", name: "humidity", placeholder: "e.g. 82" },
    { label: "pH Level", name: "ph", placeholder: "e.g. 6.5", step: "0.1" },
    { label: "Rainfall (mm)", name: "rainfall", placeholder: "e.g. 200" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-500 to-lime-300 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">🌾 AgriConnect</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter soil &amp; climate details to get crop recommendations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map(({ label, name, placeholder, step }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="number"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                step={step ?? "any"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Predicting..." : "🔍 Predict Crops"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600 font-medium text-sm text-center">
            ❌ {error}
          </p>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              🌾 Recommended Crops
            </h2>
            <div className="space-y-3">
              {result.top3.map((crop, index) => {
                const info = result.details[crop] || {};
                const isTop = index === 0;
                return (
                  <div
                    key={crop}
                    className={`rounded-xl p-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                      isTop
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <p className="font-bold text-gray-800 text-base mb-2">
                      {isTop ? "👑 " : ""}
                      {crop.toUpperCase()}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>🌱 <span className="font-medium">Variety:</span> {info.variety || "-"}</p>
                      <p>⏱ <span className="font-medium">Duration:</span> {info.duration || "-"}</p>
                      <p>💧 <span className="font-medium">Water:</span> {info.water || "-"}</p>
                      <p>💰 <span className="font-medium">Profit:</span> {info.profit || "-"}</p>
                      <p>✅ <span className="font-medium">Benefits:</span> {(info.benefits || []).join(", ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
