import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {Component} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '../Header'

class index extends Component {
  state = {
    name: '',
    email: '',
    role: '',
    reason: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangename = event => {
    this.setState({name: event.target.value})
  }

  onChangeemail = event => {
    this.setState({email: event.target.value})
  }

  onChangeRole = event => {
    this.setState({role: event.target.value})
  }

  onChangereason = event => {
    this.setState({reason: event.target.value})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {name, email, role, reason, showSubmitError, errorMsg} = this.state
    try {
      const res = await axios.post(
        'http://localhost:3000/api/outpass/outpass',
        {
          name,
          email,
          role,
          reason,
        },
      )

      if (res.data.submission) {
        this.setState({
          showSubmitError: false,
          name: '',
          email: '',
          role: '',
          reason: '',
        })
        alert('Outpass Submitted Successfully')
      } else {
        this.setState({showSubmitError: true, errorMsg: res.data.Error})
        alert('cant submit outpass')
      }
    } catch (error) {
      console.error('Login error:', error.message)
      alert('server error')
    }
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    const {name, email, role, reason, showSubmitError, errorMsg} = this.state
    // const {location} = this.props
    // const {state} = location
    // const userDetails = state && state.userDetails
    // const username = userDetails ? userDetails.username : ''
    // const user = userDetails ? userDetails.user : ''
    const {location} = this.props
    const {username, user} = location.state || {}
    return (
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <Header username={username} user={user} />
          <div className="col p-0 m-0">
            <div className="p-2 d-flex justify-content-center shadow">
              <h4>Outpass Management System</h4>
            </div>
            <form className="row p-3 g-3" onSubmit={this.onSubmit}>
              <div className="col-md-6">
                <label htmlFor="inputEmail4" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={this.onChangename}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputPassword4" className="form-label">
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword4"
                  value={role}
                  onChange={this.onChangeRole}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputPassword4" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  id="inputPassword4"
                  onChange={this.onChangeemail}
                />
              </div>

              <div className="col-12">
                <label htmlFor="inputAddress" className="form-label">
                  Reason
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  value={reason}
                  id="inputAddress"
                  placeholder="Enter Valid Reason"
                  onChange={this.onChangereason}
                  col="10"
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Request Outpass
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default index
