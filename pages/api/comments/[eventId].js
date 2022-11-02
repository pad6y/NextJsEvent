import {
  connectDatabase,
  insertDocument,
  getFilteredEvents,
} from '../../../helpers/db-util';

async function handler(req, res) {
  const { eventId } = req.query;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: 'error connecting to database' });
    return;
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      !text.trim() === ''
    ) {
      res.status(422).json({ message: 'invalid inputs' });
      client.close();
      return;
    }

    const newComment = {
      eventId,
      email,
      name,
      text,
    };

    let result;
    try {
      result = await insertDocument(client, 'comments', newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: 'comment added' });
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed' });
    }
  }

  if (req.method === 'GET') {
    try {
      const foundComments = await getFilteredEvents(
        client,
        'comments',
        { eventId },
        { _id: -1 }
      );
      res.status(200).json({
        comments: foundComments,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get filtered comments' });
    }
  }
  client.close();
}

export default handler;
