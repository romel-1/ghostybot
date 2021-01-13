import Command from "../../structures/Command";
import Bot from "../../structures/Bot";
import { Message } from "discord.js";

export default class RemindersCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "reminders",
      description: "All your active reminders",
      category: "reminder",
    });
  }

  async execute(bot: Bot, message: Message, args: string[]) {
    const lang = await bot.utils.getGuildLang(message.guild?.id);
    const member = await bot.utils.findMember(message, args, true);

    if (!member) {
      return message.channel.send(lang.ADMIN.PROVIDE_VALID_MEMBER);
    }
    const user = await bot.utils.getUserById(member.user.id, message.guild?.id);
    if (!user) return;

    console.log(user);
    

    if (!user.reminder.hasReminder === true) {
      return message.channel.send(lang.REMINDER.NO_ACTIVE_REM);
    }

    const mappedReminders = user.reminder.reminders.map((reminder) => {
      return `**${lang.REMINDER.MESSAGE}** ${reminder.msg}
**${lang.REMINDER.TIME}** ${reminder.time}
**${lang.MEMBER.ID}:** ${reminder.id}`;
    });

    const embed = bot.utils
      .baseEmbed(message)
      .setTitle(lang.REMINDER.USER_REMINDERS.replace("{memberUsername}", member.user.username))
      .setDescription(mappedReminders.join("\n\n"));

    return message.channel.send(embed);
  }
}
