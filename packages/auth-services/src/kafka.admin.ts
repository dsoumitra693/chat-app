import { kafka } from './config/kafka.config';

async function init() {
  const admin = kafka.admin();
  console.log('Admin connecting...');
  admin.connect();
  console.log('Adming Connection Success...');

  console.log('Creating Topics');
  await admin.createTopics({
    topics: [
      {
        topic: 'account.create',
        numPartitions: 1,
      },
      {
        topic: 'account.update',
        numPartitions: 1,
      },
    ],
  });
  console.log('Topics Created Success');

  console.log('Disconnecting Admin..');
  await admin.disconnect();
}

init();
