const categories = ["aws","k8s","tf","docker","linux","cicd","git"];
let savedData = {};

// Fetch JSON from GitHub or local
fetch('data.json')
.then(response => response.json())
.then(data => {
    savedData = data;
    initTabs();
})
.catch(err => {
    console.error("Failed to load data.json", err);
});

// Initialize tabs
function initTabs() {
    const container = document.getElementById("tabContainer");
    container.innerHTML = "";

    categories.forEach(cat => {
        // Create section
        container.innerHTML += `
        <div class="tab-section" id="${cat}-section">
            <h3>${cat.toUpperCase()}</h3>
            <ul class="video-list" id="${cat}-list"></ul>
            <div class="add-form">
                <input id="${cat}-title" placeholder="Title">
                <input id="${cat}-url" placeholder="URL">
                <button onclick="addVideo('${cat}')">Add</button>
            </div>
        </div>`;
    });

    // Render saved videos
    categories.forEach(cat => {
        if(savedData[cat]) {
            savedData[cat].forEach(v => renderVideo(cat, v.title, v.url));
        }
    });

    // Setup tab buttons
    const tabButtons = document.querySelectorAll('#tabs button');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categories.forEach(c => {
                document.getElementById(`${c}-section`).classList.remove('active');
            });
            document.getElementById(`${btn.dataset.target}-section`).classList.add('active');
        });
    });

    // Show default tab
    document.getElementById('aws-section').classList.add('active');
}

// Render video/PDF link
function renderVideo(category, title, url) {
    const list = document.getElementById(`${category}-list`);
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="${url}" target="_blank">${title}</a>
        <div>
            <button onclick="editVideo('${category}', this)">Edit</button>
            <button onclick="deleteVideo('${category}', this)">Delete</button>
        </div>
    `;
    list.appendChild(li);
}

// Add new video
function addVideo(category) {
    const title = document.getElementById(`${category}-title`).value;
    const url = document.getElementById(`${category}-url`).value;
    if(!title || !url) return alert("Enter both title and URL!");

    if(!savedData[category]) savedData[category] = [];
    savedData[category].push({title, url});

    renderVideo(category, title, url);

    document.getElementById(`${category}-title`).value = '';
    document.getElementById(`${category}-url`).value = '';

    // Optionally, save to GitHub JSON manually if hosting
}

// Edit video
function editVideo(category, btn) {
    const li = btn.closest('li');
    const link = li.querySelector('a');
    const newTitle = prompt("New title:", link.textContent);
    const newUrl = prompt("New URL:", link.href);
    if(!newTitle || !newUrl) return;

    link.textContent = newTitle;
    link.href = newUrl;

    savedData[category] = savedData[category].map(v => v.url === link.href ? {title:newTitle, url:newUrl} : v);
}

// Delete video
function deleteVideo(category, btn) {
    const li = btn.closest('li');
    const url = li.querySelector('a').href;
    li.remove();
    savedData[category] = savedData[category].filter(v => v.url !== url);
}
