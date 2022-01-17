import config from './config';
import app from './routes/App';

const PORT: number = config.get('port');

app.listen(PORT, () => {
  console.log(`⚡️[server]: API is running at http://localhost:${PORT}`);
});
