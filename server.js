import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public 폴더 정적 제공
app.use(express.static(path.join(__dirname, "public")));

// 자동 다운로드 라우트
app.get("/download", async (req, res) => {
  try {
    const { edit, type, classnum, ext } = req.query;

    if (!edit || !type || !classnum || !ext) {
      return res.status(400).send("❌ Missing query params");
    }

    // HTTPS + User-Agent
    const fileUrl = `https://www.selectzone.co.kr/school_data/sch149/${edit}/${type}/${classnum}_${ext}.jpg`;

    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return res.status(404).send("❌ File not found on origin server");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${classnum}_${ext}.jpg"`);
    res.setHeader("Content-Type", "image/jpeg");

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error");
  }
});

// Render 환경 포트
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
