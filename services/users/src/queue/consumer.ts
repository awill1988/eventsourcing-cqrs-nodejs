import {MessageBus} from './amqp';
import {Message} from 'amqplib';
import {appendTo, deleteStream} from "@/store";

export enum UserCommands {
  Create = 'CreateUser',
  Delete = 'DeleteUser',
  Patch = 'PatchUser',
}

export enum UserEvents {
  Created = 'UserCreated',
  Patched = 'UserPatched',
  Deleted = 'UserDeleted',
}

export class Consumer extends MessageBus {
  constructor(options: {enabled: boolean, name?: string} = {enabled: true}) {
    super({...options, type: 'consumer'});
  }

  onMessage = async (message: Message|null) => {
    super.onMessage(message);
    if (message !== null) {
      const {content} = message;
      const {command, data} = JSON.parse(content.toString());
      switch (command) {
        case UserCommands.Create: {
          await Promise.all([
            appendTo('users', UserEvents.Created, {id: data.id}, data.id),
            // In case we need to delete, we can't really store the body
            appendTo(`users-${data.id}`, UserEvents.Created, data, data.id)
          ]);
          break;
        }
        case UserCommands.Delete:
          await appendTo('users', UserEvents.Deleted, {id: data.id}, data.id)
          await deleteStream(`users-${data.id}`)
          break;
        case UserCommands.Patch:
          await Promise.all([
            appendTo('users', UserEvents.Patched, data, data.id),
            appendTo(`users-${data.id}`, UserEvents.Patched, data, data.id)
          ]);
          break;
      }
    }
  }
}

export default (options: {enabled: boolean, name?: string} = {enabled: true}) => new Consumer(options);
