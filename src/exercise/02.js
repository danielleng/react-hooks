// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Extra Credit 03 - Custom Hooks
// Custom hooks are functions that uses hooks. It allows reusing hooks
//  such as useEffect in multiple components.
// Inside main component, we just use const [name, setName] = useLocalStorageState('name', initialName);
function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue,
  );

  React.useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
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

  // Usually use useEffect to interact with the outside world, e.g. localStorage.
  // useEffect is called on every render/re-render.
  // Extra Credit 02 - Effect Dependencies
  // useEffect supports a dependencies list as a second argument. 
  // The Dependencies list is very useful for when synchronising with the outside world
  //  is expensive, e.g. localStorage or API calls.
  // The values inside the dependencies list is basically being compared as if you're 
  //  using a === or Object.is comparison. (so objects won't work)
  React.useEffect(() => {
    window.localStorage.setItem('name', name);
  }, [name]);

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
