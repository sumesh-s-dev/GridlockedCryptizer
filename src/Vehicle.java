public class Vehicle {
    private int vehicleId;
    private String make;
    private String model;
    private int year;
    private double startingBid;
    private double highestBid;

    public Vehicle(int vehicleId, String make, String model, int year, double startingBid, double highestBid) {
        this.vehicleId = vehicleId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.startingBid = startingBid;
        this.highestBid = highestBid;
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

    public double getStartingBid() { return startingBid; }
    public void setStartingBid(double startingBid) { this.startingBid = startingBid; }

    public double getHighestBid() { return highestBid; }
    public void setHighestBid(double highestBid) { this.highestBid = highestBid; }

    @Override
    public String toString() {
        return year + " " + make + " " + model + 
               "\nStarting Bid: $" + String.format("%.2f", startingBid) + 
               "\nCurrent Highest Bid: $" + String.format("%.2f", highestBid);
    }
}