const mongoose = require('mongoose');
const dns = require('dns');
const fs = require('fs');

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function test() {
  try {
    const start = Date.now();
    await mongoose.connect('mongodb+srv://dv4401921_db_user:Deeksha%40543@cluster0.jjzdz4q.mongodb.net/?appName=Cluster0');
    fs.writeFileSync('log.txt', 'Connected! ' + (Date.now() - start) + 'ms');
  } catch (e) {
    fs.writeFileSync('log.txt', String(e.stack || e.message));
  }
}
test();
