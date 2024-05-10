const Discord = require('discord.js')
const db = require('quick.db')
const axios = require("axios");
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');

module.exports = {
	name: 'support',
	aliases: [],
	run: async (client, message, args, prefix, color) => {

		let perm = ""
		message.member.roles.cache.forEach(role => {
			if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true
			if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
			if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
		})
		if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true) {

            const embed = new Discord.MessageEmbed()
            embed.setTitle(`Besoin D'aide ?`)
            embed.setURL('https://discord.gg/9ZfB8m5E88')
            embed.setColor(color)
            embed.setDescription(`Pour Rejoindre Le Serveur Support [Clique ICI](https://discord.gg/9ZfB8m5E88)`)
            embed.setTimestamp()
            embed.setFooter(`${message.guild.name}`)

            message.channel.send(embed)

        }
    }
}
