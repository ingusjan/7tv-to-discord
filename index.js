#!/usr/bin/env node

import { createSpinner } from "nanospinner";
import { fetchAllEmotesFromSet, fetchSingularEmote } from "./lib/7tv.js";
import { onWelcome } from "./lib/generic.js";
import { convertAllEmotesAndSaveToDownloads } from "./lib/image-processing.js";
import {
  promptForEmoteCountLimit,
  promptForEmoteId,
  promptForEmoteOrEmoteSet,
  promptForEmoteSetId,
  promptForEmotesToImport,
} from "./lib/prompts.js";

let emoteId = "";
let emoteSetId = "";
let emoteCountLimit = 9999;

// Welcome messaging
console.clear();
await onWelcome();

const emoteOrEmoteSet = await promptForEmoteOrEmoteSet();

if (emoteOrEmoteSet === "emote") {
  emoteId = await promptForEmoteId();
  const spinner = createSpinner(`Fetching emote...`).start();
  const emote = await fetchSingularEmote(emoteId);

  if (!emote) {
    spinner.error({
      text: "Failed to fetch emote. Restart the script to try again.",
    });
    process.exit(1);
  }

  spinner.success({
    text: `Fetched ${emote.name} (${emote.url}).`,
  });

  await convertAllEmotesAndSaveToDownloads([emote]);
} else {
  emoteSetId = await promptForEmoteSetId();
  emoteCountLimit = await promptForEmoteCountLimit();

  // Fetch the emotes from a 7TV emote set
  const spinner = createSpinner(
    `Fetching your emotes (Set: ${emoteSetId})...`
  ).start();

  const { emotes, emoteSetName } = await fetchAllEmotesFromSet(
    emoteSetId,
    emoteCountLimit
  );

  if (!emotes || emotes.length < 1) {
    spinner.error({
      text: "Failed to fetch emotes. Restart the script to try again.",
    });
    process.exit(1);
  }
  spinner.success({
    text: `Fetched ${emotes.length} emotes from ${emoteSetName}.`,
  });

  const emotesToImport = await promptForEmotesToImport(emotes);
  await convertAllEmotesAndSaveToDownloads(emotesToImport);
}
