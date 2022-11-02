import { connectDatabase, insertDocument } from '../../../helpers/db-util';

async function handler(req, res) {
  if (req.method === 'POST') {
    const email = req.body.email;

    if (!email || !email.includes('@')) {
      res.status(422).json({ message: 'failed invalid address' });
      return;
    }

    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'error connecting to database' });
      return;
    }

    try {
      await insertDocument(client, 'emails', { email });
      client.close();
    } catch (error) {
      return res.status(500).json({ message: 'Inserting data failed' });
    }
    return res.status(201).json({ message: 'email recieved' });
  }
}
export default handler;
