materialAdmin
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        
        $urlRouterProvider
            .when('', ['$state', '$match', function ($state, $match) {
                $state.go('cartola.home');
            }])

            .when('/', ['$state', '$match', function ($state, $match) {
                $state.go('cartola.home');
            }]);

        $stateProvider
            .state('cartola', {
                templateUrl: 'template/top.html',
                data: {
                    requireLogin: false
                }
            })

            .state('cartola.home', {
                url: '/',
                templateUrl: 'components/home/home.html'
            })

            .state('cartola.teams', {
                url: '/teams',
                templateUrl: 'components/teams/teams.html'
            });
    });
