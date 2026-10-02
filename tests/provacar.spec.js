const { test } = require('@playwright/test');
const { ProvaCarPage } = require('../pages/ProvaCarPage');

test.describe('Teste Simples - Cadastro ProvaCar', () => {

  test('Deve realizar o preenchimento do veículo e salvar', async ({ page }) => {
    const provaCar = new ProvaCarPage(page);

    await provaCar.acessarEIniciar();
    await provaCar.cadastrarVeiculo();

    // Pausa para visualizar o envio na interface antes de encerrar
    await page.waitForTimeout(3000);
  });

});