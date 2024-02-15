# Written Hugs Creator Tool

## Table of Contents
- [Description](#description)
- [Usage](#usage)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)
  
## Description
Duration: 3 weeks sprint

This application was created for Christi Kmecik, owner of Written Hugs Designs, to help her better manage her files for her business. Christi creates custom greeting cards that often address difficult feelings and situations in a genuine and caring way. Christi's previous process involved her doing all file and image formatting for her cards and wholesaler pitches on her own. This included creating folders for her cards, making pitch documents and spreadsheets for wholesalers, and gathering many files together from multiple places, all on her iPad. The Written Hugs application was created to automate away much of the formatting process and provide Christi with a secure cloud storage method. This app makes and organizes folders for her in the connected Google Drive via the Google Drive API. It also creates her pitch documents and spreadsheets and allows her to view all her data in one accessible place. Overall, this should save time and energy that Christi can now invest into growing her business further and spreading love with her amazing and thoughtful cards.

## Usage
1. **Login**: The admin can log in using their credentials
2. **Admin Home**: Upon logging in, the admin will be directed to the home page, where they can navigate to manage cards, wholesalers, and pitches
3. **Card Management**: Admin can view all existing cards on this page as sorted by card category. The admin can also add a new card by clicking the 'New Card' button, and view, edit, or delete a specific card by clicking one of the corresponding buttons in the table row for that card.
4. **Category Management**: Admin can click on the 'Manage Categories' button on the Card Management page to navigate to the categories page. Here they can view all existing card categories. Clicking 'Add Category' will allow them to add a new category. The admin can also edit and delete specified categories using the 'Edit' and 'Delete' buttons. The admin can also add categories on individual card view
5. **Wholesaler Management**: Clicking on  the 'Manage Wholesalers' button will navigate the admin to the wholesaler page, where they can add, edit, and delete wholesalers. Wholesalers can be assigned to pitches on the Review or Edit Pitch pages
6. **Pitch Creation**:  Admin can interact with  a pitch creation "shopping interface" where they can add or remove singular cards from their cart, or add/remove all cards in a given category. Admin also can view cards. When they are done adding cards, clicking the Review Cart button will prompt them to review the cards again, also with the option to remove cards. Admin can assign a name, description, and wholesaler to a pitch and hit the 'Save Pitch' button to save to the database. Admin can also view and manage pitch history on  the 'Manage Pitches' page.


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

## Authors
This application was created by [Mark Klein](https://github.com/kleincentral), [Hannah Bjorklund](https://github.com/hannahbjorklund), [James Woods](https://github.com/jamesdtwoods), and [Ryan Kjesbo-Johnson](https://github.com/RyanKjesboJohnson) for Written Hugs Designs.

## Acknowledgements
This project was developed under the tutelage of [Prime Digital Academy](https://www.primeacademy.io/?utm_campaign=brand_search&utm_medium=cpc&utm_source=google&utm_medium=ppc&utm_campaign=Brand+Search&utm_term=prime%20digital%20academy&utm_source=adwords&hsa_mt=b&hsa_kw=prime%20digital%20academy&hsa_grp=34455376016&hsa_tgt=kwd-315051457809&hsa_ad=665947820597&hsa_ver=3&hsa_acc=5885076177&hsa_cam=670836869&hsa_src=g&hsa_net=adwords&gad_source=1&gclid=Cj0KCQiA5rGuBhCnARIsAN11vgSkwy6YBKtx7R4OmyctPvuM6FXI4A1XErI-O91IigXJQn8tEIInGvAaAp4REALw_wcB)
