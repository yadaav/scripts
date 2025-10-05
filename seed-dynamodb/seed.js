const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const REGION = process.env.AWS_REGION || 'us-east-1';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'products';
const STOCK_TABLE = process.env.STOCK_TABLE || 'stock';

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

async function seed() {
  const products = [
    { id: uuidv4(), title: 'Blue T-Shirt', description: 'Comfortable cotton tee', price: 1999 },
    { id: uuidv4(), title: 'Wireless Mouse', description: 'Ergonomic mouse', price: 2999 },
    { id: uuidv4(), title: 'Coffee Mug', description: 'Ceramic mug 350ml', price: 799 }
  ];

  for (const p of products) {
    await ddb.send(new PutCommand({ TableName: PRODUCTS_TABLE, Item: p }));
    // give each product some stock
    const stock = { product_id: p.id, count: Math.floor(Math.random() * 10) + 1 };
    await ddb.send(new PutCommand({ TableName: STOCK_TABLE, Item: stock }));
    console.log('Inserted', p.id, p.title, 'stock:', stock.count);
  }
  console.log('Seeding complete.');
}

seed().catch(err => { console.error(err); process.exit(1); });
