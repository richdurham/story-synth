import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Starting database seed...");

  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);

    // Seed game roles
    console.log("👥 Seeding game roles...");
    const roles = [
      ["regent", "Regent", "The ruler of the land, responsible for major decisions"],
      ["treasury", "Treasury Minister", "Manages the kingdom's finances and resources"],
      ["military", "Military Commander", "Oversees the kingdom's defense and military operations"],
      ["diplomat", "Chief Diplomat", "Handles foreign relations and negotiations"],
    ];

    for (const [roleId, name, description] of roles) {
      await connection.execute(
        "INSERT INTO game_roles (roleId, name, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)",
        [roleId, name, description]
      );
    }
    console.log(`✅ Seeded ${roles.length} roles`);

    // Seed game issues
    console.log("⚠️  Seeding game issues...");
    const issues = [
      [
        "northern_border",
        "The Northern Border Dispute",
        "Tensions are rising at the northern border. A neighboring kingdom has been making territorial claims. How should the kingdom respond?",
        "Militarism",
        "active",
      ],
      [
        "trade_crisis",
        "Trade Crisis",
        "A major trade partner has imposed tariffs on your goods, threatening the kingdom's economy. What action should be taken?",
        "Economy",
        "archived",
      ],
      [
        "plague_outbreak",
        "Plague Outbreak",
        "A mysterious illness is spreading through the kingdom's major cities. Resources are needed to combat it. How should the kingdom allocate funds?",
        "Health",
        "archived",
      ],
    ];

    for (const [issueId, title, description, type, status] of issues) {
      await connection.execute(
        "INSERT INTO game_issues (issueId, title, description, type, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), type=VALUES(type), status=VALUES(status)",
        [issueId, title, description, type, status]
      );
    }
    console.log(`✅ Seeded ${issues.length} issues`);

    // Seed game variables
    console.log("📊 Seeding game variables...");
    const variables = [
      ["treasury_level", "Treasury Level", "The kingdom's financial reserves", 50, 0, 100],
      ["militarism_level", "Militarism Level", "The kingdom's military strength and aggression", 30, 0, 100],
      ["diplomacy_level", "Diplomacy Level", "The kingdom's diplomatic standing", 60, 0, 100],
      ["public_morale", "Public Morale", "The general happiness and support of the population", 55, 0, 100],
    ];

    for (const [variableId, name, description, currentValue, minValue, maxValue] of variables) {
      await connection.execute(
        "INSERT INTO game_variables (variableId, name, description, currentValue, `minValue`, `maxValue`) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), currentValue=VALUES(currentValue), `minValue`=VALUES(`minValue`), `maxValue`=VALUES(`maxValue`)",
        [variableId, name, description, currentValue, minValue, maxValue]
      );
    }
    console.log(`✅ Seeded ${variables.length} variables`);

    // Initialize game state
    console.log("🎮 Initializing game state...");
    await connection.execute(
      "INSERT INTO game_state (currentIssueId, round, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE currentIssueId=VALUES(currentIssueId), round=VALUES(round), status=VALUES(status)",
      ["northern_border", 1, "active"]
    );
    console.log("✅ Game state initialized");

    console.log("🎉 Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
