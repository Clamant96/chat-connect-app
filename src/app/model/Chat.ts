import { Conversa } from './Conversa';
import { Usuario } from './Usuario';

export class Chat {
	public id: number;
	public nome: string;
	public tipo: string;
	public img: string;
	public conversas: Conversa[];
	public usuarios: Usuario[];
}
