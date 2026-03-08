import dns from 'dns';
import mongoose from 'mongoose';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://mouse:DlybqHL9Q1dYbD2m@cluster0.ilf7kdw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to MongoDB...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ Connected successfully!');
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  console.error('Full error:', err);
}
process.exit(0);
