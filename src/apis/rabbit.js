// const {connect, Channel} = require('amqplib');
import {Connection, Exchange, Queue} from 'react-native-rabbitmq';

const config = {
  host: '',
  port: 5671,
  username:'',
  password:'',
  virtualhost:'/',
  ttl: 10000, // Message time to live,
  ssl: true, // Enable ssl connection, make sure the port is 5671 or an other ssl port
};

const RABBIT_HOST =
  'amqps://b-85b37609-43f6-4a72-a1b7-e486f4a8be86.mq.us-west-2.amazonaws.com:5671';

const generateCode = () => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/, '')
    .slice(0, 5);
};

const createRoom = async () => {
  // Generate a code
  let code = generateCode();

  // Connect to rabbit server
  // let open = connect(RABBIT_HOST);

  const rabbitServer = new Connection(config);

  rabbitServer.connect();

  rabbitServer.on('error', event => {
    console.log('eventoErro', event);
  });

  rabbitServer.on('connected', event => {
    // let exchange = new Exchange(rabbitServer, {
    //   name: code,
    //   type: 'fanout',
    //   durable: true,
    //   autoDelete: false,
    //   internal: false,
    // });
    // exchange.publish("hello");
    console.log('code', code);

    let queue = new Queue(rabbitServer, {
      name: 'queue_name',
      passive: false,
      durable: true,
      exclusive: false,
      consumer_arguments: {'x-priority': 1}
    }, {
      // queueDeclare args here like x-message-ttl
    });

    let exchange = new Exchange(rabbitServer, {
      name: 'exchange_name',
      type: 'direct',
      durable: true,
      autoDelete: false,
      internal: false
    });

    queue.bind(exchange, 'queue_name');
  });
};

export {createRoom};
