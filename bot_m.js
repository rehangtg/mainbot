const { Client, MessageEmbed, Message } = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Client();

const token = 'ODIzMDg0MTE2MzkwOTY5MzY0.YFbq0Q.nyPJULUWmYM1VW2TJNI6OBK8O7U';
var PREFIX = '.';
const { Player } = require('discord-player');
const player = new Player(bot);

bot.player = player;
bot.on('ready', () => {
  console.log('Bot Online');
  bot.user
    .setActivity('Raihan', {
      type: 'WATCHING',
    })
    .catch(console.error);
});

bot.on('message', (msg) => {
  if (msg.content === '.Hai') {
    msg.reply('Hello tod');
  }
  if (msg.content === '.hai') {
    msg.reply('Iya Halo jg anj');
  }
  if (msg.content === '.author') {
    msg.reply('Raihan Rama');
  }
  if (msg.content === '.ping') {
    msg.reply('pong!');
  }
  if (msg.content === '.help') {
    msg.reply('Command \n-Author\n-Versi');
  }
  if (msg.content === '.versi') {
    msg.reply('1.0.1');
  }
});

bot.on('message', async (msg) => {
  args = msg.content.slice(PREFIX.length).trim().split(/ +/g);
  command = args.shift().toLowerCase();
  if (msg.content === '.play') {
    execute(message, queue.get(message.guild.id));
    let track = await bot.player.play(msg.member.voice.channel, args[0], msg.member.user.tag);
    msg.channel.send('Currently Playing ${track.name}! - Requested by ${track.requestedBy');
  }
  if (msg.content === '.stop') {
    execute(message, queue.get(message.guild.id));
    let track = await bot.player.stop(msg.guild.id);
    msg.channel.send('STOPPED');
  }
});

const serverQueue = queue.get(message.guild.id);
const queue = new Map();
async function execute(message, serverQueue) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('join ples');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('izin');
  }
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
  return message.channel.send(`${song.title} !`);
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');

  if (!serverQueue) return message.channel.send('There is no song that I could stop!');

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
bot.login(token);
