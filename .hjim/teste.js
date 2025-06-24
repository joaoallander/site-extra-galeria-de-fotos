// Sample photo data
const samplePhotos = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    title: "Paisagem do Pôr do Sol",
    date: "2025-06-24",
    size: "2.4 MB",
    dimensions: "1920x1080",
    camera: "iPhone 14 Pro",
    favorite: false,
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=400",
    title: "Retrato Urbano",
    date: "2025-06-23",
    size: "3.1 MB",
    dimensions: "1080x1920",
    camera: "Canon EOS R5",
    favorite: true,
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=400",
    title: "Arquitetura Moderna",
    date: "2025-06-22",
    size: "1.8 MB",
    dimensions: "1080x1080",
    camera: "Sony A7III",
    favorite: false,
  },
  {
    id: 4,
    src: "/placeholder.svg?height=500&width=700",
    title: "Natureza Selvagem",
    date: "2025-06-21",
    size: "4.2 MB",
    dimensions: "2048x1536",
    camera: "Nikon D850",
    favorite: false,
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=500",
    title: "Arte de Rua",
    date: "2025-06-20",
    size: "2.7 MB",
    dimensions: "1536x2048",
    camera: "iPhone 14 Pro",
    favorite: true,
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    title: "Momento Familiar",
    date: "2025-06-19",
    size: "3.5 MB",
    dimensions: "1920x1080",
    camera: "Canon EOS R6",
    favorite: false,
  },
]

// DOM Elements
const photoGrid = document.getElementById("photoGrid")
const photoModal = document.getElementById("photoModal")
const uploadModal = document.getElementById("uploadModal")
const searchInput = document.getElementById("searchInput")
const uploadBtn = document.getElementById("uploadBtn")
const uploadArea = document.getElementById("uploadArea")
const fileInput = document.getElementById("fileInput")

// State
let currentPhotoIndex = 0
let filteredPhotos = [...samplePhotos]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  renderPhotos()
  setupEventListeners()
  setupSearch()
  setupUpload()
})

// Render photos in the grid
function renderPhotos() {
  photoGrid.innerHTML = ""

  filteredPhotos.forEach((photo, index) => {
    const photoElement = createPhotoElement(photo, index)
    photoGrid.appendChild(photoElement)
  })
}

// Create individual photo element
function createPhotoElement(photo, index) {
  const photoDiv = document.createElement("div")
  photoDiv.className = "photo-item"
  photoDiv.style.animationDelay = `${index * 0.1}s`

  photoDiv.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-info">
                <h4>${photo.title}</h4>
                <span>${formatDate(photo.date)}</span>
            </div>
        </div>
        <div class="photo-actions">
            <button onclick="toggleFavorite(${photo.id})" title="${photo.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
                <i class="${photo.favorite ? "fas" : "far"} fa-heart"></i>
            </button>
            <button onclick="sharePhoto(${photo.id})" title="Compartilhar">
                <i class="fas fa-share"></i>
            </button>
        </div>
    `

  photoDiv.addEventListener("click", () => openPhotoModal(index))

  return photoDiv
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Setup event listeners
function setupEventListeners() {
  // Modal close buttons
  document.getElementById("closeModal").addEventListener("click", closePhotoModal)
  document.getElementById("closeUploadModal").addEventListener("click", closeUploadModal)

  // Modal navigation
  document.getElementById("prevBtn").addEventListener("click", showPreviousPhoto)
  document.getElementById("nextBtn").addEventListener("click", showNextPhoto)

  // Upload button
  uploadBtn.addEventListener("click", openUploadModal)

  // Modal backdrop clicks
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) closePhotoModal()
  })

  uploadModal.addEventListener("click", (e) => {
    if (e.target === uploadModal) closeUploadModal()
  })

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyPress)

  // Filter and sort buttons
  setupFilterAndSort()

  // Mobile menu toggle
  setupMobileMenu()
}

// Handle keyboard navigation
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

// Photo modal functions
function openPhotoModal(index) {
  currentPhotoIndex = index
  const photo = filteredPhotos[index]

  document.getElementById("modalImage").src = photo.src
  document.getElementById("modalTitle").textContent = photo.title
  document.getElementById("modalDate").textContent = formatDate(photo.date)
  document.getElementById("photoSize").textContent = photo.size
  document.getElementById("photoDimensions").textContent = photo.dimensions
  document.getElementById("photoCamera").textContent = photo.camera

  // Update favorite button
  const favoriteBtn = document.getElementById("favoriteBtn")
  favoriteBtn.innerHTML = `<i class="${photo.favorite ? "fas" : "far"} fa-heart"></i>`
  favoriteBtn.onclick = () => toggleFavorite(photo.id)

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

// Upload modal functions
function openUploadModal() {
  uploadModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeUploadModal() {
  uploadModal.classList.remove("active")
  document.body.style.overflow = ""
}

// Search functionality
function setupSearch() {
  let searchTimeout

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim()

      if (query === "") {
        filteredPhotos = [...samplePhotos]
      } else {
        filteredPhotos = samplePhotos.filter(
          (photo) =>
            photo.title.toLowerCase().includes(query) ||
            photo.date.includes(query) ||
            photo.camera.toLowerCase().includes(query),
        )
      }

      renderPhotos()
      updatePhotoCount()
    }, 300)
  })
}

// Update photo count display
function updatePhotoCount() {
  const countElement = document.querySelector(".photo-count")
  if (countElement) {
    countElement.textContent = `${filteredPhotos.length} fotos`
  }
}

// Filter and sort functionality
function setupFilterAndSort() {
  // Filter dropdown
  const filterLinks = document.querySelectorAll("[data-filter]")
  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const filter = e.target.dataset.filter
      applyFilter(filter)
    })
  })

  // Sort dropdown
  const sortLinks = document.querySelectorAll("[data-sort]")
  sortLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const sort = e.target.dataset.sort
      applySort(sort)
    })
  })
}

function applyFilter(filter) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

  switch (filter) {
    case "all":
      filteredPhotos = [...samplePhotos]
      break
    case "today":
      filteredPhotos = samplePhotos.filter((photo) => new Date(photo.date) >= today)
      break
    case "week":
      filteredPhotos = samplePhotos.filter((photo) => new Date(photo.date) >= weekAgo)
      break
    case "month":
      filteredPhotos = samplePhotos.filter((photo) => new Date(photo.date) >= monthAgo)
      break
    case "year":
      filteredPhotos = samplePhotos.filter((photo) => new Date(photo.date) >= yearAgo)
      break
  }

  renderPhotos()
  updatePhotoCount()
}

function applySort(sort) {
  switch (sort) {
    case "date-desc":
      filteredPhotos.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "date-asc":
      filteredPhotos.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case "name":
      filteredPhotos.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "size":
      filteredPhotos.sort((a, b) => {
        const sizeA = Number.parseFloat(a.size)
        const sizeB = Number.parseFloat(b.size)
        return sizeB - sizeA
      })
      break
  }

  renderPhotos()
}

// Photo actions
function toggleFavorite(photoId) {
  const photo = samplePhotos.find((p) => p.id === photoId)
  if (photo) {
    photo.favorite = !photo.favorite
    renderPhotos()

    // Update modal if open
    if (photoModal.classList.contains("active")) {
      const favoriteBtn = document.getElementById("favoriteBtn")
      favoriteBtn.innerHTML = `<i class="${photo.favorite ? "fas" : "far"} fa-heart"></i>`
    }

    // Show toast notification
    showToast(photo.favorite ? "Adicionado aos favoritos" : "Removido dos favoritos")
  }
}

function sharePhoto(photoId) {
  const photo = samplePhotos.find((p) => p.id === photoId)
  if (photo && navigator.share) {
    navigator.share({
      title: photo.title,
      text: `Confira esta foto: ${photo.title}`,
      url: window.location.href,
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    showToast("Link copiado para a área de transferência")
  }
}

// Upload functionality
function setupUpload() {
  // Click to upload
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

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
  const validFiles = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))

  if (validFiles.length === 0) {
    showToast("Por favor, selecione apenas arquivos de imagem ou vídeo")
    return
  }

  simulateUpload(validFiles)
}

function simulateUpload(files) {
  const progressElement = document.getElementById("uploadProgress")
  const progressFill = progressElement.querySelector(".progress-fill")
  const progressText = progressElement.querySelector(".progress-text")

  progressElement.style.display = "block"

  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      setTimeout(() => {
        closeUploadModal()
        showToast(`${files.length} arquivo(s) enviado(s) com sucesso!`)
        progressElement.style.display = "none"
        progressFill.style.width = "0%"
        progressText.textContent = "Enviando... 0%"
      }, 500)
    }

    progressFill.style.width = `${progress}%`
    progressText.textContent = `Enviando... ${Math.round(progress)}%`
  }, 200)
}

// Mobile menu functionality
function setupMobileMenu() {
  // Add mobile menu toggle button if needed
  if (window.innerWidth <= 768) {
    const header = document.querySelector(".header-content")
    const menuBtn = document.createElement("button")
    menuBtn.className = "btn-icon mobile-menu-btn"
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>'
    menuBtn.addEventListener("click", toggleMobileMenu)

    header.insertBefore(menuBtn, header.firstChild)
  }
}

function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar")
  sidebar.classList.toggle("open")
}

// Toast notifications
function showToast(message) {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 3000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
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
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// View toggle functionality
document.getElementById("viewToggle").addEventListener("click", function () {
  const grid = document.getElementById("photoGrid")
  const icon = this.querySelector("i")

  if (grid.classList.contains("list-view")) {
    grid.classList.remove("list-view")
    icon.className = "fas fa-th"
    this.title = "Visualização em lista"
  } else {
    grid.classList.add("list-view")
    icon.className = "fas fa-list"
    this.title = "Visualização em grade"
  }
})

// Add list view styles
const listViewStyles = `
.photo-grid.list-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    auto-rows: unset;
}

.photo-grid.list-view .photo-item {
    display: flex;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}

.photo-grid.list-view .photo-item img {
    width: 200px;
    height: 100%;
    object-fit: cover;
}

.photo-grid.list-view .photo-overlay {
    position: static;
    background: none;
    opacity: 1;
    flex: 1;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.photo-grid.list-view .photo-info {
    color: #333;
}

.photo-grid.list-view .photo-actions {
    position: static;
    opacity: 1;
}
`

// Add the styles to the document
const styleSheet = document.createElement("style")
styleSheet.textContent = listViewStyles
document.head.appendChild(styleSheet)

// Responsive handling
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const sidebar = document.querySelector(".sidebar")
    sidebar.classList.remove("open")
  }
})
