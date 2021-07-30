module.exports = {
  name: 'giveany',
  description: 'adds any role to a member',
  execute(message, args, role) {
    console.log(role);
    message.guild.roles
      .fetch(role)
      .then((r) => {
        console.log(`The role color is: ${r.color}`);
        console.log(`The role name is: ${r.name}`);
        let member = message.mentions.members.first();
        if (member != undefined) {
          console.log('member=' + member);
          member.roles.add(r).catch(console.error);
        } else {
          message.channel.send('You cannot give a role to a user that is either bot or undefined');
        }
      })
      .catch((error) => {
        console.error(error);
        message.channel.send('Could not find given role: ' + args[1]);
      });
  },
};
