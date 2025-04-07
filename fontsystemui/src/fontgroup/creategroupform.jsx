import React, { useEffect, useState } from "react";

const Creategroupform = () => {
  const [fonts, setFonts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [fontRows, setFontRows] = useState([{ font1: "" }]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFonts = () => {
      fetch("http://localhost:8080/api/fonts")
        .then((res) => res.json())
        .then((data) => setFonts(data.fonts || []))
        .catch((err) => console.error("Error fetching fonts:", err));
    };

    fetchFonts();
  }, []);

  // Handle font selection
  const handleFontSelect = (fontId, rowIndex, fontKey) => {
    const font = fonts.find((f) => f.id === fontId);
    if (font) {
      const updatedRows = [...fontRows];
      updatedRows[rowIndex][fontKey] = font.name; 
      setFontRows(updatedRows);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (groupName.trim() === "") {
      setMessage("Please enter a group name.");
      return;
    }

    const fontIds = fontRows.flatMap((row) => {
      const font1 = fonts.find((f) => f.name === row.font1);
      return [font1?.id].filter((id) => id);
    });

    if (fontIds.length < 2) {
      setMessage("Please select at least two fonts.");
      return;
    }

    fetch("http://localhost:8080/api/create-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: groupName, font_ids: fontIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setGroupName("");
          setFontRows([{ font1: "" }]);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setMessage(data.error || "Failed to create group");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Server error");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  };

  const addRow = () => {
    setFontRows([...fontRows, { font1: "" }]);
  };

  const deleteRow = (index) => {
    const updatedRows = fontRows.filter((_, rowIndex) => rowIndex !== index);
    setFontRows(updatedRows);
  };

  return (
    <div className="flex flex-col ml-60 w-full pt-6 px-4">
      <div className="flex flex-col items-start justify-start mt-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Font Group
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
              className="border rounded p-2 ml-4"
              onChange={(e) =>
                handleFontSelect(parseInt(e.target.value), rowIndex, "font1")
              }
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

          <button
            onClick={handleSubmit}
            className="bg-green-700 hover:bg-white hover:text-green-700 hover:border hover:border-green-500 text-white px-6 py-2 rounded mt-4 mr-96"
          >
            Create Group
          </button>
        </div>

        {message && (
          <p className="my-4 text-base text-blue-900 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Creategroupform;
