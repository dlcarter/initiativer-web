import { default as UUID } from 'uuid/v4';

class Randomizer {

  roll20 = () => (Math.floor(Math.random() * 19) + 1);

  polyRoll = (num) => {
    var url = "https://api.random.org/json-rpc/2/invoke";
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc":"2.0",
        "method":"generateIntegers",
        "params": {
          "apiKey":"99447927-b59e-42be-b44a-573245a7c0e5",
          "n":num,
          "min":1,
          "max":20
        },
        "id":UUID()
      })
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      if (json && json.result && json.result.random && json.result.random.data) {
        return json.result.random.data;
      } else {
        throw(new Error("error"));
      }
    }).catch(function(e) {
      alert("Unable to read from random.org, using fake random");

      var roll = [];
      for (var i=0; i<num; i++) {
        roll[i] = this.roll20();
      }
      return roll;
    });
  }
}

export default Randomizer;