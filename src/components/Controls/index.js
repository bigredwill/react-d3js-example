import React, { Component } from 'react'
import _ from 'lodash'

import ControlRow from './ControlRow'

class Controls extends Component {
  state = {
    yearFilter: () => true,
    jobTitleFilter: () => true,
    USStateFilter: () => true,
    year: '*',
    USState: '*',
    jobTitle: '*',
  }

  componentDidMount() {
    let [year, USState, jobTitle] = window.location.hash
      .replace('#', '')
      .split('-')

    if (year !== '*' && year) {
      this.updateYearFilter(Number(year))
    }
    if (USState !== '*' && USState) {
      this.updateUSStateFilter(USState)
    }
    if (jobTitle !== '*' && jobTitle) {
      this.updateJobTitleFilter(jobTitle)
    }
  }

  updateYearFilter(year, reset) {
    let filter = d => d.submit_date.getFullYear() === year

    if (reset || !year) {
      filter = () => true
      year = '*'
    }

    this.setState({
      yearFilter: filter,
      year: year,
    })
  }

  updateJobTitleFilter(title, reset) {
    let filter = d => d.clean_job_title === title

    if (reset || !title) {
      filter = () => true
      title = '*'
    }

    this.setState({
      jobTitleFilter: filter,
      jobTitle: title,
    })
  }

  updateUSStateFilter(USState, reset) {
    let filter = d => d.USState === USState

    if (reset || !USState) {
      filter = () => true
      USState = '*'
    }

    this.setState({
      USStateFilter: filter,
      USState: USState,
    })
  }

  componentDidUpdate() {
    window.location.hash = [
      this.state.year || '*',
      this.state.USState || '*',
      this.state.jobTitle || '*',
    ].join('-')

    this.reportUpdateUpTheChain()
  }

  reportUpdateUpTheChain() {
    this.props.updateDataFilter(
      (filters => {
        return d =>
          filters.yearFilter(d) &&
          filters.jobTitleFilter(d) &&
          filters.USStateFilter(d)
      })(this.state),
      {
        USState: this.state.USState,
        year: this.state.year,
        jobTitle: this.state.jobTitle,
      }
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState)
  }

  render() {
    const data = this.props.data

    const years = new Set(data.map(d => d.submit_date.getFullYear())),
      jobTitles = new Set(data.map(d => d.clean_job_title)),
      USStates = new Set(data.map(d => d.USState))

    return (
      <div>
        <ControlRow
          data={data}
          toggleNames={Array.from(years.values())}
          picked={this.state.year}
          updateDataFilter={this.updateYearFilter.bind(this)}
        />

        <ControlRow
          data={data}
          toggleNames={Array.from(jobTitles.values())}
          picked={this.state.jobTitle}
          updateDataFilter={this.updateJobTitleFilter.bind(this)}
        />

        <ControlRow
          data={data}
          toggleNames={Array.from(USStates.values())}
          picked={this.state.USState}
          updateDataFilter={this.updateUSStateFilter.bind(this)}
          capitalize="true"
        />
      </div>
    )
  }
}

export default Controls
