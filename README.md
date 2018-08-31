## Overview
MobikeGo is a system of a smart seat locks that enable a peer-to-peer bike-sharing network. Those with unused bikes can contribute the bike to the scheme by installing the seat lock. The solution adds value to providers by allowing them to monetize their bikes, and guarantee security by being on a Blockchain network.
This project was made during **TechCrunch Shenzhen Hackathon 2017** for the DianRong & Mobike challenge and awarded **third place overall**.

## Inspiration
We are a diverse group of hackers from Mainland China, Hong Kong, and Canada. When we visit Shenzhen for TechCrunch, we are shocked by the amount of shared dock-less bikes. They are sometimes overcrowded and mostly broken (cannot be unlocked or missing parts). It is a huge waste of resources because China already has a massive bike population just sitting around in people's home. Besides, Some of the mass-produced share-biking models are not comfortable to ride and we would rather ride on nicer bikes.
To summarize, the problems with existing shared-biking systems are: high idle bike rate (low income), high damage rate, high bike transport fee, bikes are not designed for leisure and pleasant rides, and bikes have too little options.

## What it does
Mobike Go is a smart bike seat that fits on almost all existing bikes because the bike frame connecting the seat are almost identical. Providers can install these bike seats on their own nice bikes, and send these bikes on the streets for consumers to use. Consumers are able to find nice bikes and unlock/lock them just like a normal Mobike, but with a much better experience. Consumers will be charged based on the distance, time, and model of the bike ride and the providers are able to earn extra revenue with their seldomly used bikes. The providers can recall their bike by posting rewards for others to ride them back. The bike lock is built on an IoT system that can access the internet, and all transactions are recorded on a blockchain to ensure safety.

## Why it matters
It provides value for:
* **Provider** - generate income in efficient way to utilize idle resources.
* **Users** - better biking experience, more bike diversities, better bike options.
* **Mobike** - differentiate from their competitors with high-end options, reduce bike repairs, reduce bike transfers, gain more bikes under the ecosystem.

## User Experience
#### Provider
1. Order MobikeGo system from Mobike.
2. Register and install on his/her own bike. Put the bike on streets.
3. Earn money if others ride their bikes, can always check their bike's location.
4. Recall bike by posting offers for people to ride it back.

#### User
1. Register and find a MobikeGo bike.
2. Unlock with the lock code shown in the app after scanning the QR code.
3. Ride and re-lock it to end charging. Pay for fee based on the distance, time, and model of bikes.

## How we built it
* **Mobile** - We used react to build a web app that includes map, QR code scanning, and payment system.
* **IoT System** - We used Ruff IoT Board to get lock status and update to a server.
* **Blockchain** - We used DianRong's BaaS (Blockchain as a Service) system.

## Challenges we ran into
* Building an IoT system with a blockchain services.
* Going to bike shops in Shenzhen to get bike locks.
* Auto small-amount insurance systems for each transactions.

## What we Learned
* This is our first time integrating a new Blockchain as a Service System with an IoT system.
* First time working with a shared-biking company in a hackathon.

## What's next for MobikeGo
* Integrate with social credit system using blockchain so that the MobikeGo score can be useful for ratings in other services.
* Provide categorical options such as children bikes.

Here is a link to our [report](https://technode.com/2017/06/19/techcrunch-shenzhen-2017-hackathon-2/) by TechNode.
