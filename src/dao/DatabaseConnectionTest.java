package dao;

import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseConnectionTest {
    public static void main(String[] args) {
        System.out.println("Testing database connection...");
        
        try {
            // Try to get a connection
            Connection conn = DatabaseConnection.getConnection();
            System.out.println("Database connection successful!");
            
            // Close the connection
            conn.close();
            System.out.println("Connection closed successfully.");
        } catch (SQLException e) {
            System.err.println("Error connecting to database: " + e.getMessage());
            e.printStackTrace();
        }
    }
}