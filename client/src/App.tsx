import { useEffect, useState } from 'react'
import { getAllUsers } from '../src/lib/api/users';

function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((res: any) => {
        setUsers(res.data)
      })
      .catch((err: any) => {
        console.error(err);
      })
  }, [])

  return <>
    { users.map((user, i) => {
      return <article key={i}>
        <p>Username: {user.username}</p>
        <p>Password: {user.password}</p>
      </article>
    })}
  </>
}

export default App
