// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Extra Credit 03 - Custom Hooks
// Extra Credit 04 - Flexible localStorage hook
// Custom hooks are functions that uses hooks.
// It allows reusing hooks such as useEffect in multiple components.
// Inside main component, we just use:
//  const [name, setName] = useLocalStorageState('name', initialName);
function useLocalStorageState(
  key,
  defaultValue = '',
  // (EC04) Options object:
  //  Allow custom serialize/deserialize functions when accessing/storing in localStorage
  {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {
  const [state, setState] = React.useState(
    // () => window.localStorage.getItem(key) || defaultValue;
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      }

      // (EC04) Allow default Value to be a function, e.g. computationally expensive.
      // If its a function, call it, otherwise return defaultValue.
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  );

  // (EC04) What if I want to change the localStorage key without trigger re-render ?
  // useRef gives me an object that i can mutate without triggering a render.
  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    // (EC04) Manage new key here.
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;

    window.localStorage.setItem(key, serialize(state));
    // Extra Credit 02 - Effect Dependencies
    // useEffect supports passing in a dependencies list.
    // The dependencies list allows to specify when the component should rerender. In this case,
    //  we only re-render when the dependencies list changes: key, serialize, state
    //
  }, [key, serialize, state]);

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
  //  call that function when it needs to get the initial value. (During the MOUNT step, "run lazy initializers")
  // We don't always have to use this. E.g. if you're just passing initialName,
  //  then theres no need to create a function.
  // This function is called a Lazy Initializer.
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
