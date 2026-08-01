import { ApiResponse } from './api-response';

describe('ApiResponse', () => {
  it('should support the error-filter constructor signature', () => {
    const response = new ApiResponse(null, 'Erro', 400);

    expect(response.sucesso).toBe(true);
    expect(response.mensagem).toBe('Erro');
    expect(response.dados).toBeNull();
    expect(response.statusCode).toBe(400);
  });
});
