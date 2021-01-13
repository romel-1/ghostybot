module.exports = {
  name: "removeroleall",
  aliases: ["rrall", "rroleall", "takeroleall"],
  description: "remove a role from all users of the current server",
  category: "admin",
  botPermissions: ["MANAGE_ROLES"],
  memberPermissions: ["MANAGE_ROLES"],
  requiredArgs: ["role"],
  async execute(bot, message, args) {
    const lang = await bot.utils.getGuildLang(message.guild.id);
    const role = await bot.findRole(message, args.join(" "));

    if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(lang.ROLES.MY_ROLE_NOT_HIGH_ENOUGH.replace("{role}", role.name));
    }

    if (message.member.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(lang.ROLES.YOUR_ROLE_MUST_BE_HIGHER.replace("{role}", role.name));
    }

    if (!role) {
      return message.channel.send(lang.REACTIONS.NO_ROLE);
    }

    message.guild.members.cache.forEach((member) => member.roles.remove(role));

    message.channel.send(lang.ADMIN.REMOVED_ROLE_EVERYONE.replace("{roleName}", role.name));
  },
};
