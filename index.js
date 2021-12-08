const Discord = require('discord.js');
const client = new Discord.Client();

DisTube = require('distube');

client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });

client.distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Teraz gram: \`${song.name}\` - \`${song.formattedDuration}\`\nWywołane przez: ${song.user}`
    ))

	.on("addSong", (message, queue, song) => message.channel.send(
        `Dodano: ${song.name} - \`${song.formattedDuration}\` do kolejki odtwarzania przez: ${song.user}`
    ))

const prefix = '!';

//--------------------------------------------------//

//const fs = require('fs');
//
//client.commands = new Discord.Collection();
//
//const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
//
//for(const file of commandFiles).
//{
//    const command = require(`./commands/${file}`);
//
//    client.commands.set(command.name, command);
//}
//
//--------------------------------------------------//

client.once('ready', () => 
{
    console.log('Bot online!');

    client.user.setActivity('Online 24/7! Created by Gkkf');

    //module.exports = async (client, message) =>
    //{
    //    const messageArray = message.content.split(' ');
    //    const cmd = messageArray[0];
    //    const args = messageArray.slice(1);
    //}
});

client.on('message', async message =>
{

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'play' || command === 'p')
    {
        if (!message.member.voice.channel) return message.channel.send('Musisz być na kanale głosowym, aby użyć tej komendy');

        const music = args.join(" ");

        if(!music) return;

        await client.distube.play(message, music);

    }
    else if(command === 'wyjazd')
    {
        if (!message.member.voice.channel) return message.channel.send('Musisz być na kanale głosowym, aby użyć tej komendy');
        client.distube.stop(message);
        message.channel.send("No dobra, już idę");
    }

    if(command === 'skip' || command === 's')
    {
        if (!message.member.voice.channel) return message.channel.send('Musisz być na kanale głosowym, aby użyć tej komendy');
        client.distube.skip(message);
    }

    if (command === 'loop')
    {
        if (!message.member.voice.channel) return message.channel.send('Musisz być na kanale głosowym, aby użyć tej komendy');
        client.distube.setRepeatMode(message, parseInt(args[0]));
        message.channel.send("Zapętlono!");
    }

    if (command == "kolejka") 
    {
        let queue = client.distube.getQueue(message);
        message.channel.send('Następne piosenki w kolejce:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if (command == "pomoc") 
    {
        message.channel.send(`
        *Komendy do użycia:*
            **!play / !p** - bot gra wybraną przez Ciebie muzykę.
            **!skip** - bot pomija utwór i puszcza następny.
            **!loop** - bot zapętla utwór.
            **!kolejka** - bot pokazuje kolejkę odtwarzania utworów.
            **!wyjazd** - bot wychodzi z kanału.
        `);
    }

});



client.login(process.env.token);