import express, { Request, Response } from "express";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import path from "path";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/generate-cover", async (req: Request, res: Response) => {
  const { title, author, date, tags } = req.query;

  try {
    const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

    res.render(
      "cover",
      { title, author, date, tags: tagsArray.slice(0, 3) },
      async (err, html) => {
        if (err || !html) {
          return res.status(500).send("Erro ao renderizar HTML");
        }

        const browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
          ],
          executablePath: await chromium.executablePath(),
          headless: true,
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const element = await page.$(".card");
        if (!element) {
          await browser.close();
          return res.status(500).send("Elemento .card não encontrado");
        }

        const buffer = await element.screenshot({ type: "png" });
        await browser.close();

        res.set("Content-Type", "image/png");
        res.send(buffer);
      }
    );
  } catch (error: any) {
    res.status(500).send("Erro ao gerar thumbnail: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
