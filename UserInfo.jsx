import Loading from "../components/Loading";
import Repo from "../components/Repo";
import Tabs from "../components/Tabs";
import UsersContainer from "../components/UsersContainer";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserInfo = () => {
  const [user, setUser] = useState([]);
  const [type, setType] = useState("repos");
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(null);
  const EndPoint = "https://api.github.com/users";
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function GetUserInfo() {
    const res = await fetch(EndPoint + pathname);
    const data = await res.json();
    setUser(() => [data]);
  }

  async function GetUrls() {
    setUsers([]);
    setFollowing([]);
    setFollowers([]);
    setLoading(true);
    const res = await fetch(EndPoint + pathname + `/${type}`);
    const data = await res.json();
    if (type === "following") {
      setFollowing(data);
    } else if (type === "followers") {
      setFollowers(data);
    } else {
      setUsers(data);
    }
    setLoading(null);
  }

  useEffect(() => {
    GetUserInfo();
    GetUrls();
  }, [pathname, type]);

  return (
    <div className="py-5">
      <button
        onClick={() => navigate("/")}
        className="px-5 py-1 font-medium mx-1 my-4 bg-teal-600 rounded text-gray-200"
      >
        BACK
      </button>
      {user &&
        user?.map((uinfo, i) => (
          <div
            key={i}
            className="flex justify-center md:flex-row md:px-0 px-4 flex-col gap-10"
          >
            <img
              src={uinfo.avatar_url}
              className="w-[350px] border-4 border-teal-400 md:mx-0 mx-auto"
            />
            <div className="text-lg leading-10 px-3">
              <h1 className="text-3xl pb-4">{uinfo.name}</h1>
              <h1>
                <span className="text-teal-400">Login_name</span>: {uinfo.login}
              </h1>
              <h1>
                <span className="text-teal-400">followers: </span>
                {uinfo.followers}
              </h1>
              <h1>
                <span className="text-teal-400">following: </span>
                {uinfo.following}
              </h1>
              <h1>
                <span className="text-teal-400">public_repositories : </span>
                {uinfo.public_repos}
              </h1>
            </div>
          </div>
        ))}
      <div className="flex border-b pb-4 gap-6 mt-[10%] mb-6 justify-center md:text-xl">
        <Tabs type={type} setType={setType} />
      </div>
      {loading && <Loading />}
      {type === "repos" && (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7 w-10/12 mx-auto">
          {users && <Repo users={users} />}
        </div>
      )}
      {type === "followers" && (
        <div className="grid md:grid-cols-1 grid-cols-1 gap-7 w-10/12 mx-auto">
          {followers && <UsersContainer users={followers} />}
        </div>
      )}
      {type === "following" && (
        <div className="grid md:grid-cols-1 grid-cols-1 gap-7 w-10/12 mx-auto">
          {following && <UsersContainer users={following} />}
        </div>
      )}
    </div>
  );
};

export default UserInfo;

