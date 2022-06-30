/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const loadCryptoModule = import("https://scotwatson.github.io/WebCrypto/Crypto.mjs");

  /*
loadCryptoModule.then(function (module) {
  console.log(Object.getOwnPropertyNames(module));
}, console.error);

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

Promise.all( [ loadWindow, loadCryptoModule ] ).then(start, fail);

function start( [ loadEvt, cryptoModule ] ) {
  async function test_encrypt(plaintext, key, iv) {
    const startTime = Performance.now();
    const ciphertext = await cryptoModule.encrypt_AES256_CBC(plaintext, key, iv);
    const plaintext2 = await cryptoModule.decrypt_AES256_CBC(ciphertext, key, iv);
    const endTime = Performance.now();
    return {
      plaintextB: plaintext2,
      duration: endTime - startTime,
    };
  }
  const test_promises = [];
  for (let i = 0; i < 10000; ++i) {
    const plaintextA = new ArrayBuffer(64);
    const keyA = new ArrayBuffer(32);
    const ivA = new ArrayBuffer(16);
    getRandomValues(new Uint8Array(plaintextA));
    getRandomValues(new Uint8Array(keyA));
    getRandomValues(new Uint8Array(ivA));
    const myPromise = test_encrypt(plaintextA, keyA, ivA);
    myPromise.catch(alert);
    test_promises.push(myPromise);
  }
  Promise.all(test_promises).then(function (results) {
    let totalTime = 0;
    for (const obj of results) {
      totalTime += obj.duration;
    }
    console.log("Avg time (ms):", (totalTime / results.length));
  });
}


function fail(error) {
  document.body.appendChild(document.createTextNode(error.message));
}
  */
