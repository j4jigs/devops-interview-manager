async function loadCategory(category) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "<p>Loading...</p>";

    const response = await fetch("data.json");
    const data = await response.json();

    if (!data[category] || data[category].length === 0) {
        contentDiv.innerHTML = "<p>No links saved in this category.</p>";
        return;
    }

    let html = "<ul>";

    data[category].forEach(item => {
        html += `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`;
    });

    html += "</ul>";

    contentDiv.innerHTML = html;
}
