// API Configuration
const API_BASE_URL = "http://localhost:3000/api"

// Global State
let vehicles = []
let auctions = []
let stats = {}
let currentPage = "dashboard"

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatTimeRemaining(endTime) {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "active":
      return "badge-active"
    case "ended":
      return "badge-ended"
    case "upcoming":
      return "badge-upcoming"
    default:
      return "badge-secondary"
  }
}

// API Functions
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return null
  }
}

async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error)
    throw error
  }
}

// Data Loading Functions
async function loadDashboardData() {
  showLoading(true)

  try {
    const [vehiclesData, statsData] = await Promise.all([fetchData("/vehicles"), fetchData("/stats")])

    if (vehiclesData) vehicles = vehiclesData
    if (statsData) stats = statsData

    updateStatsDisplay()
    renderVehiclesGrid(vehicles)
  } catch (error) {
    console.error("Error loading dashboard data:", error)
  } finally {
    showLoading(false)
  }
}

async function loadVehicles() {
  const vehiclesData = await fetchData("/vehicles")
  if (vehiclesData) {
    vehicles = vehiclesData
    renderVehiclesList(vehicles)
  }
}

async function loadAuctions() {
  const auctionsData = await fetchData("/auctions")
  if (auctionsData) {
    auctions = auctionsData
    renderAuctionsList(auctions)
    updateAuctionStats()
  }
}

// Rendering Functions
function updateStatsDisplay() {
  document.getElementById("total-vehicles").textContent = stats.totalVehicles || 0
  document.getElementById("active-auctions").textContent = stats.activeAuctions || 0
  document.getElementById("total-users").textContent = stats.totalUsers || 0
  document.getElementById("total-revenue").textContent = formatCurrency(stats.totalRevenue || 0)
}

function renderVehiclesGrid(vehiclesToRender) {
  const grid = document.getElementById("vehicles-grid")

  if (!vehiclesToRender || vehiclesToRender.length === 0) {
    grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-car"></i>
                <h3>No vehicles found</h3>
                <p>Get started by adding your first vehicle.</p>
                <button class="btn btn-primary" onclick="showAddVehicleModal()">
                    <i class="fas fa-plus"></i> Add Vehicle
                </button>
            </div>
        `
    return
  }

  grid.innerHTML = vehiclesToRender
    .map(
      (vehicle) => `
        <div class="vehicle-card">
            <div class="vehicle-image">
                <i class="fas fa-car"></i>
            </div>
            <div class="vehicle-content">
                <div class="vehicle-header">
                    <div>
                        <div class="vehicle-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</div>
                        <div class="vehicle-subtitle">${vehicle.mileage.toLocaleString()} miles • ${vehicle.condition}</div>
                    </div>
                    <span class="badge ${getStatusBadgeClass(vehicle.status)}">${vehicle.status}</span>
                </div>
                <div class="vehicle-details">
                    <div class="detail-row">
                        <span class="detail-label">Starting Bid:</span>
                        <span class="detail-value">${formatCurrency(vehicle.startingBid)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Current Bid:</span>
                        <span class="detail-value highlight">${formatCurrency(vehicle.currentBid)}</span>
                    </div>
                    ${
                      vehicle.status === "active"
                        ? `
                        <div class="detail-row">
                            <span class="detail-label">Time Left:</span>
                            <span class="detail-value urgent">${formatTimeRemaining(vehicle.auctionEndTime)}</span>
                        </div>
                    `
                        : ""
                    }
                </div>
                <div class="vehicle-actions">
                    <button class="btn btn-outline" onclick="viewVehicleDetails(${vehicle.id})">View Details</button>
                    ${
                      vehicle.status === "active"
                        ? `<button class="btn btn-primary" onclick="showBidModal(${vehicle.id})">Place Bid</button>`
                        : `<button class="btn btn-secondary" onclick="editVehicle(${vehicle.id})">Edit</button>`
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderVehiclesList(vehiclesToRender) {
  const list = document.getElementById("vehicles-list")
  renderVehiclesGrid.call({ getElementById: () => list }, vehiclesToRender)
}

function renderAuctionsList(auctionsToRender) {
  const list = document.getElementById("auctions-list")

  if (!auctionsToRender || auctionsToRender.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gavel"></i>
                <h3>No auctions found</h3>
                <p>No auctions are currently available.</p>
                <button class="btn btn-primary" onclick="showCreateAuctionModal()">
                    <i class="fas fa-plus"></i> Create Auction
                </button>
            </div>
        `
    return
  }

  list.innerHTML = auctionsToRender
    .map(
      (auction) => `
        <div class="auction-card">
            <div class="auction-content">
                <div class="auction-image">
                    <i class="fas fa-car"></i>
                </div>
                <div class="auction-details">
                    <div class="auction-header">
                        <div>
                            <div class="auction-title">${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}</div>
                            <div class="auction-id">Auction #${auction.id}</div>
                        </div>
                        <span class="badge ${getStatusBadgeClass(auction.status)}">${auction.status}</span>
                    </div>
                    <div class="auction-stats-grid">
                        <div class="auction-stat">
                            <div class="auction-stat-label">Starting Bid</div>
                            <div class="auction-stat-value">${formatCurrency(auction.startingBid)}</div>
                        </div>
                        <div class="auction-stat">
                            <div class="auction-stat-label">Current Bid</div>
                            <div class="auction-stat-value highlight">${formatCurrency(auction.currentBid)}</div>
                        </div>
                        <div class="auction-stat">
                            <div class="auction-stat-label">Total Bids</div>
                            <div class="auction-stat-value">${auction.bidCount}</div>
                        </div>
                        <div class="auction-stat">
                            <div class="auction-stat-label">${auction.status === "active" ? "Time Left" : "Status"}</div>
                            <div class="auction-stat-value ${auction.status === "active" ? "urgent" : ""}">${
                              auction.status === "active"
                                ? formatTimeRemaining(auction.endTime)
                                : auction.status === "ended"
                                  ? "Ended"
                                  : "Upcoming"
                            }</div>
                        </div>
                    </div>
                    ${
                      auction.highestBidder && auction.status !== "upcoming"
                        ? `
                        <div style="margin-bottom: 1rem;">
                            <small class="detail-label">Highest Bidder: <strong>${auction.highestBidder}</strong></small>
                        </div>
                    `
                        : ""
                    }
                    <div class="auction-actions">
                        <button class="btn btn-outline" onclick="viewAuctionDetails(${auction.id})">View Details</button>
                        ${
                          auction.status === "active"
                            ? `<button class="btn btn-primary" onclick="showBidModal(${auction.vehicleId})"><i class="fas fa-gavel"></i> Place Bid</button>`
                            : auction.status === "upcoming"
                              ? `<button class="btn btn-secondary"><i class="fas fa-clock"></i> Watch Auction</button>`
                              : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function updateAuctionStats() {
  const activeCount = auctions.filter((a) => a.status === "active").length
  const totalBids = auctions.reduce((sum, auction) => sum + auction.bidCount, 0)
  const endingSoon = auctions.filter((a) => {
    const timeLeft = new Date(a.endTime).getTime() - Date.now()
    return timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000
  }).length

  document.getElementById("auction-active-count").textContent = activeCount
  document.getElementById("auction-bids-count").textContent = totalBids
  document.getElementById("auction-ending-count").textContent = endingSoon
}

// Navigation Functions
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  // Show selected page
  document.getElementById(`${pageName}-page`).classList.add("active")

  // Update navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  document.querySelector(`[data-page="${pageName}"]`).classList.add("active")

  currentPage = pageName

  // Load page data
  switch (pageName) {
    case "dashboard":
      loadDashboardData()
      break
    case "vehicles":
      loadVehicles()
      break
    case "auctions":
      loadAuctions()
      break
  }
}

// Modal Functions
function showModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

function showAddVehicleModal() {
  showModal("add-vehicle-modal")
}

function showCreateAuctionModal() {
  alert("Create Auction functionality would be implemented here")
}

function showBidModal(vehicleId) {
  const vehicle = vehicles.find((v) => v.id === vehicleId)
  if (!vehicle) return

  const bidInfo = document.getElementById("bid-vehicle-info")
  bidInfo.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <h4>${vehicle.year} ${vehicle.make} ${vehicle.model}</h4>
            <p>Current Bid: ${formatCurrency(vehicle.currentBid)}</p>
        </div>
    `

  const minBidElement = document.getElementById("min-bid")
  const minBid = vehicle.currentBid + 100 // Minimum increment
  minBidElement.textContent = formatCurrency(minBid)

  document.getElementById("bid-amount").min = minBid
  document.getElementById("bid-amount").value = minBid

  showModal("bid-modal")
}

// Utility Functions
function showLoading(show) {
  const loading = document.getElementById("loading")
  if (loading) {
    loading.classList.toggle("hidden", !show)
  }
}

function clearFilters() {
  document.getElementById("vehicle-search").value = ""
  document.getElementById("status-filter").value = "all"
  document.getElementById("condition-filter").value = "all"
  renderVehiclesList(vehicles)
}

// Action Functions
function viewVehicleDetails(vehicleId) {
  alert(`View details for vehicle ${vehicleId} - This would open a detailed view`)
}

function editVehicle(vehicleId) {
  alert(`Edit vehicle ${vehicleId} - This would open an edit form`)
}

function viewAuctionDetails(auctionId) {
  alert(`View auction details for auction ${auctionId}`)
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const page = this.getAttribute("data-page")
      showPage(page)
    })
  })

  // Search functionality
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const filtered = vehicles.filter((vehicle) =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm),
      )
      renderVehiclesGrid(filtered)
    })
  }

  // Vehicle page search
  const vehicleSearch = document.getElementById("vehicle-search")
  if (vehicleSearch) {
    vehicleSearch.addEventListener("input", () => {
      filterVehicles()
    })
  }

  // Vehicle page filters
  const statusFilter = document.getElementById("status-filter")
  const conditionFilter = document.getElementById("condition-filter")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterVehicles)
  }

  if (conditionFilter) {
    conditionFilter.addEventListener("change", filterVehicles)
  }

  // Add vehicle form
  const addVehicleForm = document.getElementById("add-vehicle-form")
  if (addVehicleForm) {
    addVehicleForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const vehicleData = Object.fromEntries(formData.entries())

      // Convert numeric fields
      vehicleData.year = Number.parseInt(vehicleData.year)
      vehicleData.mileage = Number.parseInt(vehicleData.mileage)
      vehicleData.startingBid = Number.parseFloat(vehicleData.startingBid)

      try {
        await postData("/vehicles", vehicleData)
        closeModal("add-vehicle-modal")
        this.reset()

        // Reload data based on current page
        if (currentPage === "dashboard") {
          loadDashboardData()
        } else if (currentPage === "vehicles") {
          loadVehicles()
        }

        alert("Vehicle added successfully!")
      } catch (error) {
        alert("Failed to add vehicle. Please try again.")
      }
    })
  }

  // Bid form
  const bidForm = document.getElementById("bid-form")
  if (bidForm) {
    bidForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const bidAmount = document.getElementById("bid-amount").value
      alert(`Bid of ${formatCurrency(Number.parseFloat(bidAmount))} placed successfully!`)
      closeModal("bid-modal")
    })
  }

  // Modal close on backdrop click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
      }
    })
  })

  // Initialize app
  loadDashboardData()
})

function filterVehicles() {
  const searchTerm = document.getElementById("vehicle-search").value.toLowerCase()
  const statusFilter = document.getElementById("status-filter").value
  const conditionFilter = document.getElementById("condition-filter").value

  const filtered = vehicles.filter((vehicle) => {
    const matchesSearch = `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesCondition = conditionFilter === "all" || vehicle.condition === conditionFilter

    return matchesSearch && matchesStatus && matchesCondition
  })

  renderVehiclesList(filtered)
}
