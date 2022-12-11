import { Chat } from './Chat';
import { Usuario } from './Usuario';

export class Conversa {
	public id: number;
	public data: Date;
	public usuario: Usuario;
	public chat: Chat;
	public conteudo: string;
  public img: string;

}
