package model;

import java.util.Date;

public class Vehicle {
    private int vehicleId;
    private String make;
    private String model;
    private int year;
    private String description;
    private double startingBid;
    private double highestBid;
    private Date auctionEnd;
    private String blockchainVerificationHash;

    // Constructor for existing code compatibility
    public Vehicle(int vehicleId, String make, String model, int year, double startingBid, double highestBid) {
        this.vehicleId = vehicleId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.startingBid = startingBid;
        this.highestBid = highestBid;
    }

    // Full constructor with all fields
    public Vehicle(int vehicleId, String make, String model, int year, 
                  String description, double startingBid, double highestBid, Date auctionEnd) {
        this.vehicleId = vehicleId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.description = description;
        this.startingBid = startingBid;
        this.highestBid = highestBid;
        this.auctionEnd = auctionEnd;
    }

    // Getters and setters
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getStartingBid() { return startingBid; }
    public void setStartingBid(double startingBid) { this.startingBid = startingBid; }

    public double getHighestBid() { return highestBid; }
    public void setHighestBid(double highestBid) { this.highestBid = highestBid; }

    public Date getAuctionEnd() { return auctionEnd; }
    public void setAuctionEnd(Date auctionEnd) { this.auctionEnd = auctionEnd; }

    public String getBlockchainVerificationHash() { return blockchainVerificationHash; }
    public void setBlockchainVerificationHash(String blockchainVerificationHash) { 
        this.blockchainVerificationHash = blockchainVerificationHash; 
    }

    /**
     * Determines if the auction for this vehicle is still active
     */
    public boolean isAuctionActive() {
        return auctionEnd != null && new Date().before(auctionEnd);
    }

    /**
     * Checks if the bid amount is valid for this vehicle
     */
    public boolean isValidBidAmount(double bidAmount) {
        return bidAmount > highestBid && bidAmount >= startingBid;
    }

    @Override
    public String toString() {
        return year + " " + make + " " + model + 
               "\nStarting Bid: $" + String.format("%.2f", startingBid) + 
               "\nCurrent Highest Bid: $" + String.format("%.2f", highestBid);
    }
}
