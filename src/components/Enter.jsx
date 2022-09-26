import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style/enter.css";
function Enter() {
  const [text, setText] = useState("");

  const saveuser = (e) => {
    const user =  {
      username: text
    }
    const loginUrl = "https://app-allazemail.herokuapp.com/api/addUser";
    fetch(loginUrl, {
      credentials: "same-origin",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      method: "POST",
    })
      .then(d => d.text())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="Hdiv">
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div class="signup">
          <form>
            <label for="chk" aria-hidden="true">
              Enter Name
            </label>
            <input
              type="text"
              name="txt"
              placeholder="User name"
              required=""
              onChange={e => {
                setText(e.target.value);
              }}
            />
            <Link to={`/${text}`} className="link" onClick={saveuser}>
              Sign up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Enter;
