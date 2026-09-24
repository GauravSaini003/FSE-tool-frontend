import { useMemo, useState } from "react";

const users = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
}));

const usersPerPage = 20;

export default function UserData() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // This only runs again when search text or sort option changes.
  const filteredUsers = useMemo(() => {
    const result = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    });

    return result.sort((a, b) => {
      const compare = a.name.localeCompare(b.name, undefined, { numeric: true });
      return sort === "asc" ? compare : -compare;
    });
  }, [search, sort]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const start = (page - 1) * usersPerPage;
  const usersOnPage = filteredUsers.slice(start, start + usersPerPage);

  function searchUsers(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function sortUsers(event) {
    setSort(event.target.value);
    setPage(1);
  }

  function selectUser(id) {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  }

  return (
    <div className="user-data">
      <h1>Users</h1>
      <input type="text" placeholder="Search by name or email" value={search} onChange={searchUsers} />
      <select value={sort} onChange={sortUsers}>
        <option value="asc">Name A-Z</option>
        <option value="desc">Name Z-A</option>
      </select>

      <p>{filteredUsers.length} users | {selectedUsers.length} selected</p>
      {usersOnPage.map((user) => (
        <div key={user.id} className="user-row">
          <label><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => selectUser(user.id)} /> <strong>{user.name}</strong> - {user.email}</label>
        </div>
      ))}
      {filteredUsers.length === 0 && <p>No users found.</p>}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
