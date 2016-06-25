materialAdmin
    .controller('teamsCtrl', function($http, $state, $scope, $localStorage, API_URL) {
        $scope.init = function() {   
        	$scope.timeSelecionado = null;
        	$scope.mostrarTime = false;
            
            if (!$localStorage.teams) {
            	$localStorage.teams = [];
            }

            $scope.teams = $localStorage.teams;

            $scope.modelOptions = {
		    debounce: {
		      default: 500,
		      blur: 250
		    },
		    getterSetter: true
		  };
        };

        $scope.showTime = function(item) {
        	$scope.mostrarTime = true;
        	//hideKeyboard();
        };

        hideKeyboard = function() {
        	document.activeElement.blur();
        };


        $scope.adicionar = function(team) {
        	if (team) {
				$scope.teams.push(team);
				$scope.mostrarTime = false;
				$scope.timeSelecionado = "";
        	}
        };

        $scope.remover = function(team) {
        	var index = $scope.teams.indexOf(team);
        	if (index > -1) {
        		$scope.teams.splice(index, 1);	
        	}
        };

        $scope.getTimes = function(val) {
		    return $http.get(API_URL + "/load-api.php?api=busca-time&team="+val).then(
	    	function(response){
		      return response.data.map(function(time){
		        return time;
		      });
		    });
	  	};
    });