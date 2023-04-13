import { useEffect, useState } from 'react'
import { getAllUsers } from '../src/lib/api/users';
import { User } from '../src/types/types';

function App() {

  const [users, setUsers] = useState<[User] | []>([]);

  useEffect(() => {
    getAllUsers()
      .then((res: [User]) => {
        setUsers(res)
      })
      .catch((err: any) => {
        console.error(err);
      })
  }, [])

  return <>
    { users.map((user: User, i) => {
      return <article key={i}>
        <p>Username: {user.username}</p>
        <p>Password: {user.password}</p>
      </article>
    })}
  </>
}

export default App
