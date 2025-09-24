import express, { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.get("/generate-cover", async (req: Request, res: Response) => {
  const { title, author, date, tags } = req.query;

  const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width, height);

  const borderSize = 12;
  const borderRadius = 24;

  ctx.fillStyle = "#c25fff";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, borderRadius);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(
    borderSize,
    borderSize,
    width - borderSize * 2,
    height - borderSize * 2,
    borderRadius - 4
  );
  ctx.fill();

  const padding = 48;
  const innerX = borderSize + padding;
  const innerY = borderSize + padding;
  const innerWidth = width - borderSize * 2 - padding * 2;

  ctx.fillStyle = "#222";
  ctx.font = "bold 92px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const words = String(title || "Título aqui").split(" ");
  let line = "";
  let y = innerY;

  const lineHeight = 110;

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > innerWidth && line !== "") {
      ctx.fillText(line, innerX, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, innerX, y);

  const footerY = height - borderSize - padding - 20;

  const svgLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 500 500" fill="#c25fff">
      <path d="M111.83,18.25v463.5H388.17V18.25Zm243,432.21H145.14V51.56H354.86Z"/>
      <path d="M320.48,82.09H181.22V420.38H320.48V292.73l-22-18.08,22-16.43Zm-48.34,291h-41V279.63l41-21.48Zm0-169.12-41,21.37.08-93.31h41Z"/>
    </svg>
  `;
  const svgBase64 = `data:image/svg+xml;base64,${Buffer.from(svgLogo).toString(
    "base64"
  )}`;
  const logoImg = await loadImage(svgBase64);

  ctx.drawImage(logoImg, innerX - 12, footerY - 25, 48, 48);

  ctx.font = "26px Arial";
  ctx.fillStyle = "#222";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${author || "Autor"} - ${date || "2025-09-23"}`,
    innerX + 40,
    footerY
  );

  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const tagGap = 12;
  let tagX = width - borderSize - padding;
  tagsArray
    .slice(0, 3)
    .reverse()
    .forEach((tag) => {
      const text = `#${tag}`;
      const metrics = ctx.measureText(text);
      const tagWidth = metrics.width + 24;
      const tagHeight = 40;

      ctx.fillStyle = "#eee";
      ctx.beginPath();
      ctx.roundRect(
        tagX - tagWidth,
        footerY - tagHeight / 2,
        tagWidth,
        tagHeight,
        8
      );
      ctx.fill();

      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      ctx.fillText(text, tagX - tagWidth / 2, footerY);

      tagX -= tagWidth + tagGap;
    });

  const buffer = canvas.toBuffer("image/png");
  res.set("Content-Type", "image/png");
  res.send(buffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
