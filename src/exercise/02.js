// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') || initialName,
  // );

  // Extra Credit 01 - Lazy State Initialization
  // Initializing a function is cheap. So instead of calling React.useState directly
  //  and accessing local storage, we wrap it with a function.
  // In this case, wrapping as a function will allow useState to only
  //  call that function when it needs to get the initial value.
  // We don't always have to use this. E.g. if you're just passing initialName,
  //  then theres no need to create a function.
  function getInitialNameValue() {
    return window.localStorage.getItem('name') || initialName;
  }
  const [name, setName] = React.useState(getInitialNameValue);
  // Alternative arrow function:
  // const [name, setName] = React.useState(() => 
  //   window.localStorage.getItem('name') || initialName);

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // Usually use useEffect to interact with the outside world, e.g. localStorage
  React.useEffect(() => {
    window.localStorage.setItem('name', name);
  });

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Andy" />
}

export default App
