class CreateClienteUseCase {
  constructor(clienteService) {
    this.clienteService = clienteService;
  }

  async execute(data) {
    return await this.clienteService.create(data);
  }
}

module.exports = CreateClienteUseCase;
