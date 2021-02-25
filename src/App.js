import React from "react";
import "./App.css";
import { setupAudio } from "./setupAudio";

function PitchReadout({ running, latestPitch }) {
  return (
    <div className="Pitch-readout">
      {latestPitch
        ? `Latest pitch: ${latestPitch.toFixed(1)} Hz`
        : running
        ? "Listening..."
        : "Paused"}
    </div>
  );
}

function AudioRecorderControl() {
  const [audio, setAudio] = React.useState(undefined);
  const [running, setRunning] = React.useState(false);
  const [latestPitch, setLatestPitch] = React.useState(undefined);

  if (!audio) {
    return (
      <button
        onClick={async () => {
          setAudio(await setupAudio(setLatestPitch));
          setRunning(true);
        }}
      >
        Start listening
      </button>
    );
  }

  const { context } = audio;
  return (
    <div>
      <button
        onClick={async () => {
          if (running) {
            await context.suspend();
            setRunning(context.state === "running");
          } else {
            await context.resume();
            setRunning(context.state === "running");
          }
        }}
        disabled={context.state !== "running" && context.state !== "suspended"}
      >
        {running ? "Pause" : "Resume"}
      </button>
      <PitchReadout running={running} latestPitch={latestPitch} />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Audio pitch detection using Rust (WASM) in React.js
      </header>
      <div className="App-content">
        <AudioRecorderControl />
      </div>
    </div>
  );
}

export default App;
