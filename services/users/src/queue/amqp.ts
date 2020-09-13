import EventEmitter from 'events';
import amqp, {Connection, Channel, Message} from 'amqplib';

const AMQP_HOSTNAME = process.env.AMQP_HOSTNAME ?? 'localhost';
const AMQP_QUEUE_NAME = process.env.AMQP_QUEUE_NAME ?? 'users';

export abstract class MessageBus extends EventEmitter {
  #connection: Connection|null = null;
  #channel: Channel|null = null;
  #enabled = false;

  readonly #queueName: string;
  readonly #queueType: 'producer'|'consumer';

  onConnect = (): void => {
    console.log('consumer connected');
    this.emit('connected');
  }

  onDisconnect = (): void => {
    console.log('consumer disconnected');
    this.emit('disconnected');
  }

  onMessage(messsage: Message|null) {
    if (messsage !== null) {
      this.#channel?.ack(messsage);
    }
  }

  send(message: string|Buffer): void {
    this.#channel?.sendToQueue(this.#queueName, Buffer.from(message));
  }

  protected onOpen = async (channel: Channel) => {
    await channel.assertQueue(this.#queueName);
    switch (this.#queueType) {
      case 'producer':
        console.log('producer ready to send messages...');
        break;
      case 'consumer':
        console.log('consumer ready for messages...');
        await channel.consume(this.#queueName, this.onMessage);
        break;
    }
  }

  protected constructor(options: {enabled?: boolean, name?: string, type?: 'producer'|'consumer'} = {enabled: true}) {
    super();
    const {enabled = true, name = AMQP_QUEUE_NAME, type} = options;
    if (!type) {
      throw new TypeError('options.type must be defined with either: (producer|consumer)');
    }
    this.#queueType = type;
    this.#queueName = name;
    this.#enabled = enabled;
    if (enabled) {
      amqp.connect(`amqp://${AMQP_HOSTNAME}`)
        .then(async (conn) => {
          try {
            this.#connection = conn;
            this.onConnect();
            const channel = await conn.createChannel();
            this.#channel = channel;
            this.emit('channel:open', channel);
          } catch (e) {
            this.emit('error', e);
          } finally {
            this.emit('initialized');
          }
        })
        .catch((e) => this.emit('error', e));
    } else {
      this.emit('initialized');
    }
    setImmediate(() => this.onDisconnect());
    this.on('channel:open', (channel: Channel) => this.onOpen(channel))
  }
}
