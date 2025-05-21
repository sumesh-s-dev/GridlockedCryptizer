public class Bidder {
    private int bidderId;
    private String username;
    private String password;
    private String email;

    public Bidder(int bidderId, String username, String password, String email) {
        this.bidderId = bidderId;
        this.username = username;
        this.password = password;
        this.email = email;
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

    @Override
    public String toString() {
        return "Bidder ID: " + bidderId + ", Username: " + username;
    }
}