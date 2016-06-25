materialAdmin

.controller('materialadminCtrl', function($timeout, $state, $localStorage, $scope, $http, API_URL) {
        
        
        // Detact Mobile Browser
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
           angular.element('html').addClass('ismobile');
        }

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        };

        //this.user = $localStorage.level1.user;

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');
        
        // For Mainmenu Active Class
        this.$state = $state;    
        
        //Close sidebar on click
        this.sidebarStat = function(event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;
            }
        };
              
        //Listview menu toggle in small screens
        this.lvMenuStat = false;
        
        //Skin Switch
        this.currentSkin = 'hivelives';

        this.skinList = [
            'lightblue',
            'bluegray',
            'cyan',
            'teal',
            'green',
            'orange',
            'blue',
            'purple',
            'hivelives'
        ];

        this.skinSwitch = function (color) {
            this.currentSkin = color;
        };

    });