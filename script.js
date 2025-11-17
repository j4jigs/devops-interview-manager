const categories = ["aws","k8s","tf","devops","other"];
let savedData = {};

// Load local JSON (for testing, you can replace with GitHub fetch later)
fetch('data.json')
.then(res => res.json())
.then(data => {
    savedData = data;
    initTabs();
})
.catch(err => {
    console.error("Failed to load data.json", err);
    categories.forEach(c => savedData[c] = []);
    initTabs();
});

function initTabs() {
    const container = document.getElementById("tabContainer");
    container.innerHTML = "";

    categories.forEach(cat => {
        container.innerHTML += `
        <div class="tab-section" id="${cat}-section">
            <h3>${cat.toUpperCase()}</h3>
            <ul class="entry-list" id="${cat}-list"></ul>
            <div class="add-form">
                <input id="${cat}-title" placeholder="Title">
                <input id="${cat}-url" placeholder="URL">
                <button onclick="addEntry('${cat}')">Add</button>
            </div>
        </div>`;
    });

    // Render existing entries
    categories.forEach(cat => {
        savedData[cat].forEach(e => renderEntry(cat, e.title, e.url));
    });

    // Tab switching
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

    // Show first tab by default
    document.getElementById('aws-section').classList.add('active');
}

function renderEntry(category, title, url) {
    const list = document.getElementById(`${category}-list`);
    const li = document.createElement('li');
    li.innerHTML = `<a href="${url}" target="_blank">${title}</a>`;
    list.appendChild(li);
}

function addEntry(category) {
    const title = document.getElementById(`${category}-title`).value;
    const url = document.getElementById(`${category}-url`).value;

    if(!title || !url) return alert("Enter both Title and URL!");

    if(!savedData[category]) savedData[category] = [];
    savedData[category].push({title, url});

    renderEntry(category, title, url);

    document.getElementById(`${category}-title`).value = '';
    document.getElementById(`${category}-url`).value = '';

    // Optionally: update GitHub JSON here
}
