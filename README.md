<<<<<<< HEAD
# Gridlocked Cryptizer - Vehicle Auction System

A Java Swing application for a vehicle auction system where users can register, login, and place bids on vehicles.

## Setup Instructions

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- MySQL Server 5.7 or higher

### Database Setup
1. Install MySQL Server if you haven't already
2. The application will automatically create the database and tables when it starts up.

   Alternatively, you can manually run the SQL script located at `src/database_schema.sql`:
   ```
   mysql -u root -p < src/database_schema.sql
   ```
   This will create the `gridlocked_cryptizer` database with the necessary tables and sample data.

### MySQL JDBC Driver Setup
1. Download the MySQL JDBC Driver (Connector/J) from the [MySQL website](https://dev.mysql.com/downloads/connector/j/)
2. Create a `lib` directory in the project root if it doesn't exist
3. Place the downloaded JAR file (e.g., `mysql-connector-java-8.0.28.jar`) in the `lib` directory

### Database Configuration
If needed, update the database connection settings in `src/DatabaseConnection.java`:
```java
private static final String URL = "jdbc:mysql://localhost:3306/gridlocked_cryptizer";
private static final String USER = "root"; // Your MySQL username
private static final String PASSWORD = "123"; // Your MySQL password
```

## Running the Application
1. Compile the Java files:
   ```
   javac -cp ".;lib/*" src/*.java
   ```
2. Run the application:
   ```
   java -cp ".;lib/*" src.GridlockedCryptizer
   ```

## Features
- User registration and login
- View available vehicles
- Place bids on vehicles
- Real-time updates of vehicle information

## Project Structure
- `src/Bidder.java` - Class representing a bidder
- `src/DatabaseConnection.java` - Handles database operations
- `src/GridlockedCryptizer.java` - Main application class with UI
- `src/Vehicle.java` - Class representing a vehicle
- `src/database_schema.sql` - SQL script for database setup

## Improvements Made
The following improvements have been made to the project:

1. **Added MySQL JDBC Driver Support**
   - Created a lib directory for the MySQL JDBC driver
   - Updated the project configuration to include the driver

2. **Enhanced Database Connectivity**
   - Added explicit JDBC driver loading
   - Improved error handling for database connection failures
   - Added detailed error messages for database-related issues

3. **Automatic Database Setup**
   - Added functionality to automatically create the database if it doesn't exist
   - Added functionality to automatically create tables if they don't exist
   - Added functionality to automatically insert sample data

4. **Improved Error Handling**
   - Added comprehensive error messages with troubleshooting steps
   - Added proper exception handling throughout the application
   - Added database connection testing at application startup

5. **Documentation**
   - Created a comprehensive README with setup instructions
   - Added SQL script for manual database setup
   - Added comments to explain key functionality
=======
# GridlockedCryptizer
GridlockedCryptizer is a simple and secure file encryption-decryption tool built using Java and MySQL. It allows users to encrypt and decrypt text-based data using a customized grid-based cipher and stores user data securely in a database. This project was developed as part of my BCA final year project
>>>>>>> 9b74b7d31cafbfbc75c47f3edbd7de61bb9cc4bf
