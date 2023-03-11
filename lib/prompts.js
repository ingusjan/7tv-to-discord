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
