# workdaychain

Para instalar y ejecutar la DApp, hay que seguir los siguientes pasos:

1. Instalamos Node.js.

```
$ sudo apt install nodejs
```


1. Instalamos la herramienta Node Package Manager.

```
$ sudo apt install npm
```

2. Instalamos Ganache para ejecutar una Blockchain en local.

```
$ sudo npm install -g ganache-cli
```

3. Instalamos Truffle para poder compilar y migrar los Smart Contracts.

```
$ sudo npm install -g truffle
```

4. Instalamos Git para poder clonar el repositorio.

```
$ sudo apt install git
```

5. En el directorio en el que queremos tener el proyecto, clonamos el repositorio.

```
$ git clone git@github.com:juanfornell/workdaychain.git
```

6. Antes de ejecutar la DApp, necesitamos instalar los siguientes paquetes.

```
$ npm install webpack
$ npm install webpack-cli
$ npm install web3
$ npm install copy-webpack-plugin
$ npm install webpack-dev-server
```

Para ejecutar la DApp, abrimos tres terminales:

1. En el primero, desde el directorio *workdaychain* lanzamos Ganache con las opciones necesarias para permitir contratos sin límite de tamaño.

```
$ ganache-cli --gasLimit=0x1fffffffffffff --allowUnlimitedContractSize -e 1000000000
```

2. En el segundo terminal, desde el directorio *workdaychain* compilamos y migramos los Smart Contracts a la Blockchain de Ganache.

```
$ truffle migrate --network development
```

3. En el tercer terminal, desde el directorio *workdaychain/app* construimos el proyecto y lo ejecutamos.

```
$ npm run build
$ npm run dev
```

Ahora podemos abrir en el navegador *http://localhost:8080/* para interactuar con la DApp. Para ello, necesitaremos haber instalado también la extensión de MetaMask para nuestro navegador y conectarlo a la red privada de Ganache a través del puerto 8545.

