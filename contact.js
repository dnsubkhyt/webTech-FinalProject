const html = document.documentElement;
const darkModeCheckbox = document.getElementById("checkbox");

// Initialize theme based on saved preference
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme') || "light";
    applyTheme(savedTheme); // Apply saved theme on load

    // Set checkbox state based on saved theme
    darkModeCheckbox.checked = savedTheme === "dark";

    // Add event listener for theme toggle switch
    darkModeCheckbox.addEventListener("change", () => {
        const newTheme = darkModeCheckbox.checked ? "dark" : "light";
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save theme preference
    });
});

// Apply theme globally
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        html.setAttribute("data-theme", "dark");
    } else {
        document.body.classList.remove("dark-theme");
        html.setAttribute("data-theme", "light");
    }
}

// Handle contact form submission
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
        alert("Thank you for your feedback, " + name + "!");
        document.getElementById("contactForm").reset(); // Reset form after submission
    } else {
        alert("Please fill out all fields.");
    }
});
