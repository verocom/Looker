import * as d3 from 'd3'
import { formatType, handleErrors } from '../common/utils'

import {
  Link,
  Looker,
  LookerChartUtils,
  Row,
  VisConfig,
  VisualizationDefinition
} from '../types/types'

// Global values provided via the API
declare var looker: Looker
declare var LookerCharts: LookerChartUtils

const colorBy = {
  NODE: 'node',
  ROOT: 'root'
}

interface SunburstVisualization extends VisualizationDefinition {
  svg?: any,
}

// recursively create children array
function descend(obj: any, depth: number = 0) {
  const arr: any[] = []
  for (const k in obj) {
    if (k === '__data') {
      continue
    }
    const child: any = {
      name: k,
      depth,
      children: descend(obj[k], depth + 1)
    }
    if ('__data' in obj[k]) {
      child.data = obj[k].__data
      child.links = obj[k].__data.taxonomy.links
    }
    arr.push(child)
  }
  return arr
}

function burrow(table: Row[], config: VisConfig) {
  // create nested object
  const obj: any = {}

  table.forEach((row: Row) => {
    // start at root
    let layer = obj

    // create children as nested objects
    row.taxonomy.value.forEach((key: any) => {
      if (key === null && !config.show_null_points) {
        return
      }
      layer[key] = key in layer ? layer[key] : {}
      layer = layer[key]
    })
    layer.__data = row
  })

  // use descend to create nested children arrays
  return {
    name: 'root',
    children: descend(obj, 1),
    depth: 0
  }
}

const getLinksFromRow = (row: Row): Link[] => {
  return Object.keys(row).reduce((links: Link[], datum) => {
    if (row[datum].links) {
      const datumLinks = row[datum].links as Link[]
      return links.concat(datumLinks)
    } else {
      return links
    }
  }, [])
}

const vis: SunburstVisualization = {
  id: 'sunburst', // id/label not required, but nice for testing and keeping manifests in sync
  label: 'Sunburst',
  options: {
    color_range: {
      type: 'array',
      label: 'Color Range',
      display: 'colors',
      default: ['#dd3333', '#80ce5d', '#f78131', '#369dc1', '#c572d3', '#36c1b3', '#b57052', '#ed69af']
    },
    color_by: {
      type: 'string',
      label: 'Color By',
      display: 'select',
      values: [
        { 'Color By Root': colorBy.ROOT },
        { 'Color By Node': colorBy.NODE }
      ],
      default: colorBy.ROOT
    },
    show_null_points: {
      type: 'boolean',
      label: 'Plot Null Values',
      default: true
    }
  },
  // Set up the initial state of the visualization
  create(element, _config) {
    element.style.fontFamily = `"Open Sans", "Helvetica", sans-serif`
    this.svg = d3.select(element).append('svg')
  },
  // Render in response to the data or settings changing
  update(data, element, config, queryResponse) {
    if (!handleErrors(this, queryResponse, {
      min_pivots: 0, max_pivots: 0,
      min_dimensions: 1, max_dimensions: undefined,
      min_measures: 1, max_measures: 1
    })) return

    const width = element.clientWidth
    const height = element.clientHeight
    const radius = Math.min(width, height) / 2 - 8

    const dimensions = queryResponse.fields.dimension_like
    const measure = queryResponse.fields.measure_like[0]
    const format = formatType(measure.value_format) || ((s: any): string => s.toString())

    const colorScale: d3.ScaleOrdinal<string, null> = d3.scaleOrdinal()
    const color = colorScale.range(config.color_range || [])

    data.forEach(row => {
      row.taxonomy = {
        links: getLinksFromRow(row),
        value: dimensions.map((dimension) => row[dimension.name].value)
      }
    })

    const partition = d3.partition().size([2 * Math.PI, radius * radius])

    const arc = (
      d3.arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .innerRadius((d: any) => Math.sqrt(d.y0))
      .outerRadius((d: any) => Math.sqrt(d.y1))
    )

    const svg = (
      this.svg
      .html('')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    )

    const label = svg.append('text').attr('y', -height / 2 + 20).attr('x', -width / 2 + 20)

    const root = d3.hierarchy(burrow(data, config)).sum((d: any) => {
      return 'data' in d ? d.data[measure.name].value : 0
    })
    partition(root)

    svg
    .selectAll('path')
    .data(root.descendants())
    .enter()
    .append('path')
    .attr('d', arc)
    .style('fill', (d: any) => {
      if (d.depth === 0) return 'none'
      if (config.color_by === colorBy.NODE) {
        return color(d.data.name)
      } else {
        return color(d.ancestors().map((p: any) => p.data.name).slice(-2, -1))
      }
    })
    .style('fill-opacity', (d: any) => 1 - d.depth * 0.15)
    .style('transition', (d: any) => 'fill-opacity 0.5s')
    .style('stroke', (d: any) => '#fff')
    .style('stroke-width', (d: any) => '0.5px')
    .on('click', function (this: any, d: any) {
      const event: object = { pageX: d3.event.pageX, pageY: d3.event.pageY }
      LookerCharts.Utils.openDrillMenu({
        links: d.data.links,
        event: event
      })
    })
    .on('mouseenter', (d: any) => {
      const ancestorText = (
        d.ancestors()
        .map((p: any) => p.data.name)
        .slice(0, -1)
        .reverse()
        .join('-')
      )
      label.text(`${ancestorText}: ${format(d.value)}`)

      const ancestors = d.ancestors()
      svg
      .selectAll('path')
      .style('fill-opacity', (p: any) => {
        return ancestors.indexOf(p) > -1 ? 1 : 0.15
      })
    })
    .on('mouseleave', (d: any) => {
      label.text('')
      svg
      .selectAll('path')
      .style('fill-opacity', (d: any) => 1 - d.depth * 0.15)
    })
  }
}

looker.plugins.visualizations.add(vis)
