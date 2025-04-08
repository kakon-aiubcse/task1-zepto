import React, { useEffect, useState } from "react";
import Creategroupform from "./creategroupform";

const Fontgroup = () => {
  const [fontGroups, setFontGroups] = useState([]);
  const [editGroup, setEditGroup] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchFontGroups = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/font-groups");
        const data = await response.json();

        setFontGroups(data.font_groups);
      } catch (error) {
        console.error("Error fetching font groups:", error);
      }
    };

    fetchFontGroups();

    const intervalId = setInterval(() => {
      fetchFontGroups();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleEdit = (group) => {
    setEditGroup(group); // Set the group to be edited
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/delete-group/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setFontGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== id)
        );
        setMsg("Group Deleted.");
        setTimeout(() => {
          setMsg("");
        }, 1000);
      } else {
        setTimeout(() => {
          setMsg("failed to fetch Font Group data");
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting font group:", error);
      alert("Error deleting font group");
    }
  };

  return (
    <div className="flex flex-col ml-60 w-4/6 p-5 pb-10">
      <div className="flex flex-col items-start justify-start mt-4 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Our Font Group
        </h1>
        <h3 className="text-lg text-gray-500 mb-6">
          Browse a list of Zepto fonts to build your font group
        </h3>
      </div>
      {editGroup ? (
        <Creategroupform editGroup={editGroup} setEditGroup={setEditGroup} />
      ) : (
        <div className="font-group-container">
          <h1 className="text-xl font-semibold mb-4 ">Font Groups</h1>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-start border-b font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-start border-b font-semibold">
                  Fonts
                </th>
                <th className="px-4 py-2 text-start border-b font-semibold">
                  Count
                </th>
                <th className="px-4 py-2 text-start border-b font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {fontGroups.length > 0 ? (
                fontGroups.map((group) => (
                  <tr key={group.id} className="border-b text-start">
                    <td className="px-4 py-2">{group.group_name}</td>
                    <td className="px-4 py-2 text-sm">
                      {JSON.parse(group.font_names).map((name, index) => (
                        <span key={index} className="mr-2 inline-block">
                          {name}
                        </span>
                      ))}
                    </td>

                    <td className="px-4 py-2 ">
                      {JSON.parse(group.font_names).length}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(group)}
                        className="text-blue-700 px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="text-red-500 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2">
                    No font groups available.
                  </td>
                </tr>
              )}{" "}
              {msg && (
                <p className="my-4 p-4 text-base text-blue-900 font-medium">
                  {msg}
                </p>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Fontgroup;
