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

=======
# GridlockedCryptizer - Vehicle Auction Management System

A modern web-based vehicle auction management system built with HTML, CSS, Vanilla JavaScript frontend and Node.js + Express + SQLite backend.

## 🚗 Features

### Core Functionality
- **Vehicle Management**: Add, edit, view, and manage vehicle inventory
- **Auction System**: Create and manage live auctions with real-time bidding
- **User Management**: Role-based access control (Admin, Auctioneer, Bidder)
- **Dashboard Analytics**: Real-time statistics and reporting
- **Search & Filter**: Advanced filtering by make, model, condition, status
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Advanced Features
- **Real-time Bidding**: Live auction updates and bid tracking
- **Watchlist**: Users can track vehicles they're interested in
- **Notifications**: System notifications for auction updates
- **Audit Trail**: Complete logging of system activities
- **Image Management**: Multiple images per vehicle
- **Reserve Pricing**: Set minimum acceptable bids

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Font Awesome**: Icons and visual elements

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite**: Lightweight, file-based database
- **bcryptjs**: Password hashing and authentication
- **CORS**: Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd gridlocked-cryptizer
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Initialize the database**
   \`\`\`bash
   npm run init-db
   npm run seed-db
   \`\`\`

4. **Start the server**
   \`\`\`bash
   npm start
   # or for development with auto-reload
   npm run dev
   \`\`\`

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The frontend will be served automatically by the Express server

## 🗄 Database Schema

### Main Tables
- **users**: User accounts and authentication
- **vehicles**: Vehicle inventory and details
- **auctions**: Auction events and scheduling
- **bids**: Bid history and tracking
- **vehicle_images**: Multiple images per vehicle
- **watchlist**: User vehicle tracking
- **notifications**: System notifications
- **audit_log**: Activity logging

### Key Relationships
- Users can place multiple bids
- Vehicles can have multiple auctions
- Auctions contain multiple bids
- Users can watch multiple vehicles

## 🔧 API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get specific auction
- `POST /api/auctions` - Create new auction
- `PUT /api/auctions/:id` - Update auction

### Bids
- `GET /api/bids/:auctionId` - Get bids for auction
- `POST /api/bids` - Place new bid

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User authentication

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 Frontend Structure

\`\`\`
frontend/
├── index.html          # Main application page
├── styles.css          # All CSS styles
├── app.js             # Main JavaScript application
└── assets/            # Images and other assets
\`\`\`

### Key JavaScript Functions
- **Navigation**: Single-page application routing
- **API Integration**: RESTful API communication
- **Real-time Updates**: Dynamic content updates
- **Form Handling**: Vehicle and bid form processing
- **Search & Filter**: Client-side filtering logic

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Controlled cross-origin requests
- **Role-based Access**: Different permissions for user roles

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface for smartphones

## 🚀 Deployment

### Production Setup
1. Set environment variables:
   \`\`\`bash
   export NODE_ENV=production
   export PORT=3000
   \`\`\`

2. Install production dependencies:
   \`\`\`bash
   npm install --production
   \`\`\`

3. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

### Docker Deployment (Optional)
\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
COPY frontend/ ./frontend/
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🧪 Testing

### Manual Testing
1. **Vehicle Management**: Add, edit, and delete vehicles
2. **Auction Creation**: Create auctions and verify timing
3. **Bidding Process**: Place bids and verify updates
4. **User Roles**: Test different permission levels
5. **Search/Filter**: Verify filtering functionality

### API Testing
Use tools like Postman or curl to test API endpoints:
\`\`\`bash
# Get all vehicles
curl http://localhost:3000/api/vehicles

# Create new vehicle
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"make":"Toyota","model":"Corolla","year":2020,...}'
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added user authentication and roles
- **v1.2.0**: Enhanced UI and mobile responsiveness
- **v1.3.0**: Added real-time bidding and notifications

---

**GridlockedCryptizer** - Modernizing vehicle auction management for the digital age.
>>>>>>> 9e5c21e (Initial commit - GridlockedCryptizer simplified stack)
