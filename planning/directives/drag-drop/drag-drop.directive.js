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
          var dragImage  = document.createElement('div')
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
                dragImage.style.backgroundColor = el.style.backgroundColor
                dragImage.style.height = el.clientHeight + 'px'
                dragImage.style.width = Math.min(el.clientWidth, 200) + 'px'
                dragImage.style.zIndex = '1000'
                dragImage.style.position = 'relative'
                dragImage.style.left = '-10000px'
                dragImage.style.bottom = '-10000px;'
                dragImage.innerHTML = el.innerHTML
                e.dataTransfer.effectAllowed = 'move'

                document.body.appendChild(dragImage)

                e.dataTransfer.setDragImage(dragImage,0 , el.clientHeight/2)

                e.dataTransfer.setData('Text', JSON.stringify(scope.dragDropCtrl.zlDrag))
                this.classList.add('drag')
                return false
              },
              false
            )

            el.addEventListener(
              'dragend',
              function (e) {
                dragImage.remove()
                this.classList.remove('drag')
                return false
              },
              false
            )
          }
          if (el.attributes['zl-drop']) {
            el.addEventListener(
              'drop',
              function (e) {
                e.preventDefault()
                e.stopPropagation()
                if (e.stopPropagation) e.stopPropagation()
                e.target.classList.remove('over')
                this.classList.remove('over')
                scope.$apply(function () {
                  scope.dragDropCtrl.zlDrop({ $data: JSON.parse(e.dataTransfer.getData('Text')), $event: e })
                })
                return false
              },
              false
            )

            el.addEventListener(
              'dragenter',
              function (e) {
                e.target.classList.add('over')
                return false
              },
              false
            )

            el.addEventListener(
              'dragleave',
              function (e) {
                e.target.classList.remove('over')
                return false
              },
              false
            )
          }

        }
      }
    })
})(window.angular)
