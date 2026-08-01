export class ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T | null;
  timestamp: string;
  statusCode?: number;

  constructor(mensagem: string, dados: T | null = null, statusCode?: number) {
    this.sucesso = true;
    this.mensagem = mensagem;
    this.dados = dados;
    this.timestamp = new Date().toISOString();
    this.statusCode = statusCode;
  }
}