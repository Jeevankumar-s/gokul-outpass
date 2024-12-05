import React, {useState} from 'react'
import axios from 'axios'
import Header from '../Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'

const AddUser = ({location}) => {
  const {username, user} = location.state || {}
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/register',
        {username: name, password, user: 'employee'},
      )
      if (response.status === 201) {
        alert('User Created Successfully')
        console.log('User added successfully:', response.data)
      } else {
        alert('Error Creating User')
        console.error('Error adding user:', response.data)
      }
    } catch (error) {
      alert('Error Creating User')
      console.error('Error:', error)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Header username={username} user={user} />
        <div className="col-md-8 offset-md-1">
          <div className="add-user-form-container">
            <h2 className="form-heading">Add User</h2>
            <form className="add-user-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Add User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUser
