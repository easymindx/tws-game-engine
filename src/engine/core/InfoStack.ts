import { InfoStackMessage } from './InfoStackMessage';
import { IWorldEntity } from '../interfaces/IWorldEntity';
import { EntityType } from '../enums/EntityType';
import { World } from '../world/World';

export class InfoStack implements IWorldEntity {
  public updateOrder = 3;
  public entityType: EntityType = EntityType.System;
  public networkId = -1;

  public messages: InfoStackMessage[] = [];
  public entranceAnimation = 'animate__slideInLeft';
  public exitAnimation = 'animate__backOutDown';

  public messageDuration = 3;

  public addMessage(text: string): void {
    const messageElement = document.createElement('div');
    messageElement.classList.add(
      'console-message',
      'animate__animated',
      this.entranceAnimation
    );
    messageElement.style.setProperty('--animate-duration', '0.3s');
    const textElement = document.createTextNode(text);
    messageElement.appendChild(textElement);
    document.getElementById('console').prepend(messageElement);
    this.messages.push(new InfoStackMessage(this, messageElement));
  }

  public update(timeStep: number): void {
    for (const message of this.messages) {
      message.update(timeStep);
    }
  }

  public addToWorld(_world: World): void {
    throw new Error('InfoStack: addToWorld not implemented');
  }

  public removeFromWorld(_world: World): void {
    throw new Error('InfoStack: removeFromWorld not implemented');
  }
}
