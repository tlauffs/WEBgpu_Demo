const canvas = document.querySelector("canvas");
if (!navigator.gpu) {
  alert(
    "Your Browser doesn't support the WebGPU Api, please use a up to date version of Chrome (or a diffrent Chromium based browser) to try the demo."
  );
  throw new Error("WebGPU not supported on this browser.");
} else {
  console.log("WebGPU supported");
}

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  alert(
    "Your Browser supports the WebGPU Api, but something still went wrong :(. This could be due to hardware issues."
  );
  throw new Error("No appropriate GPUAdapter found.");
}

const device = await adapter.requestDevice();
console.log("Device: ", device);

const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device: device,
  format: canvasFormat,
});

const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
  colorAttachments: [
    {
      view: context.getCurrentTexture().createView(),
      loadOp: "clear",
      clearValue: [ 0, 0, 0.4, 1 ],
      storeOp: "store",
    },
  ],
});
pass.end();
const commandBuffer = encoder.finish();
device.queue.submit([commandBuffer]);