// 1. Image Data
const images = [
    { src: 'https://picsum.photos/id/1015/800/600', caption: 'River Valley' },
    { src: 'https://picsum.photos/id/1016/800/600', caption: 'Canyon Sunset' },
    { src: 'https://picsum.photos/id/1018/800/600', caption: 'Mountain Range' },
    { src: 'https://picsum.photos/id/1019/800/600', caption: 'Starry Night' },
    { src: 'https://picsum.photos/id/1020/800/600', caption: 'Winter Bear' },
    { src: 'https://picsum.photos/id/1021/800/600', caption: 'Misty Forest' },
    { src: 'https://picsum.photos/id/1022/800/600', caption: 'Deep Space' },
    { src: 'https://picsum.photos/id/1024/800/600', caption: 'Eagle Flight' },
    { src: 'https://picsum.photos/id/1025/800/600', caption: 'Pug in Blanket' }
];

// 2. DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const imageCounter = document.getElementById('image-counter');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;

// 3. Initialize Gallery
function initGallery() {
    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const imageElement = document.createElement('img');
        imageElement.src = img.src;
        imageElement.alt = img.caption;
        imageElement.dataset.index = index; // Store index for click handler
        imageElement.loading = 'lazy'; // Performance optimization
        
        item.appendChild(imageElement);
        galleryGrid.appendChild(item);
    });
}

// 4. Modal Functions
function openModal(index) {
    currentIndex = index;
    updateModalContent();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

function updateModalContent() {
    const img = images[currentIndex];
    
    // Add fade effect for smoother transition
    modalImage.style.opacity = '0.5';
    
    setTimeout(() => {
        modalImage.src = img.src;
        modalImage.alt = img.caption;
        modalCaption.textContent = img.caption;
        imageCounter.textContent = `${currentIndex + 1} of ${images.length}`;
        modalImage.style.opacity = '1';
    }, 150);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Loop back to start
    updateModalContent();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop to end
    updateModalContent();
}

// 5. Event Listeners

// Initialize
initGallery();

// Click on thumbnail (Event Delegation)
galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const index = parseInt(e.target.dataset.index);
        openModal(index);
    }
});

// Close button
closeBtn.addEventListener('click', closeModal);

// Click outside image to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Navigation buttons
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return; // Only if modal is open

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});