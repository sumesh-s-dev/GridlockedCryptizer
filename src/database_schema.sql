-- Database schema for Gridlocked Cryptizer
-- Run this script to create the necessary database and tables

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gridlocked_cryptizer;

-- Use the database
USE gridlocked_cryptizer;

-- Create the bidders table
CREATE TABLE IF NOT EXISTS bidders (
    bidder_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Create the vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    starting_bid DECIMAL(10, 2) NOT NULL
);

-- Create the bids table
CREATE TABLE IF NOT EXISTS bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    bidder_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidder_id) REFERENCES bidders(bidder_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- Insert some sample vehicles
INSERT INTO vehicles (make, model, year, starting_bid) VALUES
('Toyota', 'Camry', 2020, 15000.00),
('Honda', 'Civic', 2019, 12000.00),
('Ford', 'Mustang', 2018, 25000.00),
('Chevrolet', 'Corvette', 2021, 45000.00),
('BMW', 'X5', 2020, 35000.00);