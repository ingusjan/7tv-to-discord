import chalkAnimation from "chalk-animation";
import chalk from "chalk";

// Handy function to sleep for a given amount of time.
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export const onWelcome = async () => {
  const rainbowTitle = chalkAnimation.rainbow("7TV to Discord v1.0");

  // Stop the rainbow animation after 2 seconds.
  await sleep();
  rainbowTitle.stop();

  console.log(chalk.bold("Welcome to the 7TV to Discord Emote Importer Tool"));
  console.log(
    chalk.gray(
      "If you have any issues, please report them to the GitHub repository."
    )
  );
  console.log("");
  console.log(
    chalk.magentaBright.bold(
      "📺 Created by Optrix (https://twitch.tv/optrixtv)"
    )
  );
  console.log("");
};
