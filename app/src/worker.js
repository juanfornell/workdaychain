import Web3 from "web3";
import companyArtifact from "../../build/contracts/Company.json";

let accounts;
let account;

const App = {
  web3: null,
  company: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedCompany = companyArtifact.networks[networkId];
      this.company = new web3.eth.Contract(
        companyArtifact.abi,
        deployedCompany.address,
      );

      // get accounts
      accounts = await web3.eth.getAccounts();
      account = accounts[0];

      this.refreshTable();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  createNewTrack: async function() {
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const observations = document.getElementById('observations').value;
    const location = document.getElementById('location').value;

    this.setStatus('Iniciando transacción... (por favor espere)');

    const { addTrack } = this.company.methods;
    await addTrack(date, category, observations, location).send({ from: account });

    this.setStatus('Horas registradas correctamente.');
    this.refreshTable();
    //this.redirect();
  },

  _getNumberTracks: async function() {
    const { getNumberTracks } = this.company.methods;
    const n = await getNumberTracks(account).call();
    return n;
  },

  _getTrack: async function(i) {
    const { getTrack } = this.company.methods;
    const n = await getTrack(account, i).call();
    return n;
  },

  refreshTable: function() {
    
    this._getNumberTracks().then(value => {

    var html = "<table><tr><thead>\
              <tr>\
                <th>ID</th>\
                <th>Fecha</th>\
                <th>Categoría</th>\
                <th>Observaciones</th>\
                <th>Lugar</th>\
                <th>Validado</th>\
              </tr>\
            </thead>";

    for (let i = 0; i < value; i++) {
      this._getTrack(i).then(value => {
      var tr = document.createElement('tr');
      if(value[4] == true) {
          tr.innerHTML= "<td>" + i + "</td>" +
                      "<td>"+value[0]+"</td>"+
                      "<td>"+value[1]+"</td>"+
                      "<td>"+value[2]+"</td>"+
                      "<td>"+value[3]+"</td>"+
                      "<td><input type='checkbox' name='my_check'"+i+" checked="+value[4]+" disabled></td>";
          document.getElementById("container").appendChild(tr);
        } else {
          tr.innerHTML= "<td>" + i + "</td>" +
                      "<td>"+value[0]+"</td>"+
                      "<td>"+value[1]+"</td>"+
                      "<td>"+value[2]+"</td>"+
                      "<td>"+value[3]+"</td>"+
                      "<td><input type='checkbox' name='my_check'"+i+" disabled></td>";
          document.getElementById("container").appendChild(tr);
          console.log(tr);
        }
      });
    }
    html += "</tr></table>";
      // ATTACH HTML TO CONTAINER
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
    console.log(checkCompany);
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
