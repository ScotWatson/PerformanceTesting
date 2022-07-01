/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const loadCryptoModule = import("https://scotwatson.github.io/WebCrypto/Crypto.mjs");

loadCryptoModule.then(function (module) {
  console.log(Object.getOwnPropertyNames(module));
}, console.error);

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

Promise.all( [ loadWindow, loadCryptoModule ] ).then(start, fail);


// Make sure no other events are being added to the event loop, as a promise may yield to other events.
// This includes other promises, setTimeout, setInterval, requestAnimationFrame, and garbage collection
function test_promise_performance( { create_args, test_promise, report_average, report_stdev } ) {
  const sample_length = 100;
  const durations = [];
  async function time_promise(durations) {
    const startTime = performance.now();
    const args = create_args();
    const { ciphertext } = await test_promise( args );
    const endTime = performance.now();
    if (durations.length >= sample_length) {
      durations.shift();
    }
    durations.push(endTime - startTime);
  }
  function calc() {
    return {
      average: calc_average(durations),
      stdev: calc_stdev(durations),
    };
  }
  let myPromise = Promise.resolve();
  for(let i = 0; i < sample_length; ++i) {
    myPromise = myPromise.then(time_promise(durations));
  }
  myPromise = myPromise.then(calc);
  return await myPromise;
  function calc_average(array) {
    let total = 0;
    for (const elem of array) {
      total += elem;
    }
    const result = (total / array.length);
    report_average(result);
  }
  function calc_stdev(array) {
    let total = 0;
    for (const elem of array) {
      total += (elem * elem);
    }
    const result = Math.sqrt(total) / (array.length - 1);
    report_stdev(result);
  }
}

function start( [ loadEvt, cryptoModule ] ) {
  const size = 32768;
  const p_of_average = document.createElement("p");
  const lbl_of_average = document.createTextNode("Average: ");
  const div_of_average = document.createElement("div");
  p_of_average.appendChild(lbl_of_average);
  p_of_average.appendChild(div_of_average);
  document.body.appendChild(p_of_average);
  const p_of_stdev = document.createElement("p");
  const lbl_of_stdev = document.createTextNode("Std Dev: ");
  const div_of_stdev = document.createElement("div");
  p_of_stdev.appendChild(lbl_of_stdev);
  p_of_stdev.appendChild(div_of_stdev);
  document.body.appendChild(p_of_stdev);
  function getSample() {
    const plaintext = new Uint8Array(size);
    const key = new Uint8Array(32);
    const iv = new Uint8Array(16);
    test_promise_performance( {
      create_args: function () {
        cryptoModule.getRandomValues(plaintext);
        cryptoModule.getRandomValues(key);
        cryptoModule.getRandomValues(iv);
        return {
          plaintext,
          key,
          iv,
        };
      },
      test_promise: cryptoModule.encrypt_AES256_CBC,
      report_average: function (average) {
        div_of_average.innerHTML = average;
      },
      report_stdev: function (stdev) {
        div_of_stdev.innerHTML = stdev;
      },
    } );
  }
  setInterval(getSample, 1000);
}

function fail(error) {
  document.body.appendChild(document.createTextNode(error.message));
}
