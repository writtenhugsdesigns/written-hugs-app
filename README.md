# Written Hugs Creator Tool

## Table of Contents
- [Description](#description)
- [Usage](#usage)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)
  
## Description
Duration: 3 weeks sprint



## Usage

## Demo
View a demo walking through the features of this app [here](https://www.youtube.com/watch?v=VLI2vKHr48E)

## Prerequisites
This application requires the following technologies and libraries:
* Node.js
* PG
* Axios
* Express
* Redux-Saga
* React
* PostgreSQL database manager
* Material UI
* Sweet Alerts 2
* Passport
* Multer
* PrintJS
* React CSV
* Google Auth Library

For a full list of dependencies, please refer to the [package.json](package.json).

## Installation
To install this application on your local device:
1. Fork and clone this repository
2. Run ``` npm install ``` to get all necessary dependencies to run the application
3. Create a .env file in the base repository folder
4. Define a ``` SERVER_SESSION_SECRET ``` and Google Drive API credentials in the .env using the following structure:
   ```
   SERVER_SESSION_SECRET = {insert value here}
   type = service_account
   project_id = {insert value here}
   private_key_id = {insert value here}
   private_key = {insert value here}
   client_email = {insert email here}
   client_id = {insert value here}
   auth_uri = {insert uri here}
   token_uri = {insert uri here}
   auth_provider_x509_cert_url = {insert url here}
   client_x509_cert_url = {insert url here}
   universe_domain = googleapis.com
   ```
5. Create a PostgreSQL database named ```written-hugs``` using a database manager (we used Postico) and run the queries in [database.sql](database.sql).
6. Start the server using ```npm run server```
7. Start the client using ```npm run client```. Vite will display the port the client is running on.
8. Navigate to localhost:{insert port here}/#/home
9. Login using admin credentials

## Deployment


## Authors
This application was created by [Mark Klein](https://github.com/kleincentral), [Hannah Bjorklund](https://github.com/hannahbjorklund), [James Woods](https://github.com/jamesdtwoods), and [Ryan Kjesbo-Johnson](https://github.com/RyanKjesboJohnson) for Written Hugs Designs.

## Acknowledgements
This project was developed under the tutelage of [Prime Digital Academy](https://www.primeacademy.io/?utm_campaign=brand_search&utm_medium=cpc&utm_source=google&utm_medium=ppc&utm_campaign=Brand+Search&utm_term=prime%20digital%20academy&utm_source=adwords&hsa_mt=b&hsa_kw=prime%20digital%20academy&hsa_grp=34455376016&hsa_tgt=kwd-315051457809&hsa_ad=665947820597&hsa_ver=3&hsa_acc=5885076177&hsa_cam=670836869&hsa_src=g&hsa_net=adwords&gad_source=1&gclid=Cj0KCQiA5rGuBhCnARIsAN11vgSkwy6YBKtx7R4OmyctPvuM6FXI4A1XErI-O91IigXJQn8tEIInGvAaAp4REALw_wcB)
