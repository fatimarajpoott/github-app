import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FcApproval } from "react-icons/fc";

const UsersContainer = ({ users }) => {
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await Promise.all(
          users.map((user) => fetch(`https://api.github.com/users/${user.login}`)
            .then((response) => response.json())
            .then((userData) => ({
              ...userData,
              repositoriesCount: userData.public_repos
            }))
          )
        );
        setUserDetails(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (users && users.length > 0) {
      fetchUserDetails();
    }
  }, [users]);

  return (
    <div className="flex gap-5 flex-wrap justify-center py-5">
      {userDetails &&
        userDetails?.map((user, idx) =>
          user?.login ? (
            <div
              key={idx}
              className="flex w-[200px] border border-gray-500 bg-gray-900 p-3 flex-col items-center"
            >
              <img
                src={user?.avatar_url}
                className="w-24 mb-6 border-4 border-teal-400 rounded-full"
                alt={user?.login}
              />
              <h1 className="text-xl">
                {user?.login}
                <FcApproval className="inline" />
              </h1>
              <h1 className="text-xs text-teal-400">{user?.name}</h1>

              <div className="flex flex-col gap-0">
                <div className="block">
                  <span className="text-teal-400 text-xs">Followers : </span>
                  <span className="text-teal-400 text-xs">{user?.followers}</span>
                </div>
                <div className="block">
                  <span className="text-teal-400 text-xs">Following : </span>
                  <span className="text-teal-400 text-xs">{user?.following}</span>
                </div>
                <div className="block">
                  <span className="text-teal-400 text-xs">Bio of Repos : </span>
                  <span className="text-teal-400 text-xs">{user?.repositoriesCount}</span>
                </div>
              </div>

              <Link to={`/${user?.login}`}>
                <span className="text-gray-200 font-semibold rounded block px-4 py-1 bg-teal-600 my-3 tracking-wide">
                  View
                </span>
              </Link>
            </div>
          ) : (
            <div className="text-lg"></div>
          )
        )}
    </div>
  );
};

export default UsersContainer;
