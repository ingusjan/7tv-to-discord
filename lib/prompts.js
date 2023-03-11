import inquirer from "inquirer";

// Ask the user for the 7TV emote set ID
export const promptForEmoteSetId = async () => {
  const { emoteSetId } = await inquirer.prompt([
    {
      type: "input",
      name: "emoteSetId",
      message: "What is the 7TV emote set ID?",
    },
  ]);

  return emoteSetId.trim();
};

// Ask the user which emotes they want to import
export const promptForEmotesToImport = async (emotes) => {
  const { emotesToImport } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "emotesToImport",
      message:
        "Which emotes do you want to import? (We'll resize & convert them for you)",
      choices: emotes.map((emote) => ({
        name: emote.name,
        value: emote,
      })),
    },
  ]);

  return emotesToImport;
};

// Ask the user how many emotes they want to import from an emote set
export const promptForEmoteCountLimit = async () => {
  const { emoteCountLimit } = await inquirer.prompt([
    {
      type: "input",
      name: "emoteCountLimit",
      message: "How many emotes do you want to import?",
      default: 9999,
    },
  ]);

  return emoteCountLimit;
};

// Ask the user if they want to import a specific emote or an emote set
export const promptForEmoteOrEmoteSet = async () => {
  const { emoteOrEmoteSet } = await inquirer.prompt([
    {
      type: "list",
      name: "emoteOrEmoteSet",
      message: "Do you want to import a specific emote or an emote set?",
      choices: [
        {
          name: "Specific emote",
          value: "emote",
        },
        {
          name: "Emote set",
          value: "emoteSet",
        },
      ],
    },
  ]);

  return emoteOrEmoteSet;
};
