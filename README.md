# About appsmith_1
This project is a visitor management application built on Appsmith, primarily focused on RFID keyfob scanning for quick visitor lookup and reservation booking. It allows users to manage visitor contact profiles, handle space reservations, upload photos for identification, and provides mechanisms for application state reset and user authentication. The application interacts with a PostgreSQL database for persistent data storage, all orchestrated through a dynamic UI component layer.


## Sections
- Database Interaction (SQL Queries)
- UI Component Layer (Widgets)
- Global Application State (Appsmith Store)
- RFID and Visitor Flow Management (js_utils_rfid)
- Reservation Booking Logic (js_utils_reservation)
- Contact Data Management (js_utils_contact)
- Image Upload and Retrieval (js_utils_image)
- Application Reset and Initialization (js_utils_reset)

## You can visit this application for yourself! 
#### Click "View Application" to demo.
# [![](https://assets.appsmith.com/git-sync/Buttons.svg) ](https://app.appsmith.com/applications/652449ce5012274cbc5158f5/pages/652449cf5012274cbc5158fe) 

### This app is built using Appsmith, a low-code app/tooling web platform. 
- The app logic is written in JavaScript.
- The database logic is written in Javascript and SQL.
- The image metadata access and association to relational data is written in Javascript.

![](https://github.com/user-attachments/assets/e78d33ea-bda8-4358-a491-e6e55de2a2e4)
## Developers
- The datasource (backend) is built on Supabase. Appsmith UI/UX components are packaged for use in the Dashboard (Home Page) and other pages in this App. 
- The datasource's database schema and trigger-based functions are written in SQL on a PostgreSQL instance.
- The data endpoints and API connectors are written using Supabase's API wrappers.
- Asynchronous callback function have been written to facilitate data entry.
- Some optional features integrate with other services and libraries that can be partially omitted while retaining the app's core functionality. 
- Images are accessible through API calls to an Amazon S3 storage bucket which can be substituted to use alternative storage solutions for on-premise/cloud storage needs.

#

### Thank you to all the end users who provided vital feedback on workflow logic! App changes are driven by user feedback, as always. Feedback, issues, comments, and general appreciation are always welcome! :)

#
### You can visit the application using the below link
###### [![](https://assets.appsmith.com/git-sync/Buttons.svg) ](https://app.appsmith.com/applications/652449ce5012274cbc5158f5/pages/652449cf5012274cbc5158fe)
#
![](https://raw.githubusercontent.com/appsmithorg/appsmith/release/static/images/integrations.png)
### [Visit my Github](https://github.com/safmailas)
