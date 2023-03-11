import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import gifwrap from "gifwrap";

const downloadImage = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data, "binary");
};

const isWebpAnimated = async (buffer) => {
  const identifier = await sharp(buffer)
    .metadata()
    .then(({ format }) => format);

  if (identifier !== "webp") {
    return false;
  }

  const webpInfo = await sharp(buffer)
    .webp({
      animation: true,
    })
    .toBuffer({ resolveWithObject: true })
    .catch(() => null);

  return !!webpInfo && webpInfo.pages && webpInfo.pages.length > 1;
};

const convertWebpToJpgOrGif = async (url, name) => {
  const imageBuffer = await downloadImage(url);
  const isAnimated = await isWebpAnimated(imageBuffer);
  const imageType = isAnimated ? "gif" : "jpg";
  const outputName = `${name}.${imageType}`;
  const outputPath = path.join(process.cwd(), "convertedFrom7TV", outputName);

  if (isAnimated) {
    const gif = new gifwrap.Gif();
    const { pages } = await sharp(imageBuffer)
      .webp({ animation: true })
      .toBuffer({ resolveWithObject: true });

    pages.forEach((page) => {
      gif.addFrame(page.data, {
        delay: page.duration,
        width: 128,
        height: 128,
      });
    });

    const gifBuffer = await gif.build();
    fs.writeFileSync(outputPath, gifBuffer);
  } else {
    const jpgBuffer = await sharp(imageBuffer)
      .resize(128, 128, { fit: "inside" })
      .jpeg()
      .toBuffer();

    fs.writeFileSync(outputPath, jpgBuffer);
  }

  console.log(`Converted and saved ${name} to ${outputPath}`);
};

export const convertAllEmotesAndSaveToDownloads = async (emotes) => {
  const downloadFolder = path.join(process.cwd(), "convertedFrom7TV");

  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
  }

  await Promise.all(
    emotes.map(({ name, id, url }) => convertWebpToJpgOrGif(url, name))
  );
};
