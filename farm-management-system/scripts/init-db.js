/**
 * init-db.js
 * 
 * Script to initialize the database with sample data
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Initializing database with sample data...');

  // Create sample fields
  const field1 = await prisma.farm_fields.create({
    data: {
      name: 'North Field',
      location: 'North side of the farm',
      size: 25.5,
      soil_type: 'Clay loam',
      crop_history: [
        { year: 2022, crop: 'Corn' },
        { year: 2021, crop: 'Soybeans' }
      ]
    }
  });

  const field2 = await prisma.farm_fields.create({
    data: {
      name: 'South Field',
      location: 'South side of the farm',
      size: 18.3,
      soil_type: 'Sandy loam',
      crop_history: [
        { year: 2022, crop: 'Wheat' },
        { year: 2021, crop: 'Corn' }
      ]
    }
  });

  console.log(`Created fields: ${field1.name}, ${field2.name}`);

  // Create sample crops
  const crop1 = await prisma.farm_crops.create({
    data: {
      name: 'Corn',
      variety: 'Sweet Corn',
      planting_date: new Date('2023-04-15'),
      harvest_date: new Date('2023-09-15'),
      field_id: field1.id,
      status: 'Planted',
      notes: 'Planted with new precision planter'
    }
  });

  const crop2 = await prisma.farm_crops.create({
    data: {
      name: 'Soybeans',
      variety: 'Round-Up Ready',
      planting_date: new Date('2023-05-01'),
      harvest_date: new Date('2023-10-01'),
      field_id: field2.id,
      status: 'Planted',
      notes: 'Increased seeding rate this year'
    }
  });

  console.log(`Created crops: ${crop1.name}, ${crop2.name}`);

  // Create sample equipment
  const equipment1 = await prisma.farm_equipment.create({
    data: {
      name: 'Tractor',
      type: 'Tractor',
      manufacturer: 'John Deere',
      model: '8R 410',
      purchase_date: new Date('2020-01-15'),
      status: 'Operational',
      maintenance: [
        { date: '2023-01-10', type: 'Oil Change', notes: 'Regular maintenance' },
        { date: '2022-07-15', type: 'Tire Replacement', notes: 'Replaced rear tires' }
      ]
    }
  });

  const equipment2 = await prisma.farm_equipment.create({
    data: {
      name: 'Planter',
      type: 'Planter',
      manufacturer: 'John Deere',
      model: 'DB60',
      purchase_date: new Date('2021-03-20'),
      status: 'Operational',
      maintenance: [
        { date: '2023-03-01', type: 'Calibration', notes: 'Pre-season calibration' },
        { date: '2022-10-10', type: 'Cleaning', notes: 'Post-season cleaning' }
      ]
    }
  });

  console.log(`Created equipment: ${equipment1.name}, ${equipment2.name}`);

  console.log('Database initialization complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 