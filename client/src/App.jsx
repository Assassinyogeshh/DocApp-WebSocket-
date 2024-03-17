import React, { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
const App = () => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState();
  const documentID = "46bf899d-f72d-4303-8fa4-3dfe589bdca4";

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("addDocument", documentID, data);
    alert("Document Added Successfully");
    setData(" ");

    socket.on("LoadDocument", (data) => {
      setData(data?.clientDoc);
    });
  };

  useEffect(() => {
    const soc = io("http://localhost:3000");
    setSocket(soc);

    return () => {
      soc.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected using WebSocket");
      });

      socket.emit("getUserDocuments", documentID);

      socket.on("LoadDocument", (data) => {
        setData(data?.clientDoc);
      });
    }
  }, [socket]);

  return (
    <>
      <div className="userDocuments">
        <form className="document" onSubmit={handleSubmit}>
          <h1>Documents</h1>
          <span>
            <label htmlFor="userText">Text</label>
            <textarea
              name="textArea"
              id="userText"
              cols="30"
              rows="10"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            ></textarea>
          </span>

          <button type="submit" className="submitBtn">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
