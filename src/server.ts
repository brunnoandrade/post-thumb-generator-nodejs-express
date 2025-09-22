import express, { Request, Response } from "express";
import nodeHtmlToImage from "node-html-to-image";
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

        const result = await nodeHtmlToImage({
          html,
          type: "png",
          quality: 100,
          puppeteerArgs: {
            defaultViewport: {
              width: 1200,
              height: 630,
              deviceScaleFactor: 1,
            },
          },
        });

        const buffer = Buffer.isBuffer(result)
          ? result
          : Buffer.from(result as string, "binary");

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
