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
function test_promise_performance( { create_args, test_promise, iterations } ) {
  const sample_length = iterations;
  async function time_promise(durations_array) {
    const args = create_args();
    const startTime = performance.now();
    await test_promise( args );
    const endTime = performance.now();
    durations_array.push(endTime - startTime);
    return durations_array;
  }
  function calc(durations_array) {
    const retVal = {
      sum_value: calc_sum(durations_array),
      stdev: calc_stdev(durations_array),
      num_samples: sample_length,
    };
    return retVal;
  }
  let myPromise = time_promise([]);
  for (let i = 1; i < sample_length; ++i) {
    myPromise = myPromise.then(time_promise);
  }
  myPromise = myPromise.then(calc);
  return myPromise;
  function calc_sum(array) {
    let total = 0;
    for (const elem of array) {
      total += elem;
    }
    return total;
  }
  function calc_stdev(array) {
    let total = 0;
    for (const elem of array) {
      total += (elem * elem);
    }
    return Math.sqrt(total) / (sample_length - 1);
  }
}

function start( [ loadEvt, cryptoModule ] ) {
  let size = 32768;
  let acc_sum_value = 0;
  let acc_num_samples = 0;
  let num_iterations = 1;
  const div_of_size = document.createElement("div");
  document.body.appendChild(div_of_size);
  const btn_inc_size = document.createElement("button");
  btn_inc_size.innerHTML = "Increase Size";
  btn_inc_size.addEventListener("click", function () {
    acc_sum_value = 0;
    acc_num_samples = 0;
    size *= 2;
    div_of_size.innerHTML = size;
  });
  document.body.appendChild(btn_inc_size);
  const btn_dec_size = document.createElement("button");
  btn_dec_size.innerHTML = "Decrease Size";
  btn_dec_size.addEventListener("click", function () {
    acc_sum_value = 0;
    acc_num_samples = 0;
    size /= 2;
    div_of_size.innerHTML = size;
  });
  document.body.appendChild(btn_dec_size);

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
  let startTime;
  let endTime;
  let testTime;
  function getSample() {
    startTime = performance.now();
    const plaintext = new Uint8Array(size);
    const key = new Uint8Array(32);
    const iv = new Uint8Array(16);
    test_promise_performance( {
      create_args: function () {
        cryptoModule.getRandomArray(plaintext);
        cryptoModule.getRandomValues(key);
        cryptoModule.getRandomValues(iv);
        return {
          plaintext,
          key,
          iv,
        };
      },
      test_promise: cryptoModule.encrypt_AES256_CBC,
      iterations: num_iterations,
    } ).then(function (result) {
      acc_num_samples += result.num_samples;
      acc_sum_value += result.sum_value;
      const average = acc_sum_value / acc_num_samples;
      const stdev = result.stdev;
      div_of_average.innerHTML = Math.round(average * 100) / 100;
      div_of_stdev.innerHTML = Math.round(stdev * 100) / 100;
      endTime = performance.now();
    } ).then(function () {
      testTime = endTime - startTime;
      console.log("Test time:", testTime);
      if (testTime < 100) {
        num_iterations *= 2;
      } else if (testTime > 250) {
        num_iterations /= 2;
      }
    } );
  }
  setInterval(getSample, 500);
}

function fail(error) {
  document.body.appendChild(document.createTextNode(error.message));
}
