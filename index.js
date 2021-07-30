const Discord = require('discord.js');

const token = 'ODIzMDg0MTE2MzkwOTY5MzY0.YFbq0Q.hjK56EhUTbckcAorA4TUbpRB9yA';
const prefix = '.';
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const config = require('./config.json');
const search = require('youtube-search');
const queue = new Map();
const fs = require('fs');
const { Player } = require('discord-player');
const opts = {
  maxResults: 25,
  key: config.YOUTUBE_API,
  type: 'video',
};

// bot.player = player;
// client.once('ready', () => {
//console.log('Bot Online');
//bot.user
//.setActivity('ur ducK', {
//     type: 'WATCHING',
//   })
//  .catch(console.error);
// });

client.once('ready', () => {
  console.log('bot ready beb');
  client.user.setActivity('MINE 💛 NGODING 🖥️', {
    ///client.user.setActivity('Maintenance ⛔'){
    //  type: 'PLAYING',
  });
});
// }).catch(console.error);
// });
// const dl = require('discord.lib');
// dl.client.on('ready', () => {
// dl.client.user.setActivity(`I am serving ${client.users.size}`);
// });

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.once('connecting', () => {
  console.log('Connecting');
});
//client.on('message', (message) => {
//  if (message.content.startsWith(prefix + 'tes')) {
//    message.channel.send('Gabisa Akses harus ambil Role dulu');
//    client.channels.cache.get('824215659021205505').send('please test ${message.author}!');
//    const
//  }
//});

//client.on = new Discord.Collection();
//const commandFiles = fs.readdirSync('/commands/').filter((file) => file.endsWith('.js'));

//for (const file of commandFiles) {
//const command = require(`/commands/${file}`);
//client.commands.set(command.name, command);
//}

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  console.log(args);

  const command = args.shift().toLowerCase();

  if (command == 'giveany') {
    const role = args[1].slice(3, args[1].length - 1);
    client.commands.get('giveany').execute(message, args, role);
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith('.leave')) {
    if (message.guild.me.voice.channel) {
      message.guild.me.voice.channel.leave();
      message.reply('Makasii uda make akuuuu <3');
    } else {
      message.reply('Aku lagi ga join voice sapa sapa beb <3');
    }
  } else if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith('.join')) {
    const channel = client.channels.cache.get('624924031694667786');
    if (!channel) return console.error('Channel tidak terdeteksi');
    channel
      .join()
      .then((connection) => {
        // Yay, it worked!
        console.log('Berhasil Join');
      })
      .catch((e) => {
        console.error(e);
      });
  } else if (message.content === '.spam') {
    message.reply('jan spam biar aku aja yg spam <3');
  } else if (message.content === '.bot stress') {
    message.reply('Kau lebih stress syg');
  } else if (message.content === '.hai') {
    message.reply('Iya Halo jg syg ❤️');
  } else if (message.content === '.author') {
    message.reply('Raihan ✨');
  } else if (message.content === '.ping') {
    message.reply('pong!');
  } else if (message.content === '.help') {
    message.reply('Command \n-Author\n-Versi');
  } else if (message.content === '.versi') {
    message.reply('1.0.1');
  } else if (message.content === '.update') {
    message.reply('1.0.2');
  } else if (message.content === '.Han') {
    message.reply('kgn? ga kgn sama aku !!!');
  } else if (message.content === '.sosmed') {
    message.reply('Sosmed \n-IG @raiihanahmd\n-FB Raihan\n-GitHub xxhanz');
  } else if (message.content === '.pagi') {
    message.reply('Pagi juga ❤️');
  } else if (message.content === '.siang') {
    message.reply('Siang beb 💚');
  } else if (message.content === '.malam') {
    message.reply('Malam juga syg 💛');
  }
  //} else {
  // message.channel.reply('Salah Command tod');
  // return;
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === prefix + 'song') {
    let embed = new Discord.MessageEmbed().setColor('#73ffdc').setDescription('Cepet tulis judul lagu dibawah blokk.').setTitle('Raihan lagi mikir....');
    let embedMsg = await message.channel.send(embed);
    let filter = (m) => m.author.id === message.author.id;
    let query = await message.channel.awaitMessages(filter, { max: 1 });
    let results = await search(query.first().content, opts).catch((err) => console.log(err));
    if (results) {
      let youtubeResults = results.results;
      let i = 0;
      let titles = youtubeResults.map((result) => {
        i++;
        return i + ') ' + result.title;
      });
      console.log(titles);
      message.channel
        .send({
          embed: {
            title: 'Select which song you want by typing the number',
            description: titles.join('\n'),
          },
        })
        .catch((err) => console.log(err));

      filter = (m) => m.author.id === message.author.id && m.content >= 1 && m.content <= youtubeResults.length;
      let collected = await message.channel.awaitMessages(filter, { max: 1 });
      let selected = youtubeResults[collected.first().content - 1];

      embed = new Discord.MessageEmbed().setTitle(`${selected.title}`).setURL(`${selected.link}`).setDescription(`${selected.description}`).setThumbnail(`${selected.thumbnails.default.url}`);

      message.channel.send(embed).catch((err) => console.log(err));
      return;
    }
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('Kamu harus masuk voice channel dlu tod!');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} Sudah req lagu ini sabar yaaaa <3`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return message.channel.send('Mau ngeSkip apa beb <3 ?');
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');

  if (!serverQueue) return message.channel.send('Mau ngeStop apa syg <3 ?');

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);
