const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("frontend"))

// Database setup
const dbPath = path.join(__dirname, "database.sqlite")
const db = new sqlite3.Database(dbPath)

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'bidder',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)

  // Vehicles table
  db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        mileage INTEGER NOT NULL,
        condition TEXT NOT NULL,
        vin TEXT,
        color TEXT,
        transmission TEXT,
        fuel_type TEXT,
        engine_size TEXT,
        description TEXT,
        starting_bid DECIMAL(10,2) NOT NULL,
        current_bid DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'upcoming',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)

  // Auctions table
  db.run(`CREATE TABLE IF NOT EXISTS auctions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status TEXT DEFAULT 'upcoming',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
    )`)

  // Bids table
  db.run(`CREATE TABLE IF NOT EXISTS bids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        auction_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        bid_amount DECIMAL(10,2) NOT NULL,
        bid_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`)

  // Insert sample data
  insertSampleData()
})

function insertSampleData() {
  // Sample users
  const users = [
    { username: "admin", email: "admin@gridlocked.com", password_hash: "hashed_password", role: "admin" },
    { username: "user123", email: "user123@example.com", password_hash: "hashed_password", role: "bidder" },
    { username: "user456", email: "user456@example.com", password_hash: "hashed_password", role: "bidder" },
    { username: "user789", email: "user789@example.com", password_hash: "hashed_password", role: "bidder" },
  ]

  users.forEach((user) => {
    db.run(`INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`, [
      user.username,
      user.email,
      user.password_hash,
      user.role,
    ])
  })

  // Sample vehicles
  const vehicles = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      mileage: 45000,
      condition: "Excellent",
      vin: "1HGBH41JXMN109186",
      color: "Silver",
      transmission: "Automatic",
      fuel_type: "Gasoline",
      engine_size: "2.5L",
      description: "Well-maintained Toyota Camry with excellent condition",
      starting_bid: 18000,
      current_bid: 22500,
      status: "active",
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2019,
      mileage: 32000,
      condition: "Good",
      vin: "2HGFC2F59KH123456",
      color: "Blue",
      transmission: "Manual",
      fuel_type: "Gasoline",
      engine_size: "2.0L",
      description: "Sporty Honda Civic in good condition",
      starting_bid: 16000,
      current_bid: 19800,
      status: "active",
    },
    {
      make: "Ford",
      model: "F-150",
      year: 2021,
      mileage: 28000,
      condition: "Excellent",
      vin: "1FTFW1ET5MKE12345",
      color: "Black",
      transmission: "Automatic",
      fuel_type: "Gasoline",
      engine_size: "3.5L",
      description: "Powerful Ford F-150 truck in excellent condition",
      starting_bid: 32000,
      current_bid: 38500,
      status: "ended",
    },
    {
      make: "BMW",
      model: "3 Series",
      year: 2018,
      mileage: 55000,
      condition: "Good",
      vin: "WBA8E9G59JA123456",
      color: "White",
      transmission: "Automatic",
      fuel_type: "Gasoline",
      engine_size: "2.0L",
      description: "Luxury BMW 3 Series with premium features",
      starting_bid: 25000,
      current_bid: 25000,
      status: "upcoming",
    },
    {
      make: "Mercedes",
      model: "C-Class",
      year: 2019,
      mileage: 41000,
      condition: "Excellent",
      vin: "WDDWF4HB1KR123456",
      color: "Gray",
      transmission: "Automatic",
      fuel_type: "Gasoline",
      engine_size: "2.0L",
      description: "Elegant Mercedes C-Class with luxury appointments",
      starting_bid: 28000,
      current_bid: 33200,
      status: "active",
    },
    {
      make: "Audi",
      model: "A4",
      year: 2020,
      mileage: 35000,
      condition: "Excellent",
      vin: "WAUENAF40LN123456",
      color: "Red",
      transmission: "Automatic",
      fuel_type: "Gasoline",
      engine_size: "2.0L",
      description: "Sophisticated Audi A4 with advanced technology",
      starting_bid: 30000,
      current_bid: 34500,
      status: "active",
    },
  ]

  vehicles.forEach((vehicle) => {
    db.run(
      `INSERT OR IGNORE INTO vehicles (
            make, model, year, mileage, condition, vin, color, transmission, 
            fuel_type, engine_size, description, starting_bid, current_bid, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle.make,
        vehicle.model,
        vehicle.year,
        vehicle.mileage,
        vehicle.condition,
        vehicle.vin,
        vehicle.color,
        vehicle.transmission,
        vehicle.fuel_type,
        vehicle.engine_size,
        vehicle.description,
        vehicle.starting_bid,
        vehicle.current_bid,
        vehicle.status,
      ],
    )
  })

  // Sample auctions
  const now = new Date()
  const auctions = [
    {
      vehicle_id: 1,
      start_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      vehicle_id: 2,
      start_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      vehicle_id: 3,
      start_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "ended",
    },
  ]

  auctions.forEach((auction) => {
    db.run(`INSERT OR IGNORE INTO auctions (vehicle_id, start_time, end_time, status) VALUES (?, ?, ?, ?)`, [
      auction.vehicle_id,
      auction.start_time,
      auction.end_time,
      auction.status,
    ])
  })
}

// API Routes

// Get all vehicles
app.get("/api/vehicles", (req, res) => {
  db.all(`SELECT * FROM vehicles ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    // Add auction end time for active vehicles
    const vehiclesWithAuctions = rows.map((vehicle) => ({
      ...vehicle,
      auctionEndTime:
        vehicle.status === "active"
          ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    }))

    res.json(vehiclesWithAuctions)
  })
})

// Get vehicle by ID
app.get("/api/vehicles/:id", (req, res) => {
  const { id } = req.params
  db.get(`SELECT * FROM vehicles WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: "Vehicle not found" })
      return
    }
    res.json(row)
  })
})

// Create new vehicle
app.post("/api/vehicles", (req, res) => {
  const {
    make,
    model,
    year,
    mileage,
    condition,
    vin,
    color,
    transmission,
    fuel_type,
    engine_size,
    description,
    startingBid,
  } = req.body

  if (!make || !model || !year || !mileage || !condition || !startingBid) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  db.run(
    `INSERT INTO vehicles (
        make, model, year, mileage, condition, vin, color, transmission,
        fuel_type, engine_size, description, starting_bid, current_bid, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      make,
      model,
      year,
      mileage,
      condition,
      vin,
      color,
      transmission,
      fuel_type,
      engine_size,
      description,
      startingBid,
      startingBid,
      "upcoming",
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(201).json({
        id: this.lastID,
        make,
        model,
        year,
        mileage,
        condition,
        vin,
        color,
        transmission,
        fuel_type,
        engine_size,
        description,
        starting_bid: startingBid,
        current_bid: startingBid,
        status: "upcoming",
      })
    },
  )
})

// Get dashboard stats
app.get("/api/stats", (req, res) => {
  const stats = {}

  // Get total vehicles count
  db.get(`SELECT COUNT(*) as count FROM vehicles`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    stats.totalVehicles = result.count

    // Get active auctions count
    db.get(`SELECT COUNT(*) as count FROM vehicles WHERE status = 'active'`, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      stats.activeAuctions = result.count

      // Get total users count
      db.get(`SELECT COUNT(*) as count FROM users`, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }
        stats.totalUsers = result.count

        // Calculate total revenue (sum of current bids for ended auctions)
        db.get(`SELECT SUM(current_bid) as revenue FROM vehicles WHERE status = 'ended'`, (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message })
            return
          }
          stats.totalRevenue = result.revenue || 0

          res.json(stats)
        })
      })
    })
  })
})

// Get all auctions with vehicle details
app.get("/api/auctions", (req, res) => {
  db.all(
    `
        SELECT 
            a.*,
            v.make, v.model, v.year, v.starting_bid, v.current_bid,
            (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count,
            (SELECT u.username FROM bids b JOIN users u ON b.user_id = u.id 
             WHERE b.auction_id = a.id ORDER BY b.bid_amount DESC LIMIT 1) as highest_bidder
        FROM auctions a
        JOIN vehicles v ON a.vehicle_id = v.id
        ORDER BY a.created_at DESC
    `,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      const auctions = rows.map((row) => ({
        id: row.id,
        vehicleId: row.vehicle_id,
        vehicle: {
          make: row.make,
          model: row.model,
          year: row.year,
          image: "/placeholder.svg?height=200&width=300",
        },
        startingBid: row.starting_bid,
        currentBid: row.current_bid,
        bidCount: row.bid_count,
        startTime: row.start_time,
        endTime: row.end_time,
        status: row.status,
        highestBidder: row.highest_bidder,
      }))

      res.json(auctions)
    },
  )
})

// Create new auction
app.post("/api/auctions", (req, res) => {
  const { vehicle_id, start_time, end_time } = req.body

  if (!vehicle_id || !start_time || !end_time) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  db.run(
    `INSERT INTO auctions (vehicle_id, start_time, end_time, status) VALUES (?, ?, ?, ?)`,
    [vehicle_id, start_time, end_time, "upcoming"],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      // Update vehicle status
      db.run(`UPDATE vehicles SET status = 'upcoming' WHERE id = ?`, [vehicle_id])

      res.status(201).json({
        id: this.lastID,
        vehicle_id,
        start_time,
        end_time,
        status: "upcoming",
      })
    },
  )
})

// Place a bid
app.post("/api/bids", (req, res) => {
  const { auction_id, user_id, bid_amount } = req.body

  if (!auction_id || !user_id || !bid_amount) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  // Check if auction is active
  db.get(`SELECT * FROM auctions WHERE id = ? AND status = 'active'`, [auction_id], (err, auction) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!auction) {
      res.status(400).json({ error: "Auction not found or not active" })
      return
    }

    // Get current highest bid
    db.get(`SELECT MAX(bid_amount) as highest_bid FROM bids WHERE auction_id = ?`, [auction_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      const currentHighest = result.highest_bid || 0
      if (bid_amount <= currentHighest) {
        res.status(400).json({ error: "Bid must be higher than current highest bid" })
        return
      }

      // Place the bid
      db.run(
        `INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (?, ?, ?)`,
        [auction_id, user_id, bid_amount],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message })
            return
          }

          // Update vehicle current bid
          db.run(
            `UPDATE vehicles SET current_bid = ? WHERE id = (
                        SELECT vehicle_id FROM auctions WHERE id = ?
                    )`,
            [bid_amount, auction_id],
          )

          res.status(201).json({
            id: this.lastID,
            auction_id,
            user_id,
            bid_amount,
            bid_time: new Date().toISOString(),
          })
        },
      )
    })
  })
})

// Get users
app.get("/api/users", (req, res) => {
  db.all(`SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`GridlockedCryptizer server running on port ${PORT}`)
  console.log(`Frontend available at: http://localhost:${PORT}`)
  console.log(`API available at: http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...")
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message)
    } else {
      console.log("Database connection closed.")
    }
    process.exit(0)
  })
})

module.exports = app
