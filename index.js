const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [
  new SlashCommandBuilder()
    .setName('active-dev-badge')
    .setDescription('Start your 24hr Active Developer Badge timer!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering PUBLIC slash command...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Public slash command registered');

    client.once('ready', async () => {
      console.log(`Logged in as ${client.user.tag}`);
      
      // Set bot's status
      client.user.setActivity('chill with manish', { type: 3 }); // Type 3 is "Watching"
      
      // Set bot's about me with watermark
      const watermark = "صُــنــع بــواســطــة @9a22 | بـوت شــارة الــمــطــور الـنـشـط | احــصــل عــلــى شــارة الــمــطــور الــنــشــط عــلــى ديــســكــورد";
      
      // Function to ensure watermark stays
      const ensureWatermark = async () => {
        try {
          await client.application.edit({
            description: watermark
          });
        } catch (error) {
          console.error('Failed to update application description:', error);
        }
      };

      // Set initial watermark
      await ensureWatermark();
      
      // Check and reset watermark every 5 minutes
      setInterval(ensureWatermark, 5 * 60 * 1000);
    });

  

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName !== 'active-dev-badge') return;

      const userId = interaction.user.id;
      let userTimers = {};
      
      // Read existing timers
      try {
        userTimers = JSON.parse(fs.readFileSync('./userTimers.json'));
      } catch (error) {
        console.error('Error reading timer file:', error);
      }

      const now = Date.now();
      let future;
      let timeLeft;

      // Check if user already has an active timer
      if (userTimers[userId] && userTimers[userId] > now) {
        future = userTimers[userId];
        timeLeft = `<t:${Math.floor(future / 1000)}:R>`;
      } else {
        // Set new timer
        future = now + 24 * 60 * 60 * 1000;
        timeLeft = `<t:${Math.floor(future / 1000)}:R>`;
        userTimers[userId] = future;
        
        // Save to file
        fs.writeFileSync('./userTimers.json', JSON.stringify(userTimers, null, 2));
      }

    const embed = new EmbedBuilder() // منسق الكود
   .setAuthor({
    name: "شــارة الــمــطــور الـنـشـط عــلــى ديـســكــورد",
    iconURL: "https://cdn.discordapp.com/emojis/1040325165512396830.webp?size=64&quality=lossless",
   })
   .setTitle("🎉 تــم تــشــغــيــل الأمــر بــنــجــاح!")
   .setColor("#34DB98")
   .setDescription(
    "🔗 **الــخــطــوة الأخــيــرة:**\n" +
    "• اذهــب إلــى: https://discord.com/developers/active-developer\n" +
    "• احــصــل عــلــى شــارتــك مــن هــنــاك\n\n" +
    "⏱️ **مــلاحــظــة:** قــد يــســتــغــرق الــتــحــقــق حــتــى ٢٤ ســاعــة\n\n" +
    "🌐 **ســيــرفــر الــصــانــع:**\n" +
    "• https://discord.gg/mg0"
   )
   .setFooter({
    text: "صُــنــع بــواســطــة @9a22",
    iconURL: "https://cdn.discordapp.com/attachments/1354635316098764994/1402470997625671752/455a2d65ae98c00af4733bc2a34e323b.jpg?ex=68940866&is=6892b6e6&hm=caa901d948a2a3bb6cc1d090a59c59044492c50d279c55e3377d0cb30f8b73c9&",
   });
  
  console.log();
  slashSpinner.succeed(chalk.bold.green("🎉 Command executed successfully!"));
  console.log();
  console.log(chalk.bold.green("✅ All operations completed!"));
  console.log(chalk.bold("🌐 Go to: ") + chalk.cyan.underline("https://discord.com/developers/active-developer"));
  console.log(chalk.bold("🏆 And claim your badge!"));
  console.log();
  console.log(chalk.yellow("💡 Tip: ") + "Verification may take up to 24 hours");
  console.log("═".repeat(60));
  
  await interaction.reply({ embeds: [embed] });
 }
});

