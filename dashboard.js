// ================= AUTH =================
const user = localStorage.getItem("loggedInUser");
if (!user) window.location.href = "index.html";
document.getElementById("user").textContent = user;

// ================= GLOBAL VARIABLES =================
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let salesChart, reportChart;

// ================= SECTION CONTROL =================
function openSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "sales") loadSalesChart();
    if (sectionId === "reports") loadReportChart();
    if (sectionId === "calendar") renderCalendar();
}

// ================= INVENTORY FUNCTIONS =================
function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const qty = parseInt(document.getElementById("itemQty").value);
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!name || qty <= 0 || price <= 0) {
        alert("Please fill all fields correctly");
        return;
    }

    inventory.push({ name, qty, price });
    saveInventory();
    clearInventoryInputs();
    renderInventory();
}

function renderInventory() {
    const list = document.getElementById("inventoryList");
    list.innerHTML = inventory.map((item, index) => {
        const total = (item.qty * item.price).toFixed(2);
        return `
    <tr class="${item.qty === 0 ? 'out-of-stock' : ''}">
        <td>${item.name}</td>
        <td>${item.qty === 0 ? 'Out-Of-Stock' : item.qty}</td>
        <td>₱${item.price.toFixed(2)}</td>
        <td>₱${total}</td>
        <td>
        <button onclick="adjustQty(${index}, 1)">+</button>
        <button onclick="adjustQty(${index}, -1)">−</button>
    </td>
    <td>
        <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    </td>
    </tr>
    `;
    }).join("");
}
    // ================= CALENDAR =================
let deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

function addDelivery() {
    const date = document.getElementById("deliveryDate").value;
    const note = document.getElementById("deliveryNote").value.trim();

    if (!date || !note) {
        alert("Please enter a date and description");
        return;
    }

    deliveries.push({ date, note });
    saveDeliveries();
    renderCalendar();

    document.getElementById("deliveryDate").value = "";
    document.getElementById("deliveryNote").value = "";
}

function renderCalendar() {
    const list = document.getElementById("calendarList");
    deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));
    list.innerHTML = deliveries.map((d, index) => `
        <tr>
            <td>${d.date}</td>
            <td>${d.note}</td>
            <td>
                <button class="delete-btn" onclick="deleteDelivery(${index})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

function deleteDelivery(index) {
    deliveries.splice(index, 1);
    saveDeliveries();
    renderCalendar();
}

function saveDeliveries() {
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
}

function adjustQty(index, amount) {
    inventory[index].qty = Math.max(0, inventory[index].qty + amount);
    saveInventory();
    renderInventory();
}

function deleteItem(index) {
    inventory.splice(index, 1);
    saveInventory();
    renderInventory();
}

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function clearInventoryInputs() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemPrice").value = "";
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// ================= CHARTS =================
function loadSalesChart() {
    const ctx = document.getElementById("salesChart");
    if (salesChart) salesChart.destroy();

    salesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets: [{
                label: "Sales ($)",
                data: [120, 190, 300, 250, 220, 340, 400],
                borderColor: "#1d2671",
                backgroundColor: "rgba(29,38,113,0.2)",
                tension: 0.4,
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { display: true } } }
    });
}

function loadReportChart() {
    const ctx = document.getElementById("reportChart");
    if (reportChart) reportChart.destroy();

    reportChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Inventory", "Sales", "Customers", "Returns"],
            datasets: [{
                data: [80, 120, 60, 20],
                backgroundColor: ["#28a745","#007bff","#ffc107","#dc3545"]
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

// ================= INITIAL LOAD =================
openSection("inventory");
renderInventory();
renderCalendar();