let numeroBorderoLiberado = null
        let quantidadeTitulosBorderoLiberado = null

        cy.wait('@endPointInformacaoBorderoLiberado').then((interception) =>{
            numeroBorderoLiberado = interception.response.body.codigo;
            quantidadeTitulosBorderoLiberado = interception.response.body.operacoes[0].qtdeRecebiveis;           
            console.log("NUMERO BORDERO LIBERADO", numeroBorderoLiberado);
            console.log("QUANTIDADE DE TITULOS BORDERO",quantidadeTitulosBorderoLiberado);
            cy.wrap(numeroBorderoLiberado).as('numeroBorderoLiberado');
            cy.wrap(quantidadeTitulosBorderoLiberado).as('quantidadeTitulosBorderoLiberado');
        })
               
        cy.wait(3000);
        cy.get('[id="bt-estornar"]').should('be.visible');

cy.get('.grid-voltar').click();
        cy.get('#menu-lateral-COBRANCA').click();
        cy.get('#item-menu-1 > span').click();
        cy.get('#btn-card-1 > .card-titulo-texto').click();
        cy.get('#bt-filtrar-titulos').click();
        cy.get('#select-empresa-carteira > .w-select > .w-select-input').click();
        cy.get('[ng-reflect-label="PROPRIA - Securitizadora Mathe"] > .check-multiple').click();
        cy.get('.mat-checkbox-inner-container').click();

        cy.get('@numeroBorderoLiberado').then((numero) => {
            cy.get('#mat-chip-list-3').type(numero);
            console.log("NUMERO BORDERO LIBERADO", numero);
        });
        cy.get('.wb-row > :nth-child(2) > w-button > .btn').click();
        cy.intercept('POST','https://dnew-api.wba.com.br:30082/api/v1/private/buscar/lancamentos/agrupados').as('endPointGestaoCobrancaLancamentos');
        cy.get('#mat-tab-content-1-0 > div > conteudo-titulos-abertos > div.pb100.ng-star-inserted > div:nth-child(1) > box-informacoes > section > div.btn__mostrarMais.ng-star-inserted > button').click();
        cy.wait('@endPointGestaoCobrancaLancamentos').then((interception)=>{
            const quantidadeTitulosGestaoCobranca = interception.response.body.length;
            console.log("endpoint QUANTIDADE LANÇAMENTOS",quantidadeTitulosGestaoCobranca);
            
            cy.get('@quantidadeTitulosBorderoLiberado').then((numero) => {
                if (numero == quantidadeTitulosGestaoCobranca ){
                    assert.isTrue(true, 'Todos os títulos do borderô chegaram no Gestão de lançamentos');  
                    } else {
                        assert.isTrue(false, 'Não chegaram todos os títulos da operação no Gestão de lançamentos');
                    }               
            });

        }) 
        //cy.log('Todos os campos obrigatórios foram preenchidos. Cadastro concluído com sucesso.');
        
        //cy.screenshot('conclusao_operacao'); // Captura no final do processo
        
