require('dotenv').config();
const { readFile } = require('fs/promises');
const connectDB = require('./db/connect');
const Job = require('./models/Job');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await Job.deleteMany();

    const jsonData = JSON.parse(await readFile('./mock-data.json'));

    await Job.create(jsonData);
    console.log('Success!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
