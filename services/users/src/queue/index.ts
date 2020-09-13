import EventEmitter from 'events';
import initializeProducer, {Producer} from './producer';
import initializeConsumer, {Consumer} from './consumer';

interface IQueueOptions {
  producer?: boolean,
  consumer?: boolean,
}

class Queue extends EventEmitter {
  #producer: Producer;
  #consumer: Consumer;
  constructor(options: IQueueOptions = {}) {
    super();
    let producerEnabledAndReady = !(options.producer ?? true);
    let consumerEnabledAndReady = !(options.consumer ?? true);
    const waiter = setInterval(() => {
      if (producerEnabledAndReady && consumerEnabledAndReady) {
        this.emit('ready');
        clearInterval(waiter);
      }
    }, 100);
    this.#producer = initializeProducer({enabled: options.producer ?? true}).once('initialized', () => producerEnabledAndReady = true);
    this.#consumer = initializeConsumer({enabled: options.consumer ?? true}).once('initialized', () => consumerEnabledAndReady = true);
  }

  producer = () => this.#producer;

  consumer = () => this.#consumer;
}

export default new Queue();
