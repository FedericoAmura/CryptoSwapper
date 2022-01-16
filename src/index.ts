import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import config from './config';
import { createSwapperServer } from './routes/swapper';

const PORT: number = config.get('port');
const appServer = createSwapperServer();

appServer.use(helmet());
appServer.use(bodyParser.json());
appServer.use(cors());

appServer.listen(PORT, () => {
  console.log(`⚡️[server]: Swapper is running at http://localhost:${PORT}`);
});
