export default class PitchNode extends AudioWorkletNode {
  init(wasmBytes, onPitchDetectedCallback, numAudioSamplesPerAnalysis) {
    this.onPitchDetectedCallback = onPitchDetectedCallback;
    this.numAudioSamplesPerAnalysis = numAudioSamplesPerAnalysis;

    this.port.onmessage = (event) => this.onmessage(event.data);

    this.port.postMessage({
      type: "send-wasm-module",
      wasmBytes,
    });
  }

  onprocessorerror(err) {
    console.log(
      `An error from AudioWorkletProcessor.process() occurred: ${err}`
    );
  }

  onmessage(event) {
    if (event.type === "wasm-module-loaded") {
      this.port.postMessage({
        type: "init-detector",
        sampleRate: this.context.sampleRate,
        numAudioSamplesPerAnalysis: this.numAudioSamplesPerAnalysis,
      });
    } else if (event.type === "pitch") {
      this.onPitchDetectedCallback(event.pitch);
    }
  }
}
