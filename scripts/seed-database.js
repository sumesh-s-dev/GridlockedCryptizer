const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcryptjs")
const path = require("path")

const dbPath = path.join(__dirname, "..", "database.sqlite")
const db = new sqlite3.Database(dbPath)

async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    // Hash password for sample users
    const hashedPassword = await bcrypt.hash("password123", 10)

    // Sample users
    const users = [
      {
        username: "admin",
        email: "admin@gridlocked.com",
        password_hash: hashedPassword,
        first_name: "System",
        last_name: "Administrator",
        phone: "+1-555-0001",
        role: "admin",
      },
      {
        username: "auctioneer1",
        email: "auctioneer@gridlocked.com",
        password_hash: hashedPassword,
        first_name: "John",
        last_name: "Auctioneer",
        phone: "+1-555-0002",
        role: "auctioneer",
      },
      {
        username: "bidder1",
        email: "bidder1@example.com",
        password_hash: hashedPassword,
        first_name: "Alice",
        last_name: "Johnson",
        phone: "+1-555-0101",
        role: "bidder",
      },
      {
        username: "bidder2",
        email: "bidder2@example.com",
        password_hash: hashedPassword,
        first_name: "Bob",
        last_name: "Smith",
        phone: "+1-555-0102",
        role: "bidder",
      },
      {
        username: "bidder3",
        email: "bidder3@example.com",
        password_hash: hashedPassword,
        first_name: "Carol",
        last_name: "Davis",
        phone: "+1-555-0103",
        role: "bidder",
      },
    ]

    // Insert users
    for (const user of users) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO users (
                    username, email, password_hash, first_name, last_name, phone, role
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.username, user.email, user.password_hash, user.first_name, user.last_name, user.phone, user.role],
          function (err) {
            if (err) reject(err)
            else resolve(this.lastID)
          },
        )
      })
    }
    console.log("✓ Users seeded")

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
        body_type: "Sedan",
        doors: 4,
        description:
          "Well-maintained Toyota Camry with excellent service history. Features include backup camera, Bluetooth connectivity, and premium sound system.",
        starting_bid: 18000,
        current_bid: 22500,
        reserve_price: 20000,
        status: "active",
        seller_id: 1,
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
        body_type: "Sedan",
        doors: 4,
        description: "Sporty Honda Civic with manual transmission. Great fuel economy and reliable performance.",
        starting_bid: 16000,
        current_bid: 19800,
        reserve_price: 18000,
        status: "active",
        seller_id: 1,
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
        body_type: "Pickup",
        doors: 4,
        description: "Powerful Ford F-150 truck with towing package. Perfect for work or recreation.",
        starting_bid: 32000,
        current_bid: 38500,
        reserve_price: 35000,
        status: "ended",
        seller_id: 1,
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
        body_type: "Sedan",
        doors: 4,
        description: "Luxury BMW 3 Series with premium features including leather seats, navigation, and sunroof.",
        starting_bid: 25000,
        current_bid: 25000,
        reserve_price: 27000,
        status: "upcoming",
        seller_id: 1,
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
        body_type: "Sedan",
        doors: 4,
        description: "Elegant Mercedes C-Class with luxury appointments and advanced safety features.",
        starting_bid: 28000,
        current_bid: 33200,
        reserve_price: 30000,
        status: "active",
        seller_id: 1,
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
        body_type: "Sedan",
        doors: 4,
        description: "Sophisticated Audi A4 with advanced technology and quattro all-wheel drive.",
        starting_bid: 30000,
        current_bid: 34500,
        reserve_price: 32000,
        status: "active",
        seller_id: 1,
      },
      {
        make: "Tesla",
        model: "Model 3",
        year: 2021,
        mileage: 25000,
        condition: "Excellent",
        vin: "5YJ3E1EA1MF123456",
        color: "White",
        transmission: "Automatic",
        fuel_type: "Electric",
        engine_size: "Electric Motor",
        body_type: "Sedan",
        doors: 4,
        description:
          "Tesla Model 3 with autopilot features and supercharging capability. Environmentally friendly and high-tech.",
        starting_bid: 35000,
        current_bid: 35000,
        reserve_price: 38000,
        status: "upcoming",
        seller_id: 1,
      },
      {
        make: "Chevrolet",
        model: "Silverado",
        year: 2020,
        mileage: 42000,
        condition: "Good",
        vin: "1GCUYDED5LZ123456",
        color: "Blue",
        transmission: "Automatic",
        fuel_type: "Gasoline",
        engine_size: "5.3L",
        body_type: "Pickup",
        doors: 4,
        description: "Reliable Chevrolet Silverado with heavy-duty capabilities and spacious cabin.",
        starting_bid: 28000,
        current_bid: 31500,
        reserve_price: 30000,
        status: "active",
        seller_id: 1,
      },
    ]

    // Insert vehicles
    for (const vehicle of vehicles) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO vehicles (
                    make, model, year, mileage, condition, vin, color, transmission,
                    fuel_type, engine_size, body_type, doors, description, 
                    starting_bid, current_bid, reserve_price, status, seller_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            vehicle.body_type,
            vehicle.doors,
            vehicle.description,
            vehicle.starting_bid,
            vehicle.current_bid,
            vehicle.reserve_price,
            vehicle.status,
            vehicle.seller_id,
          ],
          function (err) {
            if (err) reject(err)
            else resolve(this.lastID)
          },
        )
      })
    }
    console.log("✓ Vehicles seeded")

    // Sample auctions
    const now = new Date()
    const auctions = [
      {
        vehicle_id: 1,
        title: "2020 Toyota Camry - Excellent Condition",
        description: "Don't miss this opportunity to own a reliable and well-maintained Toyota Camry.",
        start_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        auctioneer_id: 2,
      },
      {
        vehicle_id: 2,
        title: "2019 Honda Civic - Manual Transmission",
        description: "Perfect for driving enthusiasts who appreciate manual transmission.",
        start_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        auctioneer_id: 2,
      },
      {
        vehicle_id: 3,
        title: "2021 Ford F-150 - Heavy Duty Truck",
        description: "Powerful truck perfect for work and recreation. Auction has ended.",
        start_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "ended",
        auctioneer_id: 2,
      },
      {
        vehicle_id: 5,
        title: "2019 Mercedes C-Class - Luxury Sedan",
        description: "Experience luxury and performance in this elegant Mercedes-Benz.",
        start_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        auctioneer_id: 2,
      },
      {
        vehicle_id: 6,
        title: "2020 Audi A4 - All-Wheel Drive",
        description: "Sophisticated German engineering with quattro all-wheel drive system.",
        start_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        auctioneer_id: 2,
      },
      {
        vehicle_id: 8,
        title: "2020 Chevrolet Silverado - Work Ready",
        description: "Dependable truck ready for any job. Currently accepting bids.",
        start_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        auctioneer_id: 2,
      },
    ]

    // Insert auctions
    for (const auction of auctions) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO auctions (
                    vehicle_id, title, description, start_time, end_time, status, auctioneer_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            auction.vehicle_id,
            auction.title,
            auction.description,
            auction.start_time,
            auction.end_time,
            auction.status,
            auction.auctioneer_id,
          ],
          function (err) {
            if (err) reject(err)
            else resolve(this.lastID)
          },
        )
      })
    }
    console.log("✓ Auctions seeded")

    // Sample bids
    const sampleBids = [
      { auction_id: 1, user_id: 3, bid_amount: 19000 },
      { auction_id: 1, user_id: 4, bid_amount: 20500 },
      { auction_id: 1, user_id: 5, bid_amount: 22500 },
      { auction_id: 2, user_id: 3, bid_amount: 17000 },
      { auction_id: 2, user_id: 5, bid_amount: 18500 },
      { auction_id: 2, user_id: 4, bid_amount: 19800 },
      { auction_id: 3, user_id: 4, bid_amount: 33000 },
      { auction_id: 3, user_id: 5, bid_amount: 36000 },
      { auction_id: 3, user_id: 3, bid_amount: 38500 },
      { auction_id: 4, user_id: 3, bid_amount: 29000 },
      { auction_id: 4, user_id: 4, bid_amount: 31500 },
      { auction_id: 4, user_id: 5, bid_amount: 33200 },
      { auction_id: 5, user_id: 4, bid_amount: 31000 },
      { auction_id: 5, user_id: 3, bid_amount: 33000 },
      { auction_id: 5, user_id: 5, bid_amount: 34500 },
      { auction_id: 6, user_id: 3, bid_amount: 29000 },
      { auction_id: 6, user_id: 5, bid_amount: 31500 },
    ]

    // Insert bids
    for (const bid of sampleBids) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO bids (auction_id, user_id, bid_amount) VALUES (?, ?, ?)`,
          [bid.auction_id, bid.user_id, bid.bid_amount],
          function (err) {
            if (err) reject(err)
            else resolve(this.lastID)
          },
        )
      })
    }
    console.log("✓ Bids seeded")

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    db.close()
  }
}

// Run the seeding function
seedDatabase()
