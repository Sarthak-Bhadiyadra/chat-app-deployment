// Import modules seeder files here.
import { nsql_db } from '../../Utils/Database/db.client';
import { seedUsers } from './User';

async function seed() {
    await seedUsers();
}

seed()
    .then((out) => console.log('Seeding done. Details: ', out))
    .catch((err) => console.error('Seeding Exception. Details: ', err));
