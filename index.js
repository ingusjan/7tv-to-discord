#!/usr/bin/env node

import { createSpinner } from "nanospinner";
import { fetchAllEmotesFromSet } from "./lib/7tv.js";
import { onWelcome } from "./lib/generic.js";
import { convertAllEmotesAndSaveToDownloads } from "./lib/image-processing.js";
import { promptForEmoteSetId, promptForEmotesToImport } from "./lib/prompts.js";

const config = {
  defaultEmoteSet: "61a91d43e9684edbbc38007c",
  emoteCountLimit: 9999,
};

let emoteSetId = config.defaultEmoteSet;

// Welcome
console.clear();
await onWelcome();

// If the user hasn't set a default emote set, prompt them for one
if (!config.defaultEmoteSet) {
  emoteSetId = await promptForEmoteSetId();
}

// Fetch the emotes from 7TV
const spinner = createSpinner(
  `Fetching your emotes (Set: ${emoteSetId})...`
).start();

const { emotes, emoteSetName } = await fetchAllEmotesFromSet(
  emoteSetId,
  config.emoteCountLimit
);

if (!emotes) {
  spinner.error("Failed to fetch emotes. Start the script to try again.");
  process.exit(1);
}
spinner.success({
  text: `Fetched ${emotes.length} emotes from ${emoteSetName}.`,
});

const emotesToImport = await promptForEmotesToImport(emotes);
// console.log(emotesToImport);
await convertAllEmotesAndSaveToDownloads(emotesToImport);
