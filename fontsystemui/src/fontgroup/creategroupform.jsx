import React, { useState, useEffect } from "react";

const Creategroupform = ({ editGroup, setEditGroup }) => {
  const [fonts, setFonts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [fontRows, setFontRows] = useState([{ font1: "" }]);
  const [message, setMessage] = useState("");
  const [fontIdsToRemove, setFontIdsToRemove] = useState([]);
  const [initialFontNames, setInitialFontNames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/fonts")
      .then((res) => res.json())
      .then((data) => setFonts(data.fonts || []))
      .catch((err) => console.error("Error fetching fonts:", err));
  }, []);

  useEffect(() => {
    if (editGroup && fonts.length) {
      setGroupName(editGroup.group_name);
      const fontNames = JSON.parse(editGroup.font_names || "[]");
      setInitialFontNames(fontNames);
      const rows = fontNames.map((name) => ({ font1: name }));
      setFontRows(rows);
    }
  }, [editGroup, fonts]);

  const handleFontSelect = (fontId, rowIndex) => {
    const font = fonts.find((f) => f.id === fontId);
    if (!font) return;

    const updatedRows = [...fontRows];
    updatedRows[rowIndex].font1 = font.name;
    setFontRows(updatedRows);
  };

  const handleSubmit = () => {
    if (!groupName.trim()) {
      setMessage("Please enter a group name.");
      return;
    }

    const selectedFontIds = fontRows
      .map((row) => fonts.find((f) => f.name === row.font1)?.id)
      .filter(Boolean);

    if (selectedFontIds.length < 2) {
      setMessage("Please select at least two fonts.");
      return;
    }

    // For edit: determine what changed
    const initialFontIds = initialFontNames
      .map((name) => fonts.find((f) => f.name === name)?.id)
      .filter(Boolean);

    const fontIdsToAdd = selectedFontIds.filter(
      (id) => !initialFontIds.includes(id)
    );
    const fontIdsToRemove = initialFontIds.filter(
      (id) => !selectedFontIds.includes(id)
    );

    const url = editGroup
      ? `http://localhost:8080/api/edit-group/${editGroup.id}`
      : `http://localhost:8080/api/create-group`;
    const method = editGroup ? "PUT" : "POST";

    const data = {
      group_name: groupName,
      fontIdsToAdd,
      fontIdsToRemove,
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Success");
        setGroupName("");
        setFontRows([{ font1: "" }]);
        setInitialFontNames([]);
        if (setEditGroup) setEditGroup(null);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("Server error");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const addRow = () => {
    setFontRows([...fontRows, { font1: "" }]);
  };

  const deleteRow = (index) => {
    const updatedRows = [...fontRows];
    updatedRows.splice(index, 1);
    setFontRows(updatedRows);
  };

  return (
    <div
      className={`flex flex-col ${
        editGroup ? "ml-0" : "ml-60"
      } w-full pt-6 px-4`}
    >
      {" "}
      <div className="flex flex-col items-start mt-4">
        <h1 className="text-3xl font-bold mb-2">
          {editGroup ? "Edit Font Group" : "Create Font Group"}
        </h1>
        <h3 className="text-lg text-gray-500 mb-6">
          You have to select at least two fonts.
        </h3>

        <input
          type="text"
          placeholder="Enter group name"
          className="border rounded p-2 mb-4 w-2/3"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {fontRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              value={row.font1}
              readOnly
              className="border rounded p-2 w-[250px] bg-gray-100"
              placeholder="Font Name"
            />

            <select
              className="border rounded p-2"
              onChange={(e) =>
                handleFontSelect(parseInt(e.target.value), rowIndex)
              }
              value={fonts.find((f) => f.name === row.font1)?.id || ""}
            >
              <option value="">Select Font</option>
              {fonts.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => deleteRow(rowIndex)}
              className="text-red-600 hover:text-red-700 text-2xl p-2 rounded-full hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        ))}

        <div className="flex justify-between w-full mb-40">
          <button
            onClick={addRow}
            className="border border-green-500 hover:bg-green-700 hover:text-white text-black px-4 py-2 rounded mt-4"
          >
            + Add Row
          </button>

          <div className="flex space-x-4 mt-4 mr-96">
  <button
    onClick={handleSubmit}
    className="bg-green-700 hover:bg-white hover:text-green-700 hover:border hover:border-green-500 text-white px-6 py-2 rounded"
  >
    {editGroup ? "Update Group" : "Create Group"}
  </button>

  {editGroup && (
    <button
      onClick={() => {
        setEditGroup(false);
        setGroupName("");
        setFontRows([]);
        setMessage("");
      }}
      className="border border-gray-400 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded"
    >
      Cancel Update
    </button>
  )}
</div>

        </div>

        {message && (
          <p className="my-4 text-base text-blue-900 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Creategroupform;
