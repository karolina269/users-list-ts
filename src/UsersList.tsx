import { useState } from "react";
import "./UsersList.css";

interface FormData {
  username: string;
  email: string;
  usertype: "Admin" | "User";
}

interface User extends FormData {
  id: number;
}

type Filter = "all" | FormData["usertype"];

const UsersList = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    usertype: "Admin",
  });

  const [users, setUsers] = useState<User[]>([]);

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [currentFilter, setCurrentFilter] = useState<Filter>("all");

  const [isSorted, setIsSorted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name: string = target.name;
    setFormData((prevDataForm) => {
      return { ...prevDataForm, [name]: target.value };
    });
  };

  const setUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let user = { ...formData, id: Date.now() };
    setUsers(users.concat(user));
    if (currentFilter === formData.usertype || currentFilter === "all") {
      setFilteredUsers(filteredUsers.concat(user));
    }
    setIsSorted(false);
  };

  const removeUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    const updatedFilteredUsers = filteredUsers.filter((user) => user.id !== id);
    setFilteredUsers(updatedFilteredUsers);
  };

  const filterUsers = (filter: Filter) => {
    setCurrentFilter(filter);
    if (filter === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.usertype === filter));
    }
  };

  const sortByUserNames = () => {
    setIsSorted(true);
    setFilteredUsers(filteredUsers.sort((a, b) => a.username.localeCompare(b.username, "en", { sensitivity: "base" })));
  };

  return (
    <div className="usersList">
      <form onSubmit={setUser}>
        <label htmlFor="username">User name</label>
        <input type="text" id="username" name="username" placeholder="User name" onChange={handleChange} value={formData.username} />
        <label htmlFor="email">User email</label>
        <input type="email" id="email" name="email" placeholder="User email" onChange={handleChange} value={formData.email} />
        <label htmlFor="usertype">User type</label>
        <select id="usertype" name="usertype" onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button>Save</button>
      </form>

      <div className="filterButtons">
        <button className={currentFilter === "Admin" ? "active" : ""} onClick={() => filterUsers("Admin")}>
          Show only admins
        </button>
        <button className={currentFilter === "User" ? "active" : ""} onClick={() => filterUsers("User")}>
          Show only users
        </button>
        <button className={currentFilter === "all" ? "active" : ""} onClick={() => filterUsers("all")}>
          Show all
        </button>
        <button className={isSorted === true ? "active" : ""} onClick={() => sortByUserNames()}>
          Sort a-b
        </button>
      </div>

      <div className="list">
        {filteredUsers.map((user) => {
          return (
            <div className="userItem" key={user.id} onClick={() => removeUser(user.id)}>
              <p>{user.username}</p>
              <p>{user.email}</p>
              <p>{user.usertype}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersList;
