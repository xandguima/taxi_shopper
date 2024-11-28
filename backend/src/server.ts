import {app} from './app'

app.listen({
  port: 8080,
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    console.log("error",err);
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});