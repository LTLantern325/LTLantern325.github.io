import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// 자동 다운로드
app.get("/download", async (req, res) => {
  try {
    const { edit, type, classnum, ext } = req.query;

    if (!edit || !type || !classnum || !ext) {
      return res.status(400).send("❌ Missing query params");
    }

    // selectzone 실제 이미지 URL
    const fileUrl = `http://www.selectzone.co.kr/school_data/sch149/${edit}/${type}/${classnum}_${ext}.jpg`;

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return res.status(404).send("❌ File not found on origin server");
    }

    // 자동 다운로드 헤더
    res.setHeader("Content-Disposition", `attachment; filename="${classnum}_${ext}.jpg"`);
    res.setHeader("Content-Type", "image/jpeg");

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
