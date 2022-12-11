import { Figurinha } from './Figurinha';
import { Chat } from './Chat';
import { Conversa } from './Conversa';

export class Usuario {
	public id: number;
	public username: string;
	public password: string;
	public img: string;
	public conversas: Conversa[];
	public chats: Chat[];
  public figurinha: Figurinha[];

}
