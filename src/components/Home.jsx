import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { FaUserCircle } from "react-icons/fa";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { InputBase } from "@material-ui/core";
import Modal from "./Modal";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { OutlinedInput, TextareaAutosize, Button } from "@mui/material";

import io from "socket.io-client";
import "./Style/home.css";

function Home() {
  const { userName } = useParams();
  const [users, setusers] = useState([]);
  const [sendUser, setsendUser] = useState("");
  const [tittle, setTittle] = useState("");
  const [messsage, setmessage] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = React.useState(false);
  const [dialogText, setDialogText] = useState("");
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const [receviedMessages, setReceviedMessages] = useState([]);
  const [sendedMessages, setSendedMessages] = useState([]);

  const LogOut = () => {
    navigate("/");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("http://localhost:5100/api/getusers")
      .then(data => data.json())
      .then(js => {
        setusers(js);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5100/api/getAllMessages")
      .then(data => data.json())
      .then(js => {
        filterMessages(js);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5100/api/getAnswer/${selected.Id}`)
      .then(data => data.json())
      .then(js => {
        console.log(js);
        setAnswers(js);
      })
      .catch(err => {
        console.log(err);
      });
  }, [selected]);

  useEffect(() => {
    const socket = io("ws://localhost:5100");
    socket.on("message-added", newmessage => {
      filterMessages(newmessage);
    });
  }, []);

  function filterMessages(messages) {
    setReceviedMessages(messages.filter(a => a.ToUser == userName));
    setSendedMessages(messages.filter(a => a.FromUser == userName));
  }

  const addMessage = () => {
    if (sendUser === "" || tittle === "" || messsage === "") {
      alert("Please fill all the fields");
    } else if (sendUser === userName) {
      alert("You cant send message to yourself");
    } else {
      const user = {
        toUser: sendUser,
        fromUser: userName,
        messageTitle: tittle,
        messageText: messsage,
      };
      const loginUrl = "http://localhost:5100/api/addMessage";
      fetch(loginUrl, {
        headers: {
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
    }
    clearFiedls();
  };

  function clearFiedls() {
    setTittle("");
    setmessage("");
  }

  function sendAnswer() {
    const message = {
      messageId: selected.Id,
      sendUser: userName,
      message: dialogText,
    };
    const loginUrl = "http://localhost:5100/api/addAnswer";
    fetch(loginUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      method: "POST",
    })
      .then(d => d.text())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    const socket = io("ws://localhost:5100");
    socket.on("answer-added", newanswer => {
      setAnswers(newanswer);
    });
  }, []);

  function init(messages, type) {
    return messages.map(element => (
      <div
        className="MessageInfoo"
        onClick={() => {
          setSelected(element);
          console.log(element);
        }}
      >
        <p className="MessageText">
          <FaUserCircle style={{ fontSize: "30px" }} />
          <span style={{ paddingLeft: "10px" }}>
            {type === "recevied"
              ? "From : " + element.FromUser
              : "To: " + element.ToUser}
          </span>
          <p className="MessageTextIn">{element.MessageTittle}</p>
        </p>
      </div>
    ));
  }

  return (
    <div>
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand>
            <img
              src="data:image/png;base64,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"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Brand>
            <Autocomplete
              id="combo-box-demo"
              options={users}
              getOptionLabel={option => option.user_name}
              style={{ width: 300, backgroundColor: "white" }}
              placeholder="Search User"
              renderInput={params => {
                const { InputLabelProps, InputProps, ...rest } = params;
                return <InputBase {...params.InputProps} {...rest} />;
              }}
              onChange={(e, value) => {
                setsendUser(value.user_name);
              }}
            />
          </Navbar.Brand>
          <Navbar.Brand>
            <Button variant="contained" color="error" onClick={LogOut}>
              LogOut
            </Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="First">
        <div className="Maindiv">
          <div className="divleft">
            <div className="divright1">
              <h4 className="divright1h4">Recevied Messages</h4>
              <div className="scrolldiv">
                {receviedMessages.length <= 0 ? (
                  <div>
                    <p style={{ marginTop: "30px" }}>No Recevied Messages</p>
                  </div>
                ) : (
                  <div className="n">{init(receviedMessages, "recevied")}</div>
                )}
              </div>
            </div>
            <div className="divright2">
              <h4 className="divright2h4">Sended Messages</h4>
              <div className="scrolldiv">
                {sendedMessages.length <= 0 ? (
                  <div>
                    <p style={{ marginTop: "30px" }}>No Sended Messages</p>
                  </div>
                ) : (
                  <div className="n">{init(sendedMessages, "sended")}</div>
                )}
              </div>
            </div>
          </div>
          <div class="divright">
            <div>
              <OutlinedInput
                style={{ width: "80%", marginTop: "20px  " }}
                placeholder="Title"
                onChange={e => {
                  setTittle(e.target.value);
                }}
                value={tittle}
              />
              <TextareaAutosize
                style={{ width: "80%", marginTop: "20px", height: "150px" }}
                onChange={e => {
                  setmessage(e.target.value);
                }}
                value={messsage}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignContent: "right",
                }}
              >
                <p style={{ marginRight: "80px", marginTop: "30px" }}>
                  {sendUser == "" ? "Select an user" : sendUser}
                </p>
                <Button
                  variant="contained"
                  style={{ marginRight: "80px", marginTop: "20px" }}
                  onClick={addMessage}
                >
                  Send
                </Button>
              </div>
            </div>

            <div className="SendDiv">
              {selected === "" ? (
                <div>
                  <h4 style={{ paddingTop: "20px" }}>No selected Messsage</h4>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: "100%",
                      height: "90px",
                      textAlign: "left",
                      padding: "10px",
                    }}
                  >
                    <p style={{ fontSize: "20px" }}>{selected.MessageTittle}</p>
                    <p>
                      From : {selected.FromUser + " ->"} To: {selected.ToUser}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "0px",
                      border: "solid 1px black",
                    }}
                  ></div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "20px",
                        textAlign: "left",
                      }}
                    >
                      <p style={{ paddingLeft: "10px" }}>
                        Message: {selected.MessageText}
                      </p>
                      <p
                        style={{ paddingLeft: "50px" }}
                        onClick={handleClickOpen}
                      >
                        Reply
                      </p>
                      <Dialog open={open} onClose={handleClose}>
                        <DialogContent>
                          <DialogContentText>
                            Enter good answer for this user:-
                          </DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={e => setDialogText(e.target.value)}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button
                            onClick={() => {
                              sendAnswer();
                              handleClose();
                            }}
                          >
                            Send
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    <h4>Replies</h4>
                    <div
                      className="RepliesDiv"
                      style={{
                        height: "250px",
                        overflowY: "auto",
                        marginTop: "10px",
                      }}
                    >
                      {answers.length <= 0 ? (
                        <div>
                          <p style={{ marginTop: "10px" }}>No Replies</p>
                        </div>
                      ) : (
                        <div>
                          {answers.map(el => (
                            <div
                              style={{
                                width: "100%",
                                minHeight: "70px",
                                textAlign: "left",
                                backgroundColor: "aliceblue",
                              }}
                            >
                              <p style={{ padding: "10px" }}>{el.sendUser}</p>
                              <p
                                style={{ padding: "10px", marginTop: "-20px" }}
                              >
                                {el.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
