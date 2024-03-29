;(function (angular, _) {
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
          const options = {
            threshold: 0.5
          }
          let seen = false
          var dragImage = document.createElement('div')
          var el = element[0]
          const callback = (entries, observer) => {
            if (entries[0].isIntersecting && !seen) {
              seen = true
              if (el.attributes['zl-drag']) {
                el.draggable = true

                el.addEventListener(
                  'dragstart',
                  dragStartEvent,
                  false
                )
              }
              if (el.attributes['zl-drop']) {
                el.addEventListener(
                  'drop',
                  dropEvent,
                  false
                )

                el.addEventListener(
                  'dragenter',
                  dragEnterEvent,
                  false
                )

                el.addEventListener(
                  'dragleave',
                  dragLeaveEvent,
                  false
                )
              }
            } else if (!entries[0].isIntersecting && seen) {
              el.removeEventListener(
                'dragstart',
                dragStartEvent,
                false
              )
              el.removeEventListener(
                'drop',
                dropEvent,
                false
              )
              el.removeEventListener(
                'dragenter',
                dragEnterEvent,
                false
              )
              el.removeEventListener(
                'dragleave',
                dragLeaveEvent,
                false
              )
              seen = false
            }
          }
          const observer = new IntersectionObserver(callback, options)
          observer.observe(element[0])

          function dragStartEvent (e) {
            dragImage.style.height = el.clientHeight + 'px'
            dragImage.style.zIndex = '1000'
            dragImage.style.position = 'relative'
            dragImage.style.left = '-10000px'
            dragImage.style.bottom = '-10000px;'
            dragImage.innerHTML = el.innerHTML
            if (el.children.length > 1) {
              dragImage.children[0].style.float = 'left'
              dragImage.style.backgroundColor = el.children[1].style.backgroundColor
              dragImage.style.width = el.clientWidth + 'px'
            } else {
              dragImage.style.width = Math.min(el.clientWidth, 200) + 'px'
              dragImage.style.backgroundColor = el.children[0].style.backgroundColor
            }
            e.dataTransfer.effectAllowed = 'move'

            document.body.appendChild(dragImage)

            // remove translucent drag if present
            if (e.dataTransfer.setDragImage) {
              e.dataTransfer.setDragImage(dragImage, 0, 0)
            }
            // Remove tooltips on drag
            _.each(document.querySelectorAll('.planning-event-tooltip'), function (elt) {
              elt.remove()
            })
            e.dataTransfer.setData('Text', JSON.stringify(scope.dragDropCtrl.zlDrag))
            this.classList.add('drag')
            return false
          }
          function dropEvent (e) {
            scope.$apply(function () {
              scope.dragDropCtrl.zlDrop({ $data: JSON.parse(e.dataTransfer.getData('Text')), $event: e })
            })
            e.target.classList.remove('over')
            this.classList.remove('over')
            e.stopPropagation()
            return false
          }
          function dragEnterEvent (e) {
            e.target.classList.add('over')
            return false
          }
          function dragLeaveEvent (e) {
            e.target.classList.remove('over')
            return false
          }
        }
      }
    })
})(window.angular, _)
