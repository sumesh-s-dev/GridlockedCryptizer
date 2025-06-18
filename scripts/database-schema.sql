-- GridlockedCryptizer Database Schema

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'bidder' CHECK (role IN ('admin', 'auctioneer', 'bidder')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table for storing vehicle information
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Poor')),
    vin TEXT UNIQUE,
    color TEXT,
    transmission TEXT CHECK (transmission IN ('Automatic', 'Manual', 'CVT')),
    fuel_type TEXT CHECK (fuel_type IN ('Gasoline', 'Diesel', 'Hybrid', 'Electric')),
    engine_size TEXT,
    body_type TEXT,
    doors INTEGER,
    description TEXT,
    starting_bid DECIMAL(10,2) NOT NULL CHECK (starting_bid > 0),
    current_bid DECIMAL(10,2) NOT NULL CHECK (current_bid >= starting_bid),
    reserve_price DECIMAL(10,2),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'sold', 'withdrawn')),
    seller_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users (id)
);

-- Auctions table for managing auction events
CREATE TABLE IF NOT EXISTS auctions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'cancelled')),
    auctioneer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE,
    FOREIGN KEY (auctioneer_id) REFERENCES users (id),
    CHECK (end_time > start_time)
);

-- Bids table for storing bid information
CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auction_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
    bid_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_winning BOOLEAN DEFAULT 0,
    FOREIGN KEY (auction_id) REFERENCES auctions (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Vehicle images table for storing multiple images per vehicle
CREATE TABLE IF NOT EXISTS vehicle_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE
);

-- Watchlist table for users to track vehicles they're interested in
CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE,
    UNIQUE(user_id, vehicle_id)
);

-- Notifications table for system notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Audit log table for tracking important system events
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id INTEGER,
    old_values TEXT, -- JSON string
    new_values TEXT, -- JSON string
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_start_time ON auctions(start_time);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_bid_amount ON bids(bid_amount);
CREATE INDEX IF NOT EXISTS idx_bids_bid_time ON bids(bid_time);

-- Triggers for updating timestamps
CREATE TRIGGER IF NOT EXISTS update_vehicles_timestamp 
    AFTER UPDATE ON vehicles
    BEGIN
        UPDATE vehicles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_auctions_timestamp 
    AFTER UPDATE ON auctions
    BEGIN
        UPDATE auctions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Trigger to update vehicle current_bid when a new bid is placed
CREATE TRIGGER IF NOT EXISTS update_vehicle_current_bid
    AFTER INSERT ON bids
    BEGIN
        UPDATE vehicles 
        SET current_bid = NEW.bid_amount 
        WHERE id = (SELECT vehicle_id FROM auctions WHERE id = NEW.auction_id);
        
        -- Mark all other bids for this auction as not winning
        UPDATE bids 
        SET is_winning = 0 
        WHERE auction_id = NEW.auction_id AND id != NEW.id;
        
        -- Mark the new bid as winning
        UPDATE bids 
        SET is_winning = 1 
        WHERE id = NEW.id;
    END;
