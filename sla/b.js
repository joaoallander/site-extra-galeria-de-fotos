// Sample photo data
const samplePhotos = [
    {
        id: 1,
        src: '/placeholder.svg?height=400&width=400',
        title: 'Paisagem Montanhosa',
        date: '2025-06-20',
        category: 'nature',
        favorite: false
    },
    {
        id: 2,
        src: '/placeholder.svg?height=500&width=400',
        title: 'Pôr do Sol na Praia',
        date: '2025-06-19',
        category: 'nature',
        favorite: true
    },
    {
        id: 3,
        src: '/placeholder.svg?height=300&width=400',
        title: 'Arquitetura Moderna',
        date: '2025-06-18',
        category: 'architecture',
        favorite: false
    },
    {
        id: 4,
        src: '/placeholder.svg?height=450&width=400',
        title: 'Retrato Artístico',
        date: '2025-06-17',
        category: 'portrait',
        favorite: true
    },
    {
        id: 5,
        src: '/placeholder.svg?height=350&width=400',
        title: 'Vida Urbana',
        date: '2025-06-16',
        category: 'street',
        favorite: false
    },
    {
        id: 6,
        src: '/placeholder.svg?height=400&width=400',
        title: 'Natureza Selvagem',
        date: '2025-06-15',
        category: 'nature',
        favorite: true
    },
    {
        id: 7,
        src: '/placeholder.svg?height=380&width=400',
        title: 'Arte Abstrata',
        date: '2025-06-14',
        category: 'abstract',
        favorite: false
    },
    {
        id: 8,
        src: '/placeholder.svg?height=420&width=400',
        title: 'Gastronomia',
        date: '2025-06-13',
        category: 'food',
        favorite: true
    }
];

let currentPhotos = [...samplePhotos];
let currentPhotoIndex = 0;
let currentCategory = 'all';

// Initialize the gallery
document.addEventListener('DOMContentLoaded', function() {
    loadPhotos();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            if (category) {
                setActiveCategory(category);
                filterPhotos(category);
            }
        });
    });

    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            toggleView(view);
        });
    });

    // Sort select
    document.querySelector('.sort-select').addEventListener('change', function() {
        sortPhotos(this.value);
    });

    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);

    // Upload area drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);

    // Modal close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
                closeUploadModal();
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

// Load and display photos
function loadPhotos() {
    const grid = document.getElementById('photoGrid');
    grid.innerHTML = '';

    currentPhotos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        grid.appendChild(photoElement);
    });
}

// Create photo element
function createPhotoElement(photo, index) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-item';
    photoDiv.onclick = () => openPhotoModal(index);

    photoDiv.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-title">${photo.title}</div>
            <div class="photo-date">${formatDate(photo.date)}</div>
        </div>
        <div class="photo-actions">
            <button class="action-btn favorite ${photo.favorite ? 'active' : ''}" 
                    onclick="event.stopPropagation(); togglePhotoFavorite(${photo.id})">
                <i class="fas fa-heart"></i>
            </button>
            <button class="action-btn share" onclick="event.stopPropagation(); sharePhoto(${photo.id})">
                <i class="fas fa-share"></i>
            </button>
            <button class="action-btn download" onclick="event.stopPropagation(); downloadPhoto(${photo.id})">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `;

    return photoDiv;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// Toggle search bar
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

// Search photos
function searchPhotos() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query) {
        currentPhotos = samplePhotos.filter(photo => 
            photo.title.toLowerCase().includes(query) ||
            photo.category.toLowerCase().includes(query)
        );
    } else {
        currentPhotos = [...samplePhotos];
    }
    loadPhotos();
}

// Set active category
function setActiveCategory(category) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector([data-category="${category}"]).classList.add('active');
    currentCategory = category;
}

// Filter photos by category
function filterPhotos(category) {
    if (category === 'all') {
        currentPhotos = [...samplePhotos];
    } else if (category === 'favorites') {
        currentPhotos = samplePhotos.filter(photo => photo.favorite);
    } else if (category === 'recent') {
        currentPhotos = samplePhotos.slice(0, 4);
    } else {
        currentPhotos = samplePhotos.filter(photo => photo.category === category);
    }
    loadPhotos();
    updateSectionTitle(category);
}

// Update section title
function updateSectionTitle(category) {
    const titles = {
        'all': 'Todas as Fotos',
        'favorites': 'Fotos Favoritas',
        'recent': 'Fotos Recentes',
        'albums': 'Álbuns',
        'shared': 'Fotos Compartilhadas',
        'trash': 'Lixeira'
    };
    document.querySelector('.section-title').textContent = titles[category] || 'Fotos';
}

// Sort photos
function sortPhotos(criteria) {
    switch (criteria) {
        case 'date':
            currentPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'name':
            currentPhotos.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'size':
            // Simulate size sorting
            currentPhotos.sort(() => Math.random() - 0.5);
            break;
    }
    loadPhotos();
}

// Toggle view (grid/list)
function toggleView(view) {
    const grid = document.getElementById('photoGrid');
    if (view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
        grid.querySelectorAll('.photo-item').forEach(item => {
            item.style.aspectRatio = '3/1';
        });
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        grid.querySelectorAll('.photo-item').forEach(item => {
            item.style.aspectRatio = '1';
        });
    }
}

// Open photo modal
function openPhotoModal(index) {
    currentPhotoIndex = index;
    const photo = currentPhotos[index];
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');

    modalImage.src = photo.src;
    modalImage.alt = photo.title;
    modalTitle.textContent = photo.title;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('photoModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate photos in modal
function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    openPhotoModal(currentPhotoIndex);
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    openPhotoModal(currentPhotoIndex);
}

// Toggle photo favorite
function togglePhotoFavorite(photoId) {
    const photo = samplePhotos.find(p => p.id === photoId);
    if (photo) {
        photo.favorite = !photo.favorite;
        loadPhotos();
        showNotification(photo.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
    }
}

// Share photo
function sharePhoto(photoId) {
    if (navigator.share) {
        navigator.share({
            title: 'Confira esta foto!',
            text: 'Uma foto incrível da minha galeria',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copiado para a área de transferência!');
    }
}

// Download photo
function downloadPhoto(photoId) {
    const photo = samplePhotos.find(p => p.id === photoId);
    if (photo) {
        const link = document.createElement('a');
        link.href = photo.src;
        link.download = ${photo.title}.jpg;
        link.click();
        showNotification('Download iniciado!');
    }
}

// Load more photos
function loadMorePhotos() {
    // Simulate loading more photos
    const newPhotos = samplePhotos.map(photo => ({
        ...photo,
        id: photo.id + samplePhotos.length,
        title: photo.title + ' (Nova)'
    }));
    
    currentPhotos = [...currentPhotos, ...newPhotos];
    loadPhotos();
    showNotification('Mais fotos carregadas!');
}

// Open upload modal
function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close upload modal
function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('uploadProgress').style.display = 'none';
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#4facfe';
    event.currentTarget.style.backgroundColor = 'rgba(79, 172, 254, 0.1)';
}

// Handle drag leave
function handleDragLeave(event) {
    event.currentTarget.style.borderColor = 'var(--border-color)';
    event.currentTarget.style.backgroundColor = 'transparent';
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
    handleDragLeave(event);
}

// Upload files
function uploadFiles(files) {
    const progressContainer = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressContainer.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                closeUploadModal();
                showNotification(${files.length} foto(s) enviada(s) com sucesso!);
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 200);
}

// Handle keyboard navigation
function handleKeyboard(event) {
    const modal = document.getElementById('photoModal');
    if (modal.classList.contains('active')) {
        switch (event.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevPhoto();
                break;
            case 'ArrowRight':
                nextPhoto();
                break;
        }
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);