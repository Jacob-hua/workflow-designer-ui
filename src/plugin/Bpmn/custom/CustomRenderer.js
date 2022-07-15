import Ids from 'ids'
import { isObject, assign } from 'min-dash'
import { query as domQuery } from 'min-dom'
import { append as svgAppend, attr as svgAttr, create as svgCreate, classes as svgClasses } from 'tiny-svg'
import { createLine } from 'diagram-js/lib/util/RenderUtil'
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import { black, getLabelColor, getFillColor, getStrokeColor, getSemantic } from './CustomRenderUtil'
import { getLabel } from '../utils/labelUtil'

const HIGH_PRIORITY = 1500

var DEFAULT_FILL_OPACITY = 0.95

var RENDERER_IDS = new Ids()

class CustomRenderer extends BaseRenderer {
  constructor(eventBus, styles, canvas, textRenderer, pathMap, config) {
    super(eventBus, HIGH_PRIORITY)
    console.log(config)
    this.styles = styles
    this.canvas = canvas
    this.textRenderer = textRenderer
    this.pathMap = pathMap
    this._renderer = renderer

    var computeStyle = styles.computeStyle

    var defaultFillColor = config && config.defaultFillColor,
      defaultStrokeColor = config && config.defaultStrokeColor,
      defaultLabelColor = config && config.defaultLabelColor

    function drawCircle(parentGfx, width, height, offset, attrs) {
      if (isObject(offset)) {
        attrs = offset
        offset = 0
      }

      offset = offset || 0

      attrs = computeStyle(attrs, {
        stroke: black,
        strokeWidth: 2,
        fill: 'white',
      })

      if (attrs.fill === 'none') {
        delete attrs.fillOpacity
      }

      var cx = width / 2,
        cy = height / 2

      var circle = svgCreate('circle')
      svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4 - offset),
      })
      svgAttr(circle, attrs)

      svgAppend(parentGfx, circle)

      return circle
    }

    function renderer(type) {
      return handlers[type]
    }

    var handlers = (this.handlers = {
      'bpmn:Event': function (parentGfx, element, attrs) {
        if (!('fillOpacity' in attrs)) {
          attrs.fillOpacity = DEFAULT_FILL_OPACITY
        }

        return drawCircle(parentGfx, element.width, element.height, attrs)
      },
      'bpmn:StartEvent': function (parentGfx, element) {
        var attrs = {
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        }

        var semantic = getSemantic(element)

        if (!semantic.isInterrupting) {
          attrs = {
            strokeDasharray: '6',
            strokeLinecap: 'round',
            fill: getFillColor(element, defaultFillColor),
            stroke: getStrokeColor(element, defaultStrokeColor),
          }
        }

        var circle = renderer('bpmn:Event')(parentGfx, element, attrs)

        return circle
      },
      'bpmn:EndEvent': function (parentGfx, element) {
        var circle = renderer('bpmn:Event')(parentGfx, element, {
          strokeWidth: 4,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        })

        return circle
      },
      label: function (parentGfx, element) {
        return renderExternalLabel(parentGfx, element)
      },
    })

    function renderExternalLabel(parentGfx, element) {
      var box = {
        width: 90,
        height: 30,
        x: element.width / 2 + element.x,
        y: element.height / 2 + element.y,
      }

      return renderLabel(parentGfx, getLabel(element), {
        box: box,
        fitBox: true,
        style: assign({}, textRenderer.getExternalStyle(), {
          fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor),
        }),
      })
    }

    function renderLabel(parentGfx, label, options) {
      options = assign(
        {
          size: {
            width: 100,
          },
        },
        options
      )

      var text = textRenderer.createText(label || '', options)
      svgClasses(text).add('djs-label')
      svgAppend(parentGfx, text)
      return text
    }
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget
  }

  drawShape(parentGfx, element) {
    var type = element.type
    if (!Object.keys(this.handlers).includes(type)) {
      return
    }
    var h = this._renderer(type)
    console.log(type)
    /* jshint -W040 */
    return h(parentGfx, element)
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

    function marker(type, fill, stroke) {
      var rendererId = RENDERER_IDS.next()
      var id = type + '-' + colorEscape(fill) + '-' + colorEscape(stroke) + '-' + rendererId

      if (!markers[id]) {
        createMarker(id, type, fill, stroke)
      }

      return 'url(#' + id + ')'
    }

    function colorEscape(str) {
      // only allow characters and numbers
      return str.replace(/[^0-9a-zA-z]+/g, '_')
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
  }
}

CustomRenderer.$inject = ['eventBus', 'styles', 'canvas', 'textRenderer', 'pathMap', 'config']

export default CustomRenderer
