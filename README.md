# pyrrha-market
Pyrrha PandoraBoxchain Market desktop application

## Setup  
### Install dependencies  
```sh
npm i
```
### Initialize external `pyrrha-consensus` module
```sh
git submodule update --recursive --remote
```
### Obtain curretly active root contracts addresses  
```sh
curl http://api.pandora.network/system/addresses 
{ Pandora: '0x40211d2982951a0bfdfde20a0a0000f3ee5299ac',
  PandoraMarket: '0xf3037d5b0a6077a1098f99d2c5b74cbed0ddef1a' }
```  
*...and provide these addresses in application config during setup.*

## Start
```sh
npm start
```
