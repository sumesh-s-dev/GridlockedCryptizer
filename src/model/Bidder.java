package model;

import java.util.Date;

public class Bidder {
    private int bidderId;
    private String username;
    private String password;
    private String email;
    private Date registrationDate;

    // Constructor for existing code compatibility
    public Bidder(int bidderId, String username, String password, String email) {
        this.bidderId = bidderId;
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    // Constructor with registration date
    public Bidder(int bidderId, String username, String email) {
        this.bidderId = bidderId;
        this.username = username;
        this.email = email;
        this.registrationDate = new Date();
    }

    // Getters and setters
    public int getBidderId() { return bidderId; }
    public void setBidderId(int bidderId) { this.bidderId = bidderId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Date getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(Date registrationDate) { this.registrationDate = registrationDate; }

    @Override
    public String toString() {
        return "Bidder ID: " + bidderId + ", Username: " + username;
    }
}