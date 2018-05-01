import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

class Notification extends Component {
  notify = (text) => {
    toast.success(text, {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  render() {
    return (
      <div>
        {this.notify("ciaone this is my test")}
        <ToastContainer />
      </div>
    );
  }
}

export default Notification;
