class ProvaCarPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Seletores Iniciais
    this.btnComecar = page.locator('button.btn-popup');
    this.btnNovoModelo = page.locator('#botaoNovoVeiculo');

    // Container do Modal
    this.modal = page.locator('#divIncluindoNovoModelo');

    // Seletores dos Campos do Formulário
    this.selectFabricante = page.locator('#novoFabricante');
    this.selectFamilia = page.locator('#novaFamilia');
    this.inputMolicar = page.locator('input[data-bind*="NovoModelo.Molicar"]');
    this.inputModelo = page.locator('input[data-bind*="NovoModelo.Modelo"]');
    this.selectCombustivel = page.locator('select[data-bind*="Combustivel"]');
    
    // Mapeamento exato dos campos com máscara
    this.inputPortas = page.locator('input[data-bind*="portaMask"], input[data-bind*="NovoModelo.Portas"]');
    this.inputAnoInicio = page.locator('input[data-bind*="anoVeiculoMask"], input[data-bind*="NovoModelo.AnoInicio"]');
    this.inputAnoFim = page.locator('input[data-bind*="NovoModelo.AnoFim"]');
    
    this.inputCilindradas = page.locator('input[data-bind*="NovoModelo.Cilindradas"]');
    this.inputCavalos = page.locator('input[data-bind*="NovoModelo.Cavalos"]');

    // Botão Salvar
    this.btnSalvar = page.locator('#btnSalvar');
  }

  async acessarEIniciar() {
    await this.page.goto('https://provaqa.fandi.com.br');
    await this.btnComecar.waitFor({ state: 'visible', timeout: 10000 });
    await this.btnComecar.click();
    await this.btnNovoModelo.waitFor({ state: 'visible', timeout: 10000 });
  }

  async preencherCampoComMascara(locator, valor) {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.click();
    await locator.clear();
    // Digita tecla por tecla para acionar o evento da máscara JavaScript
    await locator.pressSequentially(valor, { delay: 100 });
    await locator.dispatchEvent('change');
  }

  async cadastrarVeiculo() {
    // 1. Abre o modal
    await this.btnNovoModelo.click();
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Seleciona o Fabricante ("32" = CHEVROLET) e dispara evento de atualização
    await this.selectFabricante.selectOption('32', { timeout: 3000 }).catch(() => {});
    await this.selectFabricante.dispatchEvent('change');

    // 3. Seleciona a Família se disponível
    await this.selectFamilia.selectOption({ index: 1 }, { timeout: 2000 }).catch(() => {});

    // 4. Preenchimento de textos simples
    await this.inputMolicar.fill('12345');
    await this.inputModelo.fill('Carro Teste QA');

    // 5. Combustível
    if (await this.selectCombustivel.isVisible()) {
      await this.selectCombustivel.selectOption('GG').catch(() => {});
    }

    // 6. Preenchimento dos campos mascarados (Portas, Ano Início e Ano Fim)
    await this.preencherCampoComMascara(this.inputPortas, '4');
    await this.preencherCampoComMascara(this.inputAnoInicio, '2024');
    await this.preencherCampoComMascara(this.inputAnoFim, '2025');

    // 7. Demais campos numéricos
    await this.preencherCampoComMascara(this.inputCilindradas, '2000');
    await this.preencherCampoComMascara(this.inputCavalos, '150');

    // 8. Clique em Salvar
    await this.btnSalvar.click();
  }
}

module.exports = { ProvaCarPage };