/* eslint-disable prettier/prettier */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, withRouter} from 'react-router-dom'
import {Component} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Index extends Component {
  constructor() {
    super()
    this.state = {
      outpassData: [],
      employeeOutpassData: [],
      button: null,
      loading: false,
      fromDate: '',
      toDate: '',
    }
  }

  componentDidMount() {
    const {location: {state: {username, user} = {}} = {}} = this.props

    const apiUrl =
      user === 'employee'
        ? `http://localhost:3000/api/outpass/history/${username}`
        : 'http://localhost:3000/api/outpass/history'

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        if (user === 'employee') {
          this.setState({employeeOutpassData: data})
        } else {
          this.setState({outpassData: data})
        }
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  handleAccept = async id => {
    this.setState({ loading: true });
    try {
      const response = await axios.post(
        `http://localhost:3000/api/outpass/outpass/${id}/accept`
      );
      if (response.data.success) {
        // Update the UI to reflect the accepted outpass
        this.updateOutpassStatus(id, 'Accepted');
        this.setState({ loading: false });
        alert(`Accepted outpass with ID: ${id}`);
      } else {
        this.setState({ loading: false });
        alert(`Failed to accept outpass with ID: ${id}`);
      }
    } catch (error) {
      this.setState({ loading: false });
      console.error('Error accepting outpass:', error);
      alert(`An error occurred while accepting outpass with ID: ${id}`);
    }
  };
  

  handleDecline = async id => {
    // Show a confirmation dialog to the staff member
    const confirmDecline = window.confirm(
      'Are you sure you want to decline this outpass?'
    );
  
    if (confirmDecline) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/outpass/outpass/${id}/decline`
        );
        console.log(response.data.success);
        if (response.data.success) {
          // Update the UI to reflect the declined outpass
          this.updateOutpassStatus(id, 'Rejected');
          alert(`Declined outpass with ID: ${id}`);
        } else {
          alert(`Failed to decline outpass with ID: ${id}`);
        }
      } catch (error) {
        console.log(error)
        console.error('Error declining outpass:', error);
        alert(`An error occurred while declining outpass with ID: ${id}`);
      }
    }
  };


  


  // Date filter change handler
  handleDateChange = (event, type) => {
    this.setState({[type]: event.target.value})
  }

  // Filter outpasses by date range
  filterByDate = (data, fromDate, toDate) => {
    if (!fromDate && !toDate) return data

    return data.filter(item => {
      const itemDate = new Date(item.current_datetime)
      const from = fromDate ? new Date(fromDate) : null
      const to = toDate ? new Date(toDate) : null

      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  updateOutpassStatus(id, status) {
    // Update the component's state to reflect the accepted or declined outpass
    const {location: {state: {username, user} = {}} = {}} = this.props

    if (user === 'hr') {
      const {outpassData} = this.state

      const updatedOutpassData = outpassData.map(item => {
        if (item.id === id) {
          return {...item, status}
        }
        return item
      })
      this.setState({outpassData: updatedOutpassData})
    } else {
      const {employeeOutpassData} = this.state
      const updatedStudentOutpassData = employeeOutpassData.map(item => {
        if (item.id === id) {
          return {...item, status}
        }
        return item
      })
      this.setState(prevState => ({
        employeeOutpassData: updatedStudentOutpassData,
      }))
    }
  }

  render() {
    const {location} = this.props
    const {username, user} = location.state || {}
    const {
      outpassData,
      employeeOutpassData,
      loading,
      fromDate,
      toDate,
    } = this.state

    const filteredOutpassData = this.filterByDate(outpassData, fromDate, toDate)
    const filteredEmployeeOutpassData = this.filterByDate(
      employeeOutpassData,
      fromDate,
      toDate,
    )

    return (
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <Header username={username} user={user} />
          {loading ? (
            <div className="col p-0 m-0 d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="col p-0 m-0">
              <div className="p-2 d-flex justify-content-center flex-column shadow">
                <h4 className="text-center">History</h4>

                {/* Date Filter Inputs */}
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <label htmlFor="fromDate">From: </label>
                    <input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={e => this.handleDateChange(e, 'fromDate')}
                    />
                  </div>
                  <div>
                    <label htmlFor="toDate">To: </label>
                    <input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={e => this.handleDateChange(e, 'toDate')}
                    />
                  </div>
                </div>

                <div className="container">
                  <>
                    {user === 'hr' ? (
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                        {filteredOutpassData.map(item => (
                          <div key={item.id} className="col mb-4">
                            <div className="card">
                              <div className="card-body">
                                <h3 className="card-title">{item.name}</h3>
                                <p className="card-text">Email: {item.email}</p>
                                <p className="card-text">Role: {item.role}</p>
                                <p className="card-text">
                                  Reason: {item.reason}
                                </p>
                                <p>
                                  Status:
                                  <span
                                    className={`card-text status-${item.status.toLowerCase()}`}
                                  >
                                    {item.status}
                                  </span>
                                </p>
                                <p>
                                  Requested Date:{' '}
                                  {new Date(
                                    item.current_datetime,
                                  ).toLocaleDateString()}
                                </p>

                                {user === 'hr' && item.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => this.handleAccept(item.id)}
                                      className="btn btn-success mr-2"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        this.handleDecline(item.id)
                                      }
                                      className="btn btn-danger m-3"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                        {filteredEmployeeOutpassData.map(item => (
                          <div key={item.id} className="col mb-4">
                            <div className="card">
                              <div className="card-body">
                                <h3 className="card-title">{item.name}</h3>
                                <p className="card-text">Email: {item.email}</p>
                                <p className="card-text">Role: {item.role}</p>
                                <p className="card-text">
                                  Requested Date:{' '}
                                  {new Date(
                                    item.current_datetime,
                                  ).toLocaleDateString()}
                                </p>
                                <p className="card-text">
                                  Reason: {item.reason}
                                </p>
                                <p>
                                  Status:
                                  <span
                                    className={`card-text status-${item.status.toLowerCase()}`}
                                  >
                                    {item.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Index)
