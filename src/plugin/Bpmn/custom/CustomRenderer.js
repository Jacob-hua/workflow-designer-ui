import Ids from 'ids'
import { assign } from 'min-dash'
import { query as domQuery } from 'min-dom'
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg'
import { createLine } from 'diagram-js/lib/util/RenderUtil'
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

const HIGH_PRIORITY = 1500

var RENDERER_IDS = new Ids()

class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, canvas) {
    super(eventBus, HIGH_PRIORITY)
    this.bpmnRenderer = bpmnRenderer
    this.canvas = canvas
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget
  }

  drawConnection(visuals, connection, attrs = {}) {
    var markers = {}
    var canvas = this.canvas
    var line = createLine(
      connection.waypoints,
      assign({}, this.CONNECTION_STYLE, {
        ...attrs,
        stroke: 'white',
        markerEnd: marker('sequenceflow-end', 'white', 'white'),
      })
    )

    svgAppend(visuals, line)
    return line

    function colorEscape(str) {
      // only allow characters and numbers
      return str.replace(/[^0-9a-zA-z]+/g, '_')
    }

    function addMarker(id, options) {
      var attrs = assign(
        {
          fill: 'white',
          strokeWidth: 1,
          strokeLinecap: 'round',
          strokeDasharray: 'none',
        },
        options.attrs
      )

      var ref = options.ref || { x: 0, y: 0 }

      var scale = options.scale || 1

      // fix for safari / chrome / firefox bug not correctly
      // resetting stroke dash array
      if (attrs.strokeDasharray === 'none') {
        attrs.strokeDasharray = [10000, 1]
      }

      var marker = svgCreate('marker')

      svgAttr(options.element, attrs)

      svgAppend(marker, options.element)

      svgAttr(marker, {
        id: id,
        viewBox: '0 0 20 20',
        refX: ref.x,
        refY: ref.y,
        markerWidth: 20 * scale,
        markerHeight: 20 * scale,
        orient: 'auto',
      })

      var defs = domQuery('defs', canvas._svg)

      if (!defs) {
        defs = svgCreate('defs')

        svgAppend(canvas._svg, defs)
      }

      svgAppend(defs, marker)

      markers[id] = marker
    }

    function createMarker(id, type, fill, stroke) {
      if (type === 'sequenceflow-end') {
        var sequenceflowEnd = svgCreate('path')
        svgAttr(sequenceflowEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' })

        addMarker(id, {
          element: sequenceflowEnd,
          ref: { x: 11, y: 10 },
          scale: 0.5,
          attrs: {
            fill: stroke,
            stroke: stroke,
          },
        })
      }
    }

    function marker(type, fill, stroke) {
      var rendererId = RENDERER_IDS.next()
      var id = type + '-' + colorEscape(fill) + '-' + colorEscape(stroke) + '-' + rendererId

      if (!markers[id]) {
        createMarker(id, type, fill, stroke)
      }

      return 'url(#' + id + ')'
    }
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'canvas']

export default CustomRenderer
