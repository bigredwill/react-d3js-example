import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { mean as d3mean, extent as d3extent } from 'd3-array'

import USStatesMap from './USStatesMap'

class Title extends Component {
  get yearsFragment() {
    const year = this.props.filteredBy.year
    return year === '*' ? '' : `in ${year}`
  }

  get USStateFragment() {
    const USState = this.props.filteredBy.USState
    return USState === '*' ? '' : USStatesMap[USState.toUpperCase()]
  }

  get jobTitleFragment() {
    const { jobTitle, year } = this.props.filteredBy
    let title = ''

    if (jobTitle === '*') {
      if (year === '*') {
        title = 'The average H1B in tech pays'
      } else {
        title = 'The average tech H1B paid'
      }
    } else {
      title = `Software ${jobTitle}s on an H1B`

      if (year === '*') {
        title += 'make'
      } else {
        title += 'made'
      }
    }
    return title
  }

  get format() {
    return scaleLinear()
      .domain(d3extent(this.props.data, d => d.base_salary))
      .tickFormat()
  }

  render() {
    const mean = this.format(d3mean(this.props.data, d => d.base_salary))

    let title

    if (this.yearsFragment && this.USStateFragment) {
      title = (
        <h2>
          In {this.USStateFragment}, {this.jobTitleFragment}${mean}
          /year {this.yearsFragment}
        </h2>
      )
    } else {
      title = (
        <h2>
          {this.jobTitleFragment} {`$${mean}/year`}
          {this.USStateFragment ? `in ${this.stateFragment}` : ''}
          {this.yearsFragment}
        </h2>
      )
    }

    return title
  }
}

export default Title
