/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const urlSelf = new URL("./", self.location);
let testFile;

console.log("set message listener");
self.addEventListener("message", (e) => {
  if (typeof e.data === "object" && e.data !== null) {
    switch (e.data.command) {
      case "loadTest": {
        testFile = e.data.file;
      }
      default: {
        // do nothing
      }
    }
  }
});
console.log("set install listener");
self.addEventListener("install", (e) => {
  testFile = null;
});
console.log("set activate listener");
self.addEventListener("fetch", (e) => {
  async function getResponse(request) {
    if (request.url === new URL("./test.js", urlSelf)) {
      return new Response(testFile, {
        status: 200,
        statusText: "ok",
        headers: {
          [ "Cross-Origin-Opener-Policy", "same-origin" ],
          [ "Cross-Origin-Embedder-Policy", "require-corp" ],
        },
      });
  } else if (request.url.startsWith(urlSelf)) {
      const rawResponse = await fetch(request);
      rawResponse.set("Cross-Origin-Opener-Policy", "same-origin");
      rawResponse.set("Cross-Origin-Embedder-Policy", "require-corp");
      return new Response(rawResponse.body, {
        status: rawResponse.status,
        statusText: rawResponse.statusText,
        headers: rawResponse.headers,
      });
    } else {
      return await fetch(request);
    }
  }
  e.respondWith(getResponse(e.request));
});
