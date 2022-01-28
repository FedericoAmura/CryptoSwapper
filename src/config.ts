import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port'
  },
  swapper: {
    offerTime: {
      doc: 'The time an offer will be valid since creation',
      format: Number,
      default: 30 * 1000, // 30 seconds
    },
    fees: {
      buy: {
        doc: 'The percentage fee Belo will add on every buying swap',
        format: Number,
        default: 2,
      },
      sell: {
        doc: 'The percentage fee Belo will add on every buying swap',
        format: Number,
        default: 2,
      },
    },
  },
  okex: {
    url: {
      doc: 'Okex API base url',
      format: String,
      default: 'https://www.okex.com',
    },
    simulatedTrading: {
      doc: 'Okex API simulated trading flag',
      format: String,
      default: '1',
    },
    accessKey: {
      doc: 'Okex API access key',
      format: String,
      default: '',
    },
    accessPassphrase: {
      doc: 'Okex API access passphrase',
      format: String,
      default: '',
    },
    secretKey: {
      doc: 'OKX API secret key',
      format: String,
      default: '',
    },
  },
  postgres: {
    user: {
      doc: 'The postgres database user',
      format: String,
      default: 'postgres',
      env: 'POSTGRES_USER',
    },
    password: {
      doc: 'The postgres database password',
      format: String,
      default: 'postgres',
      env: 'POSTGRES_PASSWORD',
    },
    port: {
      doc: 'The postgres database port',
      format: Number,
      default: 5432,
    },
    host: {
      doc: 'The postgres database hostname',
      format: String,
      default: 'postgres',
    },
  },
});

const env: string = config.get('env');
config.loadFile(`./src/config/${env}.json`);
config.validate({allowed: 'strict'});

export default config;
