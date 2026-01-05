class ClienteService {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async create(cliente) {
    return await this.clienteRepository.create(cliente);
  }
}

module.exports = ClienteService;
