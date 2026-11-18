
const dns = require("node:dns");
const net = require("node:net");
const mongoose = require("mongoose");

const configureMongoDns = () => {
  const configuredServers = process.env.MONGO_DNS_SERVERS?.trim();
  if (!configuredServers) return;

  const servers = configuredServers.split(",").map((server) => server.trim());
  if (servers.some((server) => net.isIP(server) === 0)) {
    throw new Error(
      "MONGO_DNS_SERVERS must be a comma-separated list of DNS server IP addresses.",
    );
  }

  dns.setServers(servers);
};

const connectDB = async () => {
  try {
    configureMongoDns();
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    if (error.code === "ECONNREFUSED" && error.syscall === "querySrv") {
      console.error(
        "If your network DNS resolver refuses SRV records, set MONGO_DNS_SERVERS in .env (for example: 1.1.1.1,8.8.8.8).",
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
