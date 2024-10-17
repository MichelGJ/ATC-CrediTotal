import { envs } from '../../config';
import { MongoDatabase, UserModel } from '../mongo';
import { seedData } from './data';


(async()=> {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  })

  await main();


  await MongoDatabase.disconnect();
})();


const randomBetween0AndX = ( x: number ) => {
  return Math.floor( Math.random() * x );
}



async function main() {

  // 0. Borrar todo!
  await Promise.all([
    UserModel.deleteMany(),
   
  ])


  // 1. Crear usuarios
  const users = await UserModel.insertMany( seedData.users );

  console.log('SEEDED');


}
