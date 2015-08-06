angular.module('90Tech.planning')
    .provider('planningConfiguration', function(){
        var self = this;
        self.strings = {
            nothing_to_show: 'Rien à afficher'
        };

        this.setString= function(key, value){
            self.strings[key] = value;
        };

        this.$get = [function(){
            return {strings: self.strings};
        }];

    });
