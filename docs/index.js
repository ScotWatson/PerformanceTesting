/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

window.addEventListener("load", () => {
  const divHeader = document.createElement("div");
  document.body.appendChild(divHeader);
  const divBody = document.createElement("div");
  document.body.appendChild(divBody);

  if (window.crossOriginIsolated) {
    const inpFile = document.createElement("input");
    inpFile.type = "file";
    inpFile.addEventListener("change", () => {
      console.log("send message");
      (async () => {
        const data = await inpFile.files[0].arrayBuffer();
        self.navigator.serviceWorker.controller.postMessage({
          command: "loadTest",
          file: data,
        }, [ data ]);
      })();
    });
    divHeader.appendChild(inpFile);
    const btnLoadTest = document.createElement("button");
    btnLoadTest.innerHTML = "Load Test";
    btnLoadTest.addEventListener("click", () => {
      const script = document.createElement("script");
      script.src = new URL("./test.js", self.location);
      document.body.appendChild(script);
    });
    divHeader.appendChild(btnLoadTest);
  } else {
    (async () => {
      const registration = await self.navigator.serviceWorker.register("./sw.js");
      window.location.reload();
    })();
  }
});
