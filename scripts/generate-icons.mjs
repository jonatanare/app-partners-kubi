import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "logo-kubi.png");

async function generate() {
  // 1. favicon.ico — embeds 16, 32, 48
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((s) => sharp(SRC).resize(s, s).png().toBuffer())
  );
  const icoBuffer = await pngToIco(pngBuffers);
  writeFileSync(path.join(ROOT, "src", "app", "favicon.ico"), icoBuffer);
  console.log("✓ src/app/favicon.ico");

  // 2. src/app/icon.png (32x32) — Next.js App Router special file
  await sharp(SRC)
    .resize(32, 32)
    .png()
    .toFile(path.join(ROOT, "src", "app", "icon.png"));
  console.log("✓ src/app/icon.png");

  // 3. src/app/apple-icon.png (180x180) — Next.js App Router special file
  await sharp(SRC)
    .resize(180, 180)
    .png()
    .toFile(path.join(ROOT, "src", "app", "apple-icon.png"));
  console.log("✓ src/app/apple-icon.png");

  // 4. public/icons/icon-192.png (PWA)
  mkdirSync(path.join(ROOT, "public", "icons"), { recursive: true });
  await sharp(SRC)
    .resize(192, 192)
    .png()
    .toFile(path.join(ROOT, "public", "icons", "icon-192.png"));
  console.log("✓ public/icons/icon-192.png");

  // 5. public/icons/icon-512.png (PWA)
  await sharp(SRC)
    .resize(512, 512)
    .png()
    .toFile(path.join(ROOT, "public", "icons", "icon-512.png"));
  console.log("✓ public/icons/icon-512.png");

  // 6. public/icons/apple-touch-icon.png (180x180)
  await sharp(SRC)
    .resize(180, 180)
    .png()
    .toFile(path.join(ROOT, "public", "icons", "apple-touch-icon.png"));
  console.log("✓ public/icons/apple-touch-icon.png");

  // 7. public/favicon.png (32x32) — fallback for metadata
  await sharp(SRC)
    .resize(32, 32)
    .png()
    .toFile(path.join(ROOT, "public", "favicon.png"));
  console.log("✓ public/favicon.png");

  console.log("\nAll icons generated successfully.");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
