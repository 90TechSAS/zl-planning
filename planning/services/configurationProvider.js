angular.module('90Tech.planning')
    .provider('planningConfiguration', function(){
        var self = this;

        self.BASE_SIZE = 10;
        self.strings = {
            nothing_to_show: 'Rien à afficher'
        };

        this.setBaseSize = function(size){
            self.BASE_SIZE = size;
        };

        this.setString= function(key, value){
            self.strings[key] = value;
        };

        this.$get = [function(){
            return {strings: self.strings, BASE_SIZE : self.BASE_SIZE};
        }];

    });
