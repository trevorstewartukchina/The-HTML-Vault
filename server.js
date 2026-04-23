const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "PASTE_YOUR_GEMINI_API_KEY_HERE";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-image-preview";

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Twirly Product Photo Corrector</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f5f6fa;
      color: #1f2937;
    }
    .wrap {
      max-width: 1220px;
      margin: 0 auto;
      padding: 24px;
    }
    .title {
      margin-bottom: 20px;
    }
    .title h1 {
      margin: 0 0 8px;
      font-size: 32px;
    }
    .title p {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }
    .layout {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
    }
    .card {
      background: #fff;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.08);
    }
    h2, h3 {
      margin-top: 0;
    }
    .field {
      margin-bottom: 14px;
    }
    label {
      display: block;
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 7px;
    }
    input[type="text"],
    textarea,
    select {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      padding: 12px;
      font-size: 14px;
      background: #fff;
    }
    textarea {
      min-height: 110px;
      resize: vertical;
      line-height: 1.5;
    }
    .hint {
      font-size: 12px;
      color: #6b7280;
      margin-top: 5px;
      line-height: 1.5;
    }
    .btns {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    button {
      border: 0;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
    .primary {
      background: #111827;
      color: white;
    }
    .secondary {
      background: #eef2f7;
      color: #111827;
    }
    .danger {
      background: #fee2e2;
      color: #991b1b;
    }
    .stage {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .pane {
      background: #fff;
      border-radius: 18px;
      padding: 16px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.08);
      min-height: 560px;
      display: flex;
      flex-direction: column;
    }
    .image-box {
      flex: 1;
      min-height: 470px;
      border: 2px dashed #d1d5db;
      border-radius: 16px;
      background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 10px;
    }
    .image-box img {
      max-width: 100%;
      max-height: 520px;
      object-fit: contain;
      display: block;
    }
    .placeholder {
      color: #6b7280;
      text-align: center;
      line-height: 1.6;
      font-size: 14px;
      padding: 20px;
    }
    .status {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .ok {
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #065f46;
    }
    .warn {
      background: #fffbeb;
      border-color: #fde68a;
      color: #92400e;
    }
    .error {
      background: #fef2f2;
      border-color: #fecaca;
      color: #991b1b;
    }
    .small-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
      .stage { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">
      <h1>Twirly Product Photo Corrector</h1>
      <p>Upload a rough nail image and turn it into a clean white-background commercial product photo.</p>
    </div>

    <div class="layout">
      <div class="card">
        <h2>Controls</h2>

        <div class="field">
          <label for="productType">Product type</label>
          <input id="productType" type="text" value="press-on nail set" />
        </div>

        <div class="field">
          <label for="styleNotes">Style match notes</label>
          <textarea id="styleNotes">Match previous catalogue images for alignment, spacing, angle, soft studio lighting, scale, white balance, subtle natural shadow, premium beauty feel, and clean ecommerce consistency. The output should look like part of the same product range.</textarea>
        </div>

        <div class="field">
          <label for="extraPrompt">Correction rules</label>
          <textarea id="extraPrompt">The uploaded image may be messy, badly lit, low quality, slightly tilted, off-centre, or inconsistent. Correct the composition, centre the product, clean the background to pure white (#FFFFFF), improve clarity, keep the true nail design, preserve realistic shape, preserve realistic colour, keep premium material texture, and avoid a fake CGI look.</textarea>
        </div>

        <div class="field">
          <label for="aspectRatio">Aspect ratio</label>
          <select id="aspectRatio">
            <option value="1:1">1:1</option>
            <option value="4:5">4:5</option>
            <option value="3:4">3:4</option>
          </select>
        </div>

        <div class="field">
          <label for="imageInput">Upload rough image</label>
          <input id="imageInput" type="file" accept="image/*" />
          <div class="hint">Use a rough source photo. It does not need to be neat.</div>
        </div>

        <div class="btns">
          <button class="primary" id="generateBtn">Generate corrected image</button>
          <button class="secondary" id="resetPromptBtn">Reset prompt</button>
          <button class="danger" id="clearBtn">Clear</button>
        </div>

        <div id="status" class="status">Ready.</div>
      </div>

      <div class="stage">
        <div class="pane">
          <h3>Input</h3>
          <div class="image-box" id="inputBox">
            <div class="placeholder">Upload a rough nail image here.</div>
          </div>
        </div>

        <div class="pane">
          <h3>Output</h3>
          <div class="image-box" id="outputBox">
            <div class="placeholder">Your corrected commercial image will appear here.</div>
          </div>
          <div class="small-actions">
            <button class="secondary" id="downloadBtn" disabled>Download</button>
            <button class="secondary" id="openBtn" disabled>Open in new tab</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const els = {
      productType: document.getElementById("productType"),
      styleNotes: document.getElementById("styleNotes"),
      extraPrompt: document.getElementById("extraPrompt"),
      aspectRatio: document.getElementById("aspectRatio"),
      imageInput: document.getElementById("imageInput"),
      generateBtn: document.getElementById("generateBtn"),
      resetPromptBtn: document.getElementById("resetPromptBtn"),
      clearBtn: document.getElementById("clearBtn"),
      inputBox: document.getElementById("inputBox"),
      outputBox: document.getElementById("outputBox"),
      status: document.getElementById("status"),
      downloadBtn: document.getElementById("downloadBtn"),
      openBtn: document.getElementById("openBtn")
    };

    const defaultStyle = "Match previous catalogue images for alignment, spacing, angle, soft studio lighting, scale, white balance, subtle natural shadow, premium beauty feel, and clean ecommerce consistency. The output should look like part of the same product range.";
    const defaultExtra = "The uploaded image may be messy, badly lit, low quality, slightly tilted, off-centre, or inconsistent. Correct the composition, centre the product, clean the background to pure white (#FFFFFF), improve clarity, keep the true nail design, preserve realistic shape, preserve realistic colour, keep premium material texture, and avoid a fake CGI look.";

    let uploadedFile = null;
    let inputDataUrl = "";
    let outputDataUrl = "";

    function setStatus(message, type = "") {
      els.status.className = ("status " + type).trim();
      els.status.textContent = message;
    }

    function clearOutput() {
      outputDataUrl = "";
      els.outputBox.innerHTML = '<div class="placeholder">Your corrected commercial image will appear here.</div>';
      els.downloadBtn.disabled = true;
      els.openBtn.disabled = true;
    }

    function readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function buildPrompt() {
      return [
        "Transform the uploaded rough image into a professional commercial ecommerce product photo.",
        "",
        "Product type: " + (els.productType.value.trim() || "press-on nail set") + ".",
        "",
        "Main objective:",
        "- Start from a rough, messy, imperfect source image.",
        "- Produce a polished premium beauty product image on a pure white background (#FFFFFF).",
        "- Make the product look aligned and in-sync with previous catalogue photos.",
        "",
        "Requirements:",
        "- Keep the real nail design faithful to the source image.",
        "- Preserve realistic shape, proportions, texture, and colour.",
        "- Correct tilt, weak framing, poor lighting, low sharpness, and visual inconsistency.",
        "- Centre the composition.",
        "- Use soft premium studio lighting.",
        "- Add only subtle natural shadow.",
        "- Remove clutter and distractions.",
        "- Do not make the result look fake, warped, or overly AI-generated.",
        "",
        "Catalogue consistency notes:",
        els.styleNotes.value.trim(),
        "",
        "Extra correction rules:",
        els.extraPrompt.value.trim()
      ].join("\\n");
    }

    els.imageInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      uploadedFile = file;
      inputDataUrl = await readFileAsDataURL(file);
      els.inputBox.innerHTML = '<img src="' + inputDataUrl + '" alt="Input preview" />';
      clearOutput();
      setStatus("Image loaded.");
    });

    els.generateBtn.addEventListener("click", async () => {
      if (!uploadedFile) {
        setStatus("Please upload an image first.", "warn");
        return;
      }

      try {
        els.generateBtn.disabled = true;
        clearOutput();
        setStatus("Generating corrected image...", "warn");

        const formData = new FormData();
        formData.append("image", uploadedFile);
        formData.append("prompt", buildPrompt());
        formData.append("aspectRatio", els.aspectRatio.value);

        const response = await fetch("/generate", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Generation failed.");
        }

        if (!data.imageDataUrl) {
          throw new Error("No image returned from server.");
        }

        outputDataUrl = data.imageDataUrl;
        els.outputBox.innerHTML = '<img src="' + outputDataUrl + '" alt="Corrected output" />';
        els.downloadBtn.disabled = false;
        els.openBtn.disabled = false;
        setStatus("Success. Corrected image generated.", "ok");
      } catch (err) {
        setStatus("Generation failed.\\n\\n" + err.message, "error");
      } finally {
        els.generateBtn.disabled = false;
      }
    });

    els.downloadBtn.addEventListener("click", () => {
      if (!outputDataUrl) return;
      const a = document.createElement("a");
      a.href = outputDataUrl;
      a.download = "corrected-product-photo.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    els.openBtn.addEventListener("click", () => {
      if (!outputDataUrl) return;
      window.open(outputDataUrl, "_blank");
    });

    els.resetPromptBtn.addEventListener("click", () => {
      els.styleNotes.value = defaultStyle;
      els.extraPrompt.value = defaultExtra;
      setStatus("Prompt reset.");
    });

    els.clearBtn.addEventListener("click", () => {
      uploadedFile = null;
      inputDataUrl = "";
      outputDataUrl = "";
      els.imageInput.value = "";
      els.styleNotes.value = defaultStyle;
      els.extraPrompt.value = defaultExtra;
      els.inputBox.innerHTML = '<div class="placeholder">Upload a rough nail image here.</div>';
      clearOutput();
      setStatus("Ready.");
    });
  </script>
</body>
</html>`);
});

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
      return res.status(500).json({
        error: "Please add GEMINI_API_KEY as an environment variable."
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const prompt = req.body.prompt || "";
    const aspectRatio = req.body.aspectRatio || "1:1";

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype || "image/png";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      },
      imageConfig: {
        aspectRatio,
        imageSize: "2K"
      }
    };

    const apiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(500).json({
        error: data?.error?.message || "Gemini API request failed."
      });
    }

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part) => part.inlineData && part.inlineData.data);
    const textPart = parts.find((part) => part.text);

    if (!imagePart) {
      return res.status(500).json({
        error: textPart?.text || "Gemini returned no image."
      });
    }

    const outputMime = imagePart.inlineData.mimeType || "image/png";
    const imageDataUrl = `data:${outputMime};base64,${imagePart.inlineData.data}`;

    return res.json({
      success: true,
      imageDataUrl
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown server error."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
