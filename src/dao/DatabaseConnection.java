package dao;

import model.Bidder;
import model.Vehicle;
import util.SecurityUtil;
import util.ConfigManager;
import util.LoggerUtil;
import blockchain.BlockchainService;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Date;

public class DatabaseConnection {
    private static boolean driverLoaded = false;
    private static boolean databaseInitialized = false;
    private static final LoggerUtil logger = LoggerUtil.getLogger(DatabaseConnection.class);

    // Load the JDBC driver
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            driverLoaded = true;
            logger.info("MySQL JDBC Driver loaded successfully");

            // Try to initialize the database
            try {
                initializeDatabase();
            } catch (SQLException | IOException e) {
                logger.error("Warning: Could not initialize database", e);
            }
        } catch (ClassNotFoundException e) {
            logger.error("Error loading MySQL JDBC Driver", e);
        }
    }

    // Initialize the database if it doesn't exist
    private static void initializeDatabase() throws SQLException, IOException {
        if (databaseInitialized) return;

        ConfigManager config = ConfigManager.getInstance();
        String baseUrl = config.getProperty("db.base_url");
        String user = config.getProperty("db.user");
        String password = config.getProperty("db.password");

        // First try to connect to the server without specifying a database
        try (Connection conn = DriverManager.getConnection(baseUrl, user, password)) {
            // Check if the database exists
            try (Statement stmt = conn.createStatement()) {
                // Try to create the database if it doesn't exist
                stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS gridlocked_cryptizer");
                logger.info("Database 'gridlocked_cryptizer' created or already exists");

                // Use the database
                stmt.executeUpdate("USE gridlocked_cryptizer");

                // Check if tables exist by querying information_schema
                ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM information_schema.tables " +
                    "WHERE table_schema = 'gridlocked_cryptizer' AND table_name IN ('bidders', 'vehicles', 'bids')");
                rs.next();
                int tableCount = rs.getInt(1);

                // If tables don't exist, run the SQL script
                if (tableCount < 3) {
                    logger.info("Tables don't exist. Creating tables from SQL script...");
                    executeSqlScript(conn, "src/database_schema.sql");
                } else {
                    logger.info("Tables already exist");
                }

                databaseInitialized = true;
            }
        }
    }

    // Execute SQL script from file
    private static void executeSqlScript(Connection conn, String scriptPath) throws SQLException, IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(scriptPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Skip comments and empty lines
                if (line.startsWith("--") || line.trim().isEmpty() || line.startsWith("USE ")) {
                    continue;
                }
                sb.append(line);

                // Execute statement when semicolon is found
                if (line.trim().endsWith(";")) {
                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(sb.toString());
                    }
                    sb.setLength(0);
                }
            }
        }
        logger.info("SQL script executed successfully");
    }

    // Get a connection to the database
    public static Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            throw new SQLException("MySQL JDBC Driver not loaded");
        }

        ConfigManager config = ConfigManager.getInstance();
        String url = config.getProperty("db.url");
        String user = config.getProperty("db.user");
        String password = config.getProperty("db.password");

        try {
            // Try to initialize the database if not already done
            if (!databaseInitialized) {
                try {
                    initializeDatabase();
                } catch (IOException e) {
                    throw new SQLException("Error initializing database: " + e.getMessage(), e);
                }
            }

            return DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            logger.error("Error connecting to database", e);
            throw e;
        }
    }

    // Register a new bidder
    public static boolean registerBidder(String username, String password, String email) {
        if (!driverLoaded) {
            logger.error("Cannot register bidder: MySQL JDBC Driver not loaded");
            return false;
        }

        // Validate inputs
        if (!SecurityUtil.isValidEmail(email)) {
            logger.warn("Invalid email format during registration: " + email);
            return false;
        }

        if (!SecurityUtil.isValidPassword(password)) {
            logger.warn("Password doesn't meet complexity requirements during registration");
            return false;
        }

        String sql = "INSERT INTO bidders (username, password, email) VALUES (?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, SecurityUtil.sanitizeInput(username));
            stmt.setString(2, SecurityUtil.hashPassword(password));
            stmt.setString(3, SecurityUtil.sanitizeInput(email));

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            logger.error("Error registering bidder", e);
            return false;
        }
    }

    // Authenticate a bidder
    public static Bidder authenticateBidder(String username, String password) {
        if (!driverLoaded) {
            logger.error("Cannot authenticate bidder: MySQL JDBC Driver not loaded");
            // For demo purposes, allow login with a test account when database is unavailable
            if ("demo".equals(username) && "demo".equals(password)) {
                return new Bidder(999, "demo", "demo@example.com");
            }
            return null;
        }

        String sql = "SELECT * FROM bidders WHERE username = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String storedPassword = rs.getString("password");

                    // Verify password
                    if (SecurityUtil.checkPassword(password, storedPassword)) {
                        return new Bidder(
                            rs.getInt("bidder_id"),
                            rs.getString("username"),
                            rs.getString("email")
                        );
                    }
                }
            }

            // For demo purposes, allow login with a test account when no matching user found
            if ("demo".equals(username) && "demo".equals(password)) {
                return new Bidder(999, "demo", "demo@example.com");
            }

            return null;
        } catch (SQLException e) {
            logger.error("Error authenticating bidder", e);

            // For demo purposes, allow login with a test account when database is unavailable
            if ("demo".equals(username) && "demo".equals(password)) {
                return new Bidder(999, "demo", "demo@example.com");
            }

            return null;
        }
    }

    // Get all vehicles
    public static List<Vehicle> getVehicles() {
        List<Vehicle> vehicles = new ArrayList<>();

        if (!driverLoaded) {
            logger.error("Cannot get vehicles: MySQL JDBC Driver not loaded");
            // Return some sample vehicles for demo purposes
            vehicles.add(new Vehicle(1, "Toyota", "Camry", 2020, 15000.0, 15000.0));
            vehicles.add(new Vehicle(2, "Honda", "Accord", 2021, 18000.0, 18500.0));
            vehicles.add(new Vehicle(3, "Ford", "Mustang", 2019, 25000.0, 26000.0));
            return vehicles;
        }

        String sql = "SELECT v.*, " +
                    "(SELECT MAX(bid_amount) FROM bids WHERE vehicle_id = v.vehicle_id) AS highest_bid " +
                    "FROM vehicles v";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                int vehicleId = rs.getInt("vehicle_id");
                String make = rs.getString("make");
                String model = rs.getString("model");
                int year = rs.getInt("year");
                double startingBid = rs.getDouble("starting_bid");
                double highestBid = rs.getDouble("highest_bid");

                if (rs.wasNull()) {
                    highestBid = startingBid;
                }

                vehicles.add(new Vehicle(vehicleId, make, model, year, startingBid, highestBid));
            }
        } catch (SQLException e) {
            logger.error("Error getting vehicles", e);

            // Return some sample vehicles for demo purposes
            vehicles.add(new Vehicle(1, "Toyota", "Camry", 2020, 15000.0, 15000.0));
            vehicles.add(new Vehicle(2, "Honda", "Accord", 2021, 18000.0, 18500.0));
            vehicles.add(new Vehicle(3, "Ford", "Mustang", 2019, 25000.0, 26000.0));
        }

        return vehicles;
    }

    // Place a bid
    public static boolean placeBid(int bidderId, int vehicleId, double bidAmount) {
        if (!driverLoaded) {
            logger.error("Cannot place bid: MySQL JDBC Driver not loaded");
            return false;
        }

        // Record the bid on the blockchain
        BlockchainService blockchainService = BlockchainService.getInstance();
        String blockchainHash = blockchainService.recordBid(bidderId, vehicleId, bidAmount);

        if (blockchainHash == null) {
            logger.error("Failed to record bid on blockchain");
            return false;
        }

        String sql = "INSERT INTO bids (bidder_id, vehicle_id, bid_amount, blockchain_hash) VALUES (?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bidderId);
            stmt.setInt(2, vehicleId);
            stmt.setDouble(3, bidAmount);
            stmt.setString(4, blockchainHash);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            logger.error("Error placing bid", e);
            return false;
        }
    }

    // Get highest bid for a vehicle
    public static double getHighestBid(int vehicleId) {
        if (!driverLoaded) {
            logger.error("Cannot get highest bid: MySQL JDBC Driver not loaded");
            // Return a default value based on vehicle ID for demo purposes
            return vehicleId * 5000.0;
        }

        String sql = "SELECT MAX(bid_amount) AS highest_bid FROM bids WHERE vehicle_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, vehicleId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    double highestBid = rs.getDouble("highest_bid");
                    if (!rs.wasNull()) {
                        return highestBid;
                    }
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting highest bid", e);
            // Return a default value based on vehicle ID for demo purposes
            return vehicleId * 5000.0;
        }

        // If no bids, get starting bid
        sql = "SELECT starting_bid FROM vehicles WHERE vehicle_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, vehicleId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("starting_bid");
                }
            }
        } catch (SQLException e) {
            logger.error("Error getting starting bid", e);
            // Return a default value based on vehicle ID for demo purposes
            return vehicleId * 5000.0;
        }

        return 0.0;
    }
}
