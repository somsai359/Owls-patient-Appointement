import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import PatientForm from './PatientForm';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/patients">Patient List</Link>
            </li>
            <li>
              <Link to="/patients/new">Create Patient</Link>
            </li>
          </ul>
        </nav>
        <Switch>
  <Route exact path="/">
    <Home />
  </Route>
  <Route path="/patients/new">
    <PatientForm />
  </Route>
  <Route path="/patients/:id">
    <PatientDetail />
  </Route>
  <Route path="/patients">
    <PatientList />
  </Route>
</Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
