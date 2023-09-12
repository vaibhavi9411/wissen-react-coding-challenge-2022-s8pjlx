import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { logo } from './assets/logo';
import { useForm } from 'react-hook-form';
import './style.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [getToken, setToken] = useState('');

  useEffect(() => {
    localStorage.setItem('apiToken', JSON.stringify(getToken));
  }, [getToken]);

  const {
    register,
    formState: { errors },
  } = useForm();

  const submit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      body: new URLSearchParams({
        email: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setToken(data.token);
        toastr.options = {
          positionClass: 'toast-bottom-full-width',
          hideDuration: 300,
          timeOut: 3000,
        };
        toastr.clear();
        if (data.token) {
          getUsers(data.token);
          setTimeout(() => toastr.success('Successfully Logged In'), 30);
        } else {
          setTimeout(() => toastr.error(data.error), 300);
        }
      });
  };

  const getUsers = async (token) => {
    const headers = { Authorization: 'Bearer ' + token };
    const response = await fetch('https://reqres.in/api/unknown', { headers })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <img src={logo} />
      <p className="headline">Hello there, Sign in to continue</p>
      <form>
        <div>
          <label>Email</label>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            {...register('email', {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            })}
          />
          {errors.email && <span>Invalid email</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="checkboxInput">
          <input type="checkbox" />
          <label>
            By creating or logging into an account, you are agreeing with our
            <b className="blackcolor"> Terms &amp; conditions</b> and
            <b className="blackcolor"> Privacy Policys</b>
          </label>
        </div>
        <button type="submit" onClick={submit} className="nextButton">
          <b>Next</b>
        </button>
        <button className="ssoButton">
          <b>Signin with company SSO </b>
        </button>
      </form>
    </div>
  );
};

render(<App />, document.getElementById('root'));
