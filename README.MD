# SCIENCE POC

A POC made by Noe Horowitz

## Installation

There are two main parts to this application, Truffle and the Client, each with its own necessary packages.

All of these commands assume that you are starting in the root directory.


#### Truffle

[Truffle](https://trufflesuite.com/) is the framework used to code, test, compile and deploy the smart contracts for this application, it is necessary if you are making any changes to the smart contracts

```bash
> npm install
```

#### Client

The Client is the front end of the application, this is where most of the application lies. It is built using [React](https://reactjs.org/).

```bash
> cd .\client\
> npm install
```

## Usage

#### Truffle

Uploading a new smart contract can be complicated as it requires multiple steps to be done in the correct order.

```bash
> truffle develop
> truffle migrate
```

This will redeploy the original contracts, this can take a few minutes.

Once that has been done, the new contracts' ABI will automatically be copied into the .\client\src\contracts folder.

#### Client

Running the client works as follows:

```bash
> cd .\client\
> npm run start
```

This will start a live version of the React Server.
