import { hyperlink } from "@discordjs/builders";
import * as DJS from "discord.js";
import Bot from "structures/Bot";

export async function poke(
  bot: Bot,
  interaction: DJS.CommandInteraction,
  lang: typeof import("@locales/english").default,
) {
  const user = interaction.options.getUser("user") ?? interaction.user;
  const poked = interaction.user.id === user.id ? "themselves" : user.username;

  const data = await bot.neko.sfw.poke();
  const link = hyperlink(lang.IMAGE.CLICK_TO_VIEW, data.url);

  const embed = bot.utils
    .baseEmbed(interaction)
    .setTitle(`${interaction.user.username} ${lang.IMAGE.POKED} ${poked}`)
    .setDescription(link)
    .setImage(data.url);

  await interaction.reply({ embeds: [embed] });
}