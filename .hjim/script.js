// DOM Elements
const galleryGrid = document.getElementById("galleryGrid")
const photoModal = document.getElementById("photoModal")
const uploadModal = document.getElementById("uploadModal")
const searchInput = document.getElementById("searchInput")
const filterTabs = document.querySelectorAll(".filter-tab")
const viewBtns = document.querySelectorAll(".view-btn")
const sortSelect = document.getElementById("sortSelect")

// Photo data
let photos = []
let currentPhotoIndex = 0
let filteredPhotos = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializePhotos()
  setupEventListeners()
  setupSearch()
  setupFilters()
  setupUpload()
})

// Initialize photos from DOM
function initializePhotos() {
  const photoCards = document.querySelectorAll(".photo-card")
  photos = Array.from(photoCards).map((card, index) => {
    const img = card.querySelector("img")
    const title = card.querySelector(".photo-info h4").textContent
    const date = card.querySelector(".photo-info p").textContent
    const category = card.dataset.category
    const isFavorite = card.querySelector(".favorite").classList.contains("active")

    return {
      id: Number.parseInt(card.dataset.id),
      src: img.src,
      alt: img.alt,
      title: title,
      date: date,
      category: category,
      favorite: isFavorite,
      element: card,
    }
  })

  filteredPhotos = [...photos]
}

// Setup event listeners
function setupEventListeners() {
  // Photo card clicks
  document.querySelectorAll(".photo-card").forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".action-btn")) {
        openPhotoModal(index)
      }
    })
  })

  // Action buttons
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", handleActionClick)
  })

  // Modal controls
  document.getElementById("closeModal").addEventListener("click", closePhotoModal)
  document.getElementById("prevPhoto").addEventListener("click", showPreviousPhoto)
  document.getElementById("nextPhoto").addEventListener("click", showNextPhoto)

  // Modal backdrop
  document.querySelector(".modal-backdrop").addEventListener("click", closePhotoModal)

  // Upload modal
  document.getElementById("uploadBtn").addEventListener("click", openUploadModal)
  document.getElementById("closeUpload").addEventListener("click", closeUploadModal)
  document.querySelector(".upload-backdrop").addEventListener("click", closeUploadModal)

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyPress)

  // View toggle
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", toggleView)
  })

  // Sort
  sortSelect.addEventListener("change", handleSort)
}

// Handle action button clicks
function handleActionClick(e) {
  e.stopPropagation()
  const action = e.currentTarget.classList.contains("favorite")
    ? "favorite"
    : e.currentTarget.classList.contains("share")
      ? "share"
      : "download"
  const photoCard = e.currentTarget.closest(".photo-card")
  const photoId = Number.parseInt(photoCard.dataset.id)

  switch (action) {
    case "favorite":
      toggleFavorite(photoId, e.currentTarget)
      break
    case "share":
      sharePhoto(photoId)
      break
    case "download":
      downloadPhoto(photoId)
      break
  }
}

// Toggle favorite
function toggleFavorite(photoId, btn) {
  const photo = photos.find((p) => p.id === photoId)
  if (photo) {
    photo.favorite = !photo.favorite

    if (photo.favorite) {
      btn.classList.add("active")
      btn.innerHTML = '<i class="fas fa-heart"></i>'
      showToast("Adicionado aos favoritos")
    } else {
      btn.classList.remove("active")
      btn.innerHTML = '<i class="far fa-heart"></i>'
      showToast("Removido dos favoritos")
    }
  }
}

// Share photo
function sharePhoto(photoId) {
  const photo = photos.find((p) => p.id === photoId)
  if (photo && navigator.share) {
    navigator.share({
      title: photo.title,
      text: `Confira esta foto: ${photo.title}`,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    showToast("Link copiado para área de transferência")
  }
}

// Download photo
function downloadPhoto(photoId) {
  const photo = photos.find((p) => p.id === photoId)
  if (photo) {
    const link = document.createElement("a")
    link.href = photo.src
    link.download = `${photo.title}.jpg`
    link.click()
    showToast("Download iniciado")
  }
}

// Photo modal functions
function openPhotoModal(index) {
  currentPhotoIndex = index
  const photo = filteredPhotos[index]

  document.getElementById("modalImage").src = photo.src
  document.getElementById("modalTitle").textContent = photo.title
  document.getElementById("modalDate").textContent = photo.date

  // Update favorite button
  const favoriteBtn = document.getElementById("modalFavorite")
  if (photo.favorite) {
    favoriteBtn.classList.add("active")
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'
  } else {
    favoriteBtn.classList.remove("active")
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>'
  }

  photoModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closePhotoModal() {
  photoModal.classList.remove("active")
  document.body.style.overflow = ""
}

function showPreviousPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
  openPhotoModal(currentPhotoIndex)
}

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length
  openPhotoModal(currentPhotoIndex)
}

// Upload modal
function openUploadModal() {
  uploadModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeUploadModal() {
  uploadModal.classList.remove("active")
  document.body.style.overflow = ""
}

// Keyboard navigation
function handleKeyPress(e) {
  if (photoModal.classList.contains("active")) {
    switch (e.key) {
      case "Escape":
        closePhotoModal()
        break
      case "ArrowLeft":
        showPreviousPhoto()
        break
      case "ArrowRight":
        showNextPhoto()
        break
    }
  }

  if (uploadModal.classList.contains("active") && e.key === "Escape") {
    closeUploadModal()
  }
}

// Search functionality
function setupSearch() {
  let searchTimeout

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim()
      filterPhotos(query)
    }, 300)
  })
}

function filterPhotos(query = "") {
  const activeFilter = document.querySelector(".filter-tab.active").dataset.filter

  filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      query === "" ||
      photo.title.toLowerCase().includes(query) ||
      photo.alt.toLowerCase().includes(query) ||
      photo.category.toLowerCase().includes(query)

    const matchesFilter = activeFilter === "all" || photo.category === activeFilter

    return matchesSearch && matchesFilter
  })

  updateGalleryDisplay()
}

// Filter functionality
function setupFilters() {
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab
      filterTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Filter photos
      filterPhotos(searchInput.value)
    })
  })
}

// Update gallery display
function updateGalleryDisplay() {
  const allCards = document.querySelectorAll(".photo-card")

  allCards.forEach((card) => {
    const photoId = Number.parseInt(card.dataset.id)
    const isVisible = filteredPhotos.some((photo) => photo.id === photoId)

    if (isVisible) {
      card.style.display = "block"
      card.style.animation = "fadeInUp 0.6s ease forwards"
    } else {
      card.style.display = "none"
    }
  })
}

// View toggle
function toggleView(e) {
  const viewType = e.currentTarget.dataset.view

  viewBtns.forEach((btn) => btn.classList.remove("active"))
  e.currentTarget.classList.add("active")

  if (viewType === "masonry") {
    galleryGrid.classList.add("masonry")
  } else {
    galleryGrid.classList.remove("masonry")
  }
}

// Sort functionality
function handleSort() {
  const sortType = sortSelect.value

  switch (sortType) {
    case "newest":
      filteredPhotos.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "oldest":
      filteredPhotos.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case "name":
      filteredPhotos.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "size":
      // For demo purposes, sort by title length as proxy for size
      filteredPhotos.sort((a, b) => b.title.length - a.title.length)
      break
  }

  updateGalleryDisplay()
}

// Upload functionality
function setupUpload() {
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("fileInput")
  const selectBtn = document.querySelector(".select-files-btn")

  // Click to select files
  selectBtn.addEventListener("click", () => fileInput.click())
  uploadArea.addEventListener("click", () => fileInput.click())

  // File input change
  fileInput.addEventListener("change", handleFileSelect)

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  })
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files)
  handleFiles(files)
}

function handleFiles(files) {
  const validFiles = files.filter((file) => file.type.startsWith("image/"))

  if (validFiles.length === 0) {
    showToast("Por favor, selecione apenas arquivos de imagem")
    return
  }

  // Simulate upload
  showToast(`${validFiles.length} arquivo(s) selecionado(s) para upload`)
  closeUploadModal()
}

// Toast notifications
function showToast(message) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #1e293b;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateY(0)"
    toast.style.opacity = "1"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateY(100px)"
    toast.style.opacity = "0"
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

// Modal action handlers
document.getElementById("modalFavorite").addEventListener("click", () => {
  const photo = filteredPhotos[currentPhotoIndex]
  const btn = document.getElementById("modalFavorite")
  toggleFavorite(photo.id, btn)
})

document.getElementById("modalShare").addEventListener("click", () => {
  const photo = filteredPhotos[currentPhotoIndex]
  sharePhoto(photo.id)
})

document.getElementById("modalDownload").addEventListener("click", () => {
  const photo = filteredPhotos[currentPhotoIndex]
  downloadPhoto(photo.id)
})

// Responsive handling
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    // Mobile adjustments
    galleryGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))"
  } else if (window.innerWidth <= 1024) {
    // Tablet adjustments
    galleryGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))"
  } else {
    // Desktop
    galleryGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))"
  }
})
