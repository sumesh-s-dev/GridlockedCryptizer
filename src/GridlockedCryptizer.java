import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.List;

import model.Bidder;
import model.Vehicle;
import dao.DatabaseConnection;
import util.LoggerUtil;

public class GridlockedCryptizer {
    private JFrame frame;
    private Bidder currentBidder;
    private static final LoggerUtil logger = LoggerUtil.getLogger(GridlockedCryptizer.class);

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                // Test database connection before initializing the application
                boolean dbConnected = false;
                try {
                    DatabaseConnection.getConnection().close();
                    logger.info("Database connection successful");
                    dbConnected = true;
                } catch (Exception e) {
                    String errorMessage = "Database connection error: " + e.getMessage() + 
                        "\n\nPlease make sure:\n" +
                        "1. MySQL Server is running\n" +
                        "2. The database 'gridlocked_cryptizer' exists\n" +
                        "3. The MySQL JDBC driver is in the lib directory\n" +
                        "4. The database credentials in config.properties are correct";

                    // Show error but allow application to continue
                    int option = JOptionPane.showOptionDialog(
                        null, 
                        errorMessage + "\n\nDo you want to continue without database connection?", 
                        "Database Error", 
                        JOptionPane.YES_NO_OPTION, 
                        JOptionPane.WARNING_MESSAGE, 
                        null, 
                        new String[]{"Continue Anyway", "Exit"}, 
                        "Exit"
                    );

                    logger.error("Database connection error", e);

                    if (option != JOptionPane.YES_OPTION) {
                        return;
                    }
                }

                new GridlockedCryptizer().initialize();

                // Show a warning if database is not connected
                if (!dbConnected) {
                    JOptionPane.showMessageDialog(
                        null, 
                        "Running in offline mode. Database features will not be available.", 
                        "Offline Mode", 
                        JOptionPane.WARNING_MESSAGE
                    );
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error starting application: " + e.getMessage(), 
                    "Application Error", JOptionPane.ERROR_MESSAGE);
                logger.error("Error starting application", e);
            }
        });
    }

    private void initialize() {
        // Set up the main frame
        frame = new JFrame("Gridlocked Cryptizer - Vehicle Auction System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        frame.setLocationRelativeTo(null);

        // Show the login panel initially
        showLoginPanel();

        frame.setVisible(true);
    }

    private void showLoginPanel() {
        // Clear the frame
        frame.getContentPane().removeAll();

        // Create the login panel
        JPanel loginPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        // Title
        JLabel titleLabel = new JLabel("Gridlocked Cryptizer");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        loginPanel.add(titleLabel, gbc);

        // Username
        JLabel usernameLabel = new JLabel("Username:");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.gridwidth = 1;
        gbc.anchor = GridBagConstraints.EAST;
        loginPanel.add(usernameLabel, gbc);

        JTextField usernameField = new JTextField(15);
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        loginPanel.add(usernameField, gbc);

        // Password
        JLabel passwordLabel = new JLabel("Password:");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.anchor = GridBagConstraints.EAST;
        loginPanel.add(passwordLabel, gbc);

        JPasswordField passwordField = new JPasswordField(15);
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        loginPanel.add(passwordField, gbc);

        // Email (for registration)
        JLabel emailLabel = new JLabel("Email:");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.anchor = GridBagConstraints.EAST;
        loginPanel.add(emailLabel, gbc);

        JTextField emailField = new JTextField(15);
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        loginPanel.add(emailField, gbc);

        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout());

        JButton loginButton = new JButton("Login");
        loginButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            if (username.isEmpty() || password.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "Username and password are required.");
                return;
            }

            Bidder bidder = DatabaseConnection.authenticateBidder(username, password);
            if (bidder != null) {
                currentBidder = bidder;
                JOptionPane.showMessageDialog(frame, "Login successful!");
                showBiddingPanel();
            } else {
                JOptionPane.showMessageDialog(frame, "Invalid username or password.");
            }
        });

        JButton registerButton = new JButton("Register");
        registerButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());
            String email = emailField.getText();

            if (username.isEmpty() || password.isEmpty() || email.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "All fields are required for registration.");
                return;
            }

            boolean success = DatabaseConnection.registerBidder(username, password, email);
            if (success) {
                JOptionPane.showMessageDialog(frame, "Registration successful! You can now login.");
                emailField.setText("");
            } else {
                JOptionPane.showMessageDialog(frame, "Registration failed. Username may already exist or password doesn't meet requirements.\n\n" +
                    "Password requirements:\n" +
                    "- At least 8 characters\n" +
                    "- At least 1 uppercase letter\n" +
                    "- At least 1 lowercase letter\n" +
                    "- At least 1 digit");
            }
        });

        buttonPanel.add(loginButton);
        buttonPanel.add(registerButton);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        loginPanel.add(buttonPanel, gbc);

        // Add the login panel to the frame
        frame.getContentPane().add(loginPanel);
        frame.revalidate();
        frame.repaint();
    }

    private void showBiddingPanel() {
        // Clear the frame
        frame.getContentPane().removeAll();

        // Create the main panel with border layout
        JPanel mainPanel = new JPanel(new BorderLayout());

        // Header panel with user info and logout button
        JPanel headerPanel = new JPanel(new BorderLayout());
        JLabel userLabel = new JLabel("Logged in as: " + currentBidder.getUsername());
        headerPanel.add(userLabel, BorderLayout.WEST);

        JButton logoutButton = new JButton("Logout");
        logoutButton.addActionListener(e -> {
            currentBidder = null;
            showLoginPanel();
        });
        headerPanel.add(logoutButton, BorderLayout.EAST);

        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Vehicle list panel
        JPanel vehiclePanel = new JPanel(new BorderLayout());
        vehiclePanel.setBorder(BorderFactory.createTitledBorder("Available Vehicles"));

        JTextArea vehicleArea = new JTextArea(15, 40);
        vehicleArea.setEditable(false);
        JScrollPane vehicleScroll = new JScrollPane(vehicleArea);
        vehiclePanel.add(vehicleScroll, BorderLayout.CENTER);

        // Bidding panel
        JPanel bidPanel = new JPanel(new GridBagLayout());
        bidPanel.setBorder(BorderFactory.createTitledBorder("Place a Bid"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        // Vehicle ID
        JLabel vehicleIdLabel = new JLabel("Vehicle ID:");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.EAST;
        bidPanel.add(vehicleIdLabel, gbc);

        JTextField vehicleIdField = new JTextField(10);
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        bidPanel.add(vehicleIdField, gbc);

        // Bid amount
        JLabel bidAmountLabel = new JLabel("Bid Amount ($):");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.anchor = GridBagConstraints.EAST;
        bidPanel.add(bidAmountLabel, gbc);

        JTextField bidAmountField = new JTextField(10);
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.WEST;
        bidPanel.add(bidAmountField, gbc);

        // Bid button
        JButton bidButton = new JButton("Place Bid");
        bidButton.addActionListener(e -> {
            try {
                int vehicleId = Integer.parseInt(vehicleIdField.getText());
                double bidAmount = Double.parseDouble(bidAmountField.getText());

                // Check if bid is higher than current highest bid
                double highestBid = DatabaseConnection.getHighestBid(vehicleId);
                if (bidAmount <= highestBid) {
                    JOptionPane.showMessageDialog(frame, 
                        "Your bid must be higher than the current highest bid ($" + 
                        String.format("%.2f", highestBid) + ").");
                    return;
                }

                boolean success = DatabaseConnection.placeBid(
                    currentBidder.getBidderId(), vehicleId, bidAmount);

                if (success) {
                    JOptionPane.showMessageDialog(frame, "Bid placed successfully!");
                    bidAmountField.setText("");

                    // Refresh vehicle list
                    updateVehicleArea(vehicleArea, DatabaseConnection.getVehicles());
                } else {
                    JOptionPane.showMessageDialog(frame, "Failed to place bid.");
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(frame, "Please enter valid numbers for Vehicle ID and Bid Amount.");
            }
        });

        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        bidPanel.add(bidButton, gbc);

        // Refresh button
        JButton refreshButton = new JButton("Refresh Vehicle List");
        refreshButton.addActionListener(e -> {
            updateVehicleArea(vehicleArea, DatabaseConnection.getVehicles());
        });

        gbc.gridy = 3;
        bidPanel.add(refreshButton, gbc);

        vehiclePanel.add(bidPanel, BorderLayout.SOUTH);

        mainPanel.add(vehiclePanel, BorderLayout.CENTER);

        // Add the main panel to the frame
        frame.getContentPane().add(mainPanel);

        // Load initial vehicle data
        updateVehicleArea(vehicleArea, DatabaseConnection.getVehicles());

        // Add a timer to refresh the vehicle list every 10 seconds
        Timer timer = new Timer(10000, e -> {
            updateVehicleArea(vehicleArea, DatabaseConnection.getVehicles());
        });
        timer.start();

        frame.revalidate();
        frame.repaint();
    }

    private void updateVehicleArea(JTextArea vehicleArea, List<Vehicle> vehicles) {
        StringBuilder sb = new StringBuilder();

        for (Vehicle vehicle : vehicles) {
            sb.append("ID: ").append(vehicle.getVehicleId()).append(" - ");
            sb.append(vehicle.getYear()).append(" ").append(vehicle.getMake());
            sb.append(" ").append(vehicle.getModel()).append("\n");
            sb.append("Starting Bid: $").append(String.format("%.2f", vehicle.getStartingBid())).append("\n");
            sb.append("Current Highest Bid: $").append(String.format("%.2f", vehicle.getHighestBid())).append("\n\n");
        }

        vehicleArea.setText(sb.toString());
    }
}
