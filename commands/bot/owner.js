const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');

module.exports = {
	name: 'owner',
	aliases: [],
	run: async (client, message, args, prefix, color) => {

		if (client.config.owner.includes(message.author.id)) {

//##############################################################################################################################################################

			if (args[0] === "add") {
				let member = client.users.cache.get(message.author.id);
				if (args[1]) {
					member = client.users.cache.get(args[1]);
				} else {
					return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)

				}
				if (message.mentions.members.first()) {
					member = client.users.cache.get(message.mentions.members.first().id);
				}
				if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
				if (db.get(`ownermd_${client.user.id}_${member.id}`) === true) {
					return message.channel.send(`**${member.tag}** est déjà présent dans la liste owner`)
				}

				db.set(`ownermd_${client.user.id}_${member.id}`, true)

				message.channel.send(`**${member.tag}** est maintenant dans la liste owner`)

//##############################################################################################################################################################

			} else if (args[0] === "clear") {
				let tt = await db.all().filter(data => data.ID.startsWith(`ownermd_${client.user.id}`));
				message.channel.send(`**${tt.length === undefined||null ? 0:tt.length}** ${tt.length > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} des owners`)


				let delowner = 0;
				for (let i = 0; i < tt.length; i++) {
					db.delete(tt[i].ID);
					delowner++;
				}

//##############################################################################################################################################################

			} else if (args[0] === "remove") {

				if (args[1]) {
					let member = client.users.cache.get(message.author.id);
					if (args[1]) {
						member = client.users.cache.get(args[1]);
					} else {
						return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)

					}
					if (message.mentions.members.first()) {
						member = client.users.cache.get(message.mentions.members.first().id);
					}
					if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
					if (db.get(`ownermd_${client.user.id}_${member.id}`) === null) return message.channel.send(`**${member.tag}** n'est pas présent dans la liste owner`)
					db.delete(`ownermd_${client.user.id}_${member.id}`)
					message.channel.send(`**${member.tag}** n'est plus dans la liste owner`)
				}

//##############################################################################################################################################################

			} else if (args[0] === "list") {


				let money = db.all().filter(data => data.ID.startsWith(`ownermd_${client.user.id}`)).sort((a, b) => b.data - a.data)

				let p0 = 0;
				let p1 = 5;
				let page = 1;

				const embed = new Discord.MessageEmbed()
					.setTitle('Owner')
					.setDescription(money
						.filter(x => client.users.cache.get(x.ID.split('_')[2]))
						.map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
						.slice(0, 5)

					)
					.setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 5)} • ${client.config.name}`)
					.setColor(color)


				message.channel.send(embed).then(async tdata => {
					if (money.length > 5) {
						const B1 = new MessageButton()
							.setLabel("◀")
							.setStyle("gray")
							.setID('owner1');

						const B2 = new MessageButton()
							.setLabel("▶")
							.setStyle("gray")
							.setID('owner2');

						const bts = new MessageActionRow()
							.addComponent(B1)
							.addComponent(B2)
						tdata.edit("", {
							embed: embed,
							components: [bts]
						})
						setTimeout(() => {
							tdata.edit("", {
								components: [],
								embed: new Discord.MessageEmbed()
									.setTitle('Owner')
									.setDescription(money
										.filter(x => client.users.cache.get(x.ID.split('_')[2]))
										.map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
										.slice(0, 5)

									)
									.setFooter(`1/${Math.ceil(money.length === 0?1:money.length / 5)} • ${client.config.name}`)
									.setColor(color)


							})
							// message.channel.send(embeds)
						}, 60000 * 5)
						client.on("clickButton", (button) => {
							if (button.clicker.user.id !== message.author.id) return;
							if (button.id === "owner1") {
								button.reply.defer(true)

								p0 = p0 - 5;
								p1 = p1 - 5;
								page = page - 1

								if (p0 < 0) {
									return
								}
								if (p0 === undefined || p1 === undefined) {
									return
								}


								embed.setDescription(money
										.filter(x => client.users.cache.get(x.ID.split('_')[2]))
										.map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
										.slice(p0, p1)

									)
									.setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 5)} • ${client.config.name}`)
								tdata.edit(embed);

							}
							if (button.id === "owner2") {
								button.reply.defer(true)

								p0 = p0 + 5;
								p1 = p1 + 5;

								page++;

								if (p1 > money.length + 5) {
									return
								}
								if (p0 === undefined || p1 === undefined) {
									return
								}


								embed.setDescription(money
										.filter(x => client.users.cache.get(x.ID.split('_')[2]))
										.map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
										.slice(p0, p1)

									)
									.setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 5)} • ${client.config.name}`)
								tdata.edit(embed);

							}
						})
					}
				})
			}
		}
	}
}
