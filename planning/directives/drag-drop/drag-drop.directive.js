;(function (angular) {
  'use strict'

  angular
    .module('90Tech.planning')
    .directive('zlPlanningDragDrop', function () {
      return {
        controller: function () {},
        scope: {},
        controllerAs: 'dragDropCtrl',
        bindToController: {
          zlDrag: '=',
          zlDrop: '&'
        },
        link: function (scope, element) {
          var el = element[0]
          window.addEventListener('dragover', function (e) {
            e.preventDefault();
          }, false);
          window.addEventListener('drop', function (e) {
            e.preventDefault();
          }, false);

          if (el.attributes['zl-drag']) {
            el.draggable = true

            el.addEventListener(
              'dragstart',
              function (e) {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('Text', JSON.stringify(scope.dragDropCtrl.zlDrag))
                this.classList.add('drag')
                return false
              },
              false
            )

            el.addEventListener(
              'dragend',
              function (e) {
                this.classList.remove('drag')
                return false
              },
              false
            )

            el.addEventListener(
              'dragover',
              function (e) {
                e.dataTransfer.dropEffect = 'move'
                if (e.preventDefault) e.preventDefault()
                this.classList.add('over')
                return false
              },
              false
            )
          }
          if (el.attributes['zl-drop']){
            el.addEventListener(
              'drop',
              function (e) {
                e.preventDefault()
                e.stopPropagation()
                if (e.stopPropagation) e.stopPropagation()
                this.classList.remove('over')
                scope.$apply(function () {
                  scope.dragDropCtrl.zlDrop({$data: JSON.parse(e.dataTransfer.getData('Text')), $event: e})
                })
                return false
              },
              false
            )

            el.addEventListener(
              'dragenter',
              function (e) {
                this.classList.add('over')
                return false
              },
              false
            )

            el.addEventListener(
              'dragleave',
              function (e) {
                this.classList.remove('over')
                return false
              },
              false
            )
          }



        }
      }
    })
})(window.angular)
