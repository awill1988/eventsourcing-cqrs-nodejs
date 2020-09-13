import {MessageBus} from './amqp';

export class Producer extends MessageBus {
  constructor(options: {enabled: boolean, name?: string} = {enabled: true}) {
    super({...options, type: 'producer'});
  }
}

export default (options: {enabled: boolean, name?: string} = {enabled: true}) => new Producer(options);
