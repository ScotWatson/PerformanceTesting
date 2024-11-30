/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const urlSelf = new URL("./", self.location);
let testFile;

function cleanRequest(request) {
  return new Request(request.url, {
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    headers: request.headers,
    integrity: request.integrity,
    keepalive: request.keepalive,
    method: request.method,
    mode: (request.mode === "navigate") ? "cors" : request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
}

self.addEventListener("messageerror", (e) => {
  console.log("sw.js message error");
});
self.addEventListener("message", (e) => {
  console.log("message received");
  if (typeof e.data === "object" && e.data !== null) {
    switch (e.data.command) {
      case "loadTest": {
        testFile = e.data.file;
        console.log("test file loaded");
        break;
      }
      default: {
        // do nothing
      }
    }
  }
});
self.addEventListener("install", (e) => {
  testFile = null;
});
self.addEventListener("fetch", (e) => {
  async function getResponse(request) {
    console.log(request);
    if (request.url === new URL("./test.js", urlSelf)) {
      return new Response(testFile, {
        status: 200,
        statusText: "ok",
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      });
  } else if (request.url.startsWith(urlSelf)) {
      const rawResponse = await fetch(cleanRequest(request));
      const newHeaders = new Headers(rawResponse.headers)
      newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
      newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
      return new Response(rawResponse.body, {
        status: rawResponse.status,
        statusText: rawResponse.statusText,
        headers: newHeaders,
      });
    } else {
      return await fetch(cleanRequest(request));
    }
  }
  e.respondWith(getResponse(e.request));
});
