import axios from "axios";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

export async function convertAllEmotesAndSaveToDownloads(emotes) {
  const { saveFolder } = await inquirer.prompt({
    type: "input",
    name: "saveFolder",
    message: `Where do you want to save the ${
      emotes.length > 1 ? "emotes" : "emote"
    }?`,
    default: "7TVToDiscord",
  });

  const saveFolderPath = path.resolve(process.cwd(), saveFolder);

  try {
    await fs.promises.access(saveFolderPath, fs.constants.F_OK);
  } catch (error) {
    await fs.promises.mkdir(saveFolderPath, { recursive: true });
    console.log(`Created folder ${saveFolderPath}`);
  }

  console.log(`Saving images to ${saveFolderPath}`);

  for (const emote of emotes) {
    const gifUrl = `${emote.url}2x.gif`;
    const jpgUrl = `${emote.url}2x.png`;

    try {
      const response = await axios({
        url: gifUrl,
        method: "GET",
        responseType: "arraybuffer",
      });
      const imageData = response.data;
      await saveImageToFile(saveFolderPath, `${emote.name}.gif`, imageData);
      console.log(`Successfully downloaded ${emote.name}.gif`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const response = await axios({
            url: jpgUrl,
            method: "GET",
            responseType: "arraybuffer",
          });
          const imageData = response.data;
          await saveImageToFile(saveFolderPath, `${emote.name}.jpg`, imageData);
          console.log(`Successfully downloaded ${emote.name}.jpg`);
        } catch (error) {
          console.log(`Failed to download ${emote.name} with error: ${error}`);
        }
      } else {
        console.log(`Failed to download ${emote.name} with error: ${error}`);
      }
    }
  }
}

async function saveImageToFile(saveFolderPath, fileName, imageData) {
  const filePath = path.join(saveFolderPath, fileName);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, imageData, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
