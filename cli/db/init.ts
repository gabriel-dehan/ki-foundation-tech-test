import connection from 'config/data-source';
// import { seedApplication } from 'test/seeds/seed';

(async () => {
  process.stdout.write('Establishing connection... ');
  connection.initialize().then(async () => {
    process.stdout.write('\x1b[32mOK\x1b[39m\x1b[0m\n');

    process.stdout.write('Dropping database... ');
    await connection.dropDatabase();
    process.stdout.write('\x1b[32mOK\x1b[39m\x1b[0m\n');

    process.stdout.write('Running migrations... ');
    await connection.runMigrations();
    process.stdout.write('\x1b[32mOK\x1b[39m\x1b[0m\n');

    // process.stdout.write('Database populate... ');
    // await seedApplication(connection);
    // process.stdout.write('\x1b[32mOK\x1b[39m\x1b[0m\n');

    process.stdout.write('Closing setup connection... ');
    await connection.destroy();
    process.stdout.write('\x1b[32mOK\x1b[39m\x1b[0m\n');
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
