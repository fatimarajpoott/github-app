import Loading from "../components/Loading";
import UsersContainer from "../components/UsersContainer";
import React, { useEffect, useState, useRef } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const user = useRef("");
  let endPoint = "https://api.github.com/users";

  async function fetchUsersFromAPI() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endPoint);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        localStorage.setItem("cachedUsers", JSON.stringify(data));
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      setError(
        "API rate limit exceeded for 103.173.6.16. (But here's the good news: Authenticated requests get a higher rate limit)"
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserByUsername(username) {
    setLoading(true);
    setError(null);
    try {
      const cachedUsers = localStorage.getItem("cachedUsers");
      if (cachedUsers) {
        const parsedData = JSON.parse(cachedUsers);
        const cachedUser = parsedData.find(
          (user) => user.login.toLowerCase() === username.toLowerCase()
        );
        if (cachedUser) {
          setUsers([cachedUser]);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${endPoint}/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUsers([data]);
        localStorage.setItem("cachedUsers", JSON.stringify([data]));
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      setError("Failed to fetch user data from API.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const username = user.current.value;
    if (username === "") {
      fetchUsersFromAPI();
    } else {
      setUsers([]);
      fetchUserByUsername(username);
    }
  }

  useEffect(() => {
    fetchUsersFromAPI();
  }, []);

  return (
    <div>
      <div className="flex justify-center h-11  my-5 items-center">
        <input
          placeholder="Search GitHub username"
          ref={user}
          type="text"
          className="h-full md:w-1/3 outline-none text-gray-800 px-2 
          font-semibold text-lg w-2/3"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-500 font-semibold  px-4 h-full font-[Poppins]"
        >
          Search
        </button>
      </div>
      {error && <div>Error: {error}</div>}
      <div>{loading ? <Loading /> : <UsersContainer users={users} />}</div>
    </div>
  );
};

export default Users;