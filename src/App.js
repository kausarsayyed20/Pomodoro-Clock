import React from "react";

import "./App.css";
// Audio is causing react to fail while pressing the refresh button more than once
// will look into this fix soon
//const audio=document.getElementById('beep');
class App extends React.Component {
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: "session",
    isPlaying: false,
    colorchange: false,
  };
  constructor(props) {
    super(props);
    this.loop = undefined;
  }
  componentWillUnmount() {
    clearInterval(this.loop);
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      clearInterval(this.loop);
      this.setState({
        isPlaying: false,
      });
    } else {
      this.setState({
        isPlaying: true,
      });
      this.loop = setInterval(() => {
        const {
          clockCount,
          currentTimer,
          breakCount,
          sessionCount,
        } = this.state;
        if (clockCount === 0) {
          console.log(clockCount);
          this.setState({
            currentTimer: currentTimer === "session" ? "Break" : "session",
            clockCount:
              currentTimer === "session" ? breakCount * 60 : sessionCount * 60,
            colorchange: true,
          });
          const audio = document.getElementById("beep");
          audio.play();
        } else if (currentTimer === "Break") {
          console.log(breakCount);
          this.setState({
            clockCount: clockCount - 1,
            colorchange: true,
          });
        } else if (currentTimer === "session") {
          console.log(breakCount);
          this.setState({
            clockCount: clockCount - 1,
            colorchange: false,
          });
        } else {
          this.setState({
            clockCount: clockCount - 1,
          });
        }
      }, 1000);
    }
  };

  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: "session",
      isPlaying: false,
    });
    clearInterval(this.loop);
    //audio.pause();
    //audio.currentTime = 0;
  };

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}: ${seconds}`;
  };

  handleBreakDecrement = () => {
    const { breakCount, isPlaying, currentTimer } = this.state;
    if (breakCount > 1) {
      if (!isPlaying && currentTimer === "Break") {
        this.setState({
          breakCount: breakCount - 1,
          clockCount: (breakCount - 1) * 60,
        });
      } else {
        this.setState({
          breakCount: breakCount - 1,
        });
      }
    }
  };

  handleBreakIncrement = () => {
    const { breakCount, isPlaying, currentTimer } = this.state;
    if (breakCount < 60) {
      if (!isPlaying && currentTimer === "Break") {
        this.setState({
          breakCount: breakCount + 1,
          clockCount: (breakCount + 1) * 60,
        });
      } else {
        this.setState({
          breakCount: breakCount + 1,
        });
      }
    }
  };

  handleSessionDecrement = () => {
    const { sessionCount, isPlaying, currentTimer } = this.state;
    if (sessionCount > 1) {
      if (!isPlaying && currentTimer === "session") {
        this.setState({
          sessionCount: sessionCount - 1,
          clockCount: (sessionCount - 1) * 60,
        });
      } else {
        this.setState({
          sessionCount: sessionCount - 1,
        });
      }
    }
  };

  handleSessionIncrement = () => {
    const { sessionCount, isPlaying, currentTimer } = this.state;
    if (sessionCount < 60) {
      if (!isPlaying && currentTimer === "session") {
        this.setState({
          sessionCount: sessionCount + 1,
          clockCount: (sessionCount + 1) * 60,
        });
      } else {
        this.setState({
          sessionCount: sessionCount + 1,
        });
      }
    }
  };

  render() {
    const {
      breakCount,
      sessionCount,
      clockCount,
      currentTimer,
      isPlaying,
      colorchange,
    } = this.state;
    const breakProps = {
      title: "Break Length",
      count: breakCount,
      handleDecrement: this.handleBreakDecrement,
      handleIncrement: this.handleBreakIncrement,
    };

    const sessionProps = {
      title: "Session Length",
      count: sessionCount,
      handleDecrement: this.handleSessionDecrement,
      handleIncrement: this.handleSessionIncrement,
    };

    return (
      <div>
        <div>
          <audio id="beep">
            <source src="http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav"></source>
          </audio>
        </div>
        <div
          id="wrapper"
          style={{ backgroundColor: colorchange ? "#66ccff" : "#ff6600" }}
        >
          <div className="flex">
            <SetTimer {...breakProps} />
            <SetTimer {...sessionProps} />
          </div>
          <div className="clock-container">
            <h1>{currentTimer} </h1>
            <span>{this.convertToTime(clockCount)}</span>

            <div className="flex">
              <button onClick={this.handlePlayPause}>
                <i className={`fas fa-${isPlaying ? "pause" : "play"}`} />
              </button>
              <button onClick={this.handleReset}>
                <i className="fas fa-sync" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SetTimer = (props) => (
  <div className="timer-container">
    <h2>{props.title} </h2>
    <div className="flex actions-wrapper">
      <button onClick={props.handleDecrement}>
        <i className="fas fa-minus" />
      </button>
      <span>{props.count}</span>
      <button onClick={props.handleIncrement}>
        <i className="fas fa-plus" />
      </button>
    </div>
  </div>
);

export default App;
