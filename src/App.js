import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'

import History from './components/History'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AddUser from './components/AddUser'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/history" component={History} />
    <ProtectedRoute exact path="/add-user" component={AddUser} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
