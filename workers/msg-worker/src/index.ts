import { connectToDB } from './db';
import { initConsumers } from './kafka/worker';

function main() {
  connectToDB();
  initConsumers();
}

main();
