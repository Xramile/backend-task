// .env
import 'dotenv/config';
// db connect
import { connect } from 'models/database';
connect();

// serve app
import app from './app';

const PORT = process.env.PORT || 3000;

// start the Express server
app.listen(PORT, () => {
  console.log(`server listen at http://localhost:${PORT}/`);
});
