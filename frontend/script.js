const RENDER_BACKEND_URL = 'http://127.0.0.1:5000';

const uploadSection = document.getElementById('uploadSection');
const progressSection = document.getElementById('progressSection');
const resultSection = document.getElementById('resultSection');

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');

const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');

const resultImg = document.getElementById('resultImg');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let selectedFile = null;

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
});

function showSection(section) {
    uploadSection.classList.add('hidden');
    progressSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    section.classList.remove('hidden');
}

function updateProgress(val) {
    progressBar.style.width = `${val}%`;
    progressPercent.textContent = `${Math.round(val)}%`;
}

async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    selectedFile = file;
    showSection(progressSection);
    updateProgress(0);

    const formData = new FormData();
    formData.append('image', selectedFile);

    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += (95 - currentProgress) * 0.08;
        updateProgress(currentProgress);
    }, 150);

    try {
        const response = await fetch(`${RENDER_BACKEND_URL}/api/remove-bg`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to process image');

        clearInterval(interval);
        updateProgress(100);

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        setTimeout(() => {
            resultImg.src = imageUrl;
            downloadBtn.href = imageUrl;
            showSection(resultSection);
        }, 400);

    } catch (err) {
        clearInterval(interval);
        alert(`Error: ${err.message}`);
        showSection(uploadSection);
    }
}

resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    selectedFile = null;
    showSection(uploadSection);
});