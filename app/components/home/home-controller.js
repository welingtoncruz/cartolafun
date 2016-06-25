materialAdmin
    .controller('homeCtrl', function($http, $state, $scope, $localStorage, API_URL) {
        
        $scope.init = function() {   
            $scope.teams = [];
            $scope.totalTimes = $localStorage.teams ? $localStorage.teams.length : 0;
            $scope.carregaMercado($localStorage.teams);
        };

        $scope.atualizaPontuados  = function(){
          $scope.getParciaisRodada().then(function(response) {
            var result = response.data;
            $scope.atletas_pontuados = result.atletas;
          }); 
        };

        $scope.recalculaPontos  = function(){
          $scope.getParciaisRodada().then(function(response) {
            var result = response.data;
            $scope.atletas_pontuados = result.atletas;
            $scope.atualizaPontosTimes();
          }); 
        };

        $scope.carregaMercado = function(teamSlugs) {
          $scope.getMercadoRodada().then(function(response) {

            var result = response.data;
            $scope.mercado_status = result.status_mercado;
            $scope.rodada_atual = result.rodada_atual;
            if ($scope.mercado_status == 2) {
              $scope.carregaPontuados(teamSlugs);
            } else {
              $scope.carregaTimes(teamSlugs);
            }            
          });
        };

        $scope.carregaTimes = function(times) {
          $.each(times, function(inc, team) {
            $scope.carregaInfoTeam(team.slug);
          });        
        };

        $scope.carregaPontuados = function(times) {
          $scope.getParciaisRodada().then(function(response) {
            var result = response.data;
            $scope.atletas_pontuados = result.atletas;
            $scope.carregaTimes(times);
          }); 
        };

        $scope.carregaInfoTeam = function(team_slug) {
          $scope.getAthletes(team_slug);
        };

        $scope.getMercadoRodada = function() {
          return $http.get(API_URL + "/load-api.php?api=mercado-status");
        };

        $scope.getParciaisRodada = function() {
            return $http.get(API_URL + "/load-api.php?api=parciais-atletas");
        };

        $scope.getAthletes = function(team_slug) {
            $http.get(API_URL + "/load-api.php?api=busca-atletas&team_slug="+team_slug).then(
                function(response) {
                  $scope.request = response.data;
                  var team = $scope.request.time;
                  
                  if (team) {
                    $scope.teams.push(team);
                    $scope.calcularPontos($scope.request, team);
                  }
              });
        };

        $scope.atualizaPontosTimes = function() {
          $.each($scope.teams, function(inc, team) {
            $scope.calcularPontos($scope.request, team);
          }); 
        };

        $scope.calcularPontos = function(request, team) {
          var mercado_status = $scope.mercado_status;  
          var rodada_atual = $scope.rodada_atual;
          // sem atletas, exibe mensagem de retorno da API
          if (typeof request.mensagem !== "undefined") {
            return false;
          } else {
            team.athletes = request.atletas;
            team.statistics_css = mercado_status == 6 ? 'hide' : '';

            // tem retorno de atletas da API
            if (typeof team.athletes !== "undefined" && team.athletes !== "") {
              team.team_pontuacao = 0;

              // loop nos atletas
              $.each(team.athletes, function(inc, athlete) {
                // atleta tem info para exibir
                if (athlete.apelido !== "") {
                  
                  // se o clube_id for diferente de 1, que é 'outros' na API, exibe o escudo do time.
                  if (athlete.clube_id != 1 && athlete.clube_id !== null) {
                    athlete.clube_escudo45x45 = request.clubes[athlete.clube_id].escudos['45x45'];
                  }
                  
                  var atleta_foto = athlete.foto;

                  if (atleta_foto !== "" && atleta_foto !== null) {
                    athlete.atleta_foto140x140 = atleta_foto.replace("FORMATO", "140x140");
                  } 
                  
                 
                  athlete.athlete_status_label = request.status[athlete.status_id].nome;
                  
                  // se status não for nulo
                  if (athlete.status_id != 6) {
                    athlete.athlete_status_image = "images/status_"+ athlete.status_id +".png";
                  }

                  // athlete posicao
                  athlete.athlete_posicao = request.posicoes[athlete.posicao_id].nome;

                  // athlete preco
                  athlete.athlete_preco = athlete.preco_num.toFixed(2);

                  // athlete preco variacao
                  var athlete_preco_variacao = athlete.variacao_num.toFixed(2);
                  athlete.athlete_preco_variacao = athlete_preco_variacao.replace("-","");
                  athlete.athlete_preco_variacao_css = "athlete_val "+ getClassArrowNumber(athlete.variacao_num);
                  /*********************************************************/

                  /*********************************************************/
                     

                  // mercado fechado, pega pontuacao dos atletas da rodada em andamento
                  if (mercado_status == 2) {
                    athlete.athlete_pontos = (typeof $scope.atletas_pontuados !== 'undefined' && typeof $scope.atletas_pontuados[athlete.atleta_id] !== 'undefined') ? $scope.atletas_pontuados[athlete.atleta_id].pontuacao.toFixed(2) : "-";
                    athlete.athlete_pontos_css = "athlete_val "+ getClassNumber(athlete.athlete_pontos);
                    athlete.athlete_pontos_label = "Parcial";
                    // calcula a pontuacao do time
                    team.team_pontuacao += (typeof $scope.atletas_pontuados !== 'undefined' && typeof $scope.atletas_pontuados[athlete.atleta_id] !== 'undefined') ? $scope.atletas_pontuados[athlete.atleta_id].pontuacao : 0.00;

                    // mercado aberto, pega pontuacao dos atletas da rodada anterior
                  } else if (mercado_status == 1) {
                    athlete.athlete_pontos_label = "Última";
                    athlete.athlete_pontos = athlete.pontos_num.toFixed(2);
                    athlete.athlete_pontos_css = "athlete_val "+ getClassNumber(athlete.pontos_num);

                    // fallback, atleta sem pontuacao
                  } else {
                    athlete.athlete_pontos = "-";
                  }
                  /*********************************************************/

                  /*********************************************************/
                  // athlete media pontos
                  athlete.athlete_media = athlete.media_num.toFixed(2);
                  athlete.athlete_media_css = "athlete_val "+ getClassNumber(athlete.media_num);
                  /*********************************************************/

                  /*********************************************************/
                  // athlete jogos
                  athlete.athlete_jogos = athlete.jogos_num;
                  /*********************************************************/

                }

              });

              // rodada
              team.team_rodada = rodada_atual;

              // se o mercado está fechado, pega pontuacao do time da rodada anterior
              if (mercado_status == 1) {
                // se a pontuacao for diferente de null, carrega da rodada anterior, caso contrario mostra zerada.
                team.team_rodada = team.athletes[0].rodada_id;
                team.team_pontuacao = (request.pontos !== null) ? request.pontos : team_pontuacao;
              }

              // time pontuacao
              team.team_pontuacao_css = "pontos_total "+ getClassNumber(team.team_pontuacao);

              // pontuacao label
              var pontuacao_label = (mercado_status == 1) ? "" : "";
              // time patrimonio
              team.team_patrimonio = request.patrimonio;

            }
            // nao tem retorno de atletas da API
            else {
              // esconde as informacoes do time e atletas
              //$result.hide();
              // exibe mensagem
              //notify(notify_msg.athletes_notfound.text, notify_msg.athletes_notfound.type);

              return false;

            }

          }
        };

        // Retorna a class css dado um tipo de numero
        getClassNumber = function(number) {

          return ((number > 0) ? "positivo" : ((number < 0) ? "negativo" : "neutro"));

        };

        // Retorna a class css com seta up/down dado um tipo de numero
        getClassArrowNumber = function (number) {

          return ((number > 0) ? "positivo arrow-up" : ((number < 0) ? "negativo arrow-down" : "neutro"));

        };

    });