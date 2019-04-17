import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import companyArtifact from "../../build/contracts/Company.json";

let accounts;
let account;

const App = {
  web3: null,
  meta: null,
  company: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      const deployedCompany = companyArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      this.company = new web3.eth.Contract(
        companyArtifact.abi,
        deployedCompany.address,
      );

      // get accounts
      accounts = await web3.eth.getAccounts();
      account = accounts[0];

      
      this.refreshAddress(account);
      this.refreshTable();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshAddress: async function (_adress) {
    const addressElement = document.getElementById('address');
    addressElement.innerHTML = _adress;
  },

  _getNumberTracks: async function(_account) {
    const { getNumberTracks } = this.company.methods;
    const n = await getNumberTracks(_account).call();
    return n;
  },

  _getTrack: async function(_account, i) {
    const { getTrack } = this.company.methods;
    const n = await getTrack(_account, i).call();
    return n;
  },

  _getWorker: async function(i) {
    const { getWorker } = this.company.methods;
    const n = await getWorker(i).call();
    return n;
  },

  _getNumberWorkers: async function() {
    const { getNumberWorkers } = this.company.methods;
    const n = await getNumberWorkers().call();
    return n;
  },

  validate: async function(_account, i) {
    const { validate } = this.company.methods;
    await validate(_account, i).send({ from: account });
    console.log('validada address: ', _account,' track: ',i)
    this.refreshTable();
  },

  refreshTable: function() {

    this._getNumberWorkers().then(value => {

      var html = "<table><tr><thead>\
      <tr>\
        <th>Worker</th>\
        <th>IdTrack</th>\
        <th>Fecha</th>\
        <th>Categoría</th>\
        <th>Observaciones</th>\
        <th>Lugar</th>\
        <th>Validado</th>\
      </tr>\
    </thead>";
    for (let j = 0; j < value; j++) {
      this._getWorker(j).then(value_address => {
    
      this._getNumberTracks(value_address).then(value => {
        for (let i = 0; i < value; i++) {
          this._getTrack(value_address,i).then(value => {
          var tr = document.createElement('tr');
              if(value[4] == true) {
              tr.innerHTML= "<td>"+value_address+"</td>"+
                      "<td>" + i + "</td>" +
                      "<td>"+value[0]+"</td>"+
                      "<td>"+value[1]+"</td>"+
                      "<td>"+value[2]+"</td>"+
                      "<td>"+value[3]+"</td>"+
                      "<td><input type='checkbox' name='my_check'"+i+" checked="+value[4]+" onchange='App.validate(\""+value_address+"\","+i+")' disabled></td>";
                      document.getElementById("container").appendChild(tr);
              } else {
                tr.innerHTML= "<td>"+value_address+"</td>"+
                      "<td>" + i + "</td>" +
                      "<td>"+value[0]+"</td>"+
                      "<td>"+value[1]+"</td>"+
                      "<td>"+value[2]+"</td>"+
                      "<td>"+value[3]+"</td>"+
                      "<td><input type='checkbox' name='my_check'"+i+" onchange='App.validate(\""+value_address+"\","+i+")'></td>";
                      document.getElementById("container").appendChild(tr);
              }
        });
        html += "</tr></table>";
      }
    });
      
      });
    }
    document.getElementById("container").innerHTML = html;
    });
  },

  redirect: async function() {
    const { existsCompany } = this.company.methods;
    const checkCompany = await existsCompany().call();
    const { getCompanyAddress } = this.company.methods;
    const addressCompany = await getCompanyAddress().call();
    const { isWorker } = this.company.methods;
    const checkWorker = await isWorker(account).call();

    if(checkCompany == false) {
      document.location.href = "./register.html";
    } else {
      if(addressCompany == account) {
        document.location.href = "./index.html";
      }
      else {
        if(checkWorker == true) {
          document.location.href = "./worker.html";
        } else {
          document.location.href = "./notRegistered.html";
        }
      }
    }
  },

  refreshBalance: async function() {
    const { getDummy } = this.company.methods;
    const balance = await getDummy().call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  addNewWorker: async function() {
    const workerAddress = document.getElementById('workerAddress').value;
    const workerId = document.getElementById('workerId').value;
    this.setStatus('Iniciando transacción... (por favor espere)');
    const { addWorker } = this.company.methods;
    await addWorker(workerAddress, workerId).send({ from: account });
    this.setStatus("Transaction complete!");
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { sendCoin } = this.meta.methods;
    await sendCoin(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  // Refresh page if address changes
  var accountInterval = setInterval(async function() {
    let currentAccounts = await App.web3.eth.getAccounts();
    let currentAccount = currentAccounts[0];
    if (currentAccount !== account) {
      account = currentAccount;
      //window.location.reload();
      App.redirect();
    }
  }, 100);

  App.start();
});
