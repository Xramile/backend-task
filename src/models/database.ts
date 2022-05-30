import mongoose from 'mongoose';

// init
const dbURL = process.env.DB_URI as unknown as string;

// Connect and listen
export const connect = () => {
  mongoose
    .connect(dbURL, {})
    .then(() => {
      console.log(`DB Connected.`);
    })
    .catch((err) => {
      console.log(`Mongoose default connection has occured ${err} error.`);
    });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected.');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose default connection is disconnected due to application termination.'
      );
      process.exit(0);
    });
  });
};
