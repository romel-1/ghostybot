import { hyperlink } from "@discordjs/builders";
import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class OwoCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "anime",
      name: "owo",
      description: "OwO",
    });
  }

  async validate(): Promise<ValidateReturn> {
    return { ok: true };
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    const data = await fetch("https://rra.ram.moe/i/r?type=owo").then((res) => res.json());

    const link = hyperlink(
      lang.IMAGE.CLICK_TO_VIEW,
      `https://cdn.ram.moe/${data.path.replace("/i/", "")}`,
    );

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setDescription(link)
      .setImage(`https://cdn.ram.moe/${data.path.replace("/i/", "")}`);

    await interaction.reply({ embeds: [embed] });
  }
}