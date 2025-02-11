document.addEventListener("DOMContentLoaded", function () {
       const dateElement = document.getElementById("date");
    if (dateElement) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        dateElement.textContent = formattedDate;
    }

    // Add a new task using JavaScript
    const form = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const dueDateInput = document.getElementById("due-date-input");
    const descriptionInput = document.getElementById("description-input");
    const todoList = document.getElementById("todo-list");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const task = taskInput.value.trim();
            const dueDate = dueDateInput.value;
            const description = descriptionInput.value.trim();

            if (task) {
                fetch("/add", {
                    method: "POST",
                    body: new URLSearchParams({
                        task: task,
                        due_date: dueDate,
                        description: description,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            alert("Error adding task: " + data.error);
                            return;
                        }
                        const col = document.createElement("div");
                        col.classList.add("col-md-4", "mb-4");
                        col.innerHTML = `
                            <div class="card shadow-sm border-primary">
                                <div class="card-body">
                                    <h5 class="card-title">${data.task}</h5>
                                    <h6 class="card-subtitle text-muted">${data.due_date ? "Due: " + data.due_date : ""}</h6>
                                    ${data.description ? `<p class="card-text mt-2"><strong>Description:</strong> ${data.description}</p>` : ""}
                                    <div class="d-flex justify-content-between align-items-center">
                                        <label for="completed-${data.id}" class="form-check-label">
                                            <input type="checkbox" id="completed-${data.id}" ${data.completed ? "checked" : ""}> Completed
                                        </label>
                                        <button class="btn btn-danger btn-sm remove-btn" data-task-id="${data.id}">
                                            <i class="bi bi-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                        todoList.appendChild(col);
                        taskInput.value = "";
                        dueDateInput.value = "";
                        descriptionInput.value = "";
                    })
                    .catch((error) => console.error("Error adding task:", error));
            }
        });
    }

    // Handle remove and complete actions
    if (todoList) {
        todoList.addEventListener("click", function (e) {
            if (e.target.classList.contains("remove-btn")) {
                const taskId = e.target.getAttribute("data-task-id");
                fetch(`/remove/${taskId}`, {
                    method: "DELETE",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message === "Task removed successfully") {
                            e.target.closest(".col-md-4").remove();
                        } else {
                            alert("Error: Task not found");
                        }
                    });
            }

            if (e.target.type === "checkbox") {
                const taskId = e.target.id.split("-")[1];
                const completed = e.target.checked;
                fetch(`/update/${taskId}`, {
                    method: "POST",
                    body: new URLSearchParams({
                        completed: completed,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
            }
        });
    }

    // Weather container setup
    const weatherContainer = document.createElement("div");
    weatherContainer.id = "weather-container";
    weatherContainer.style.position = "absolute";
    weatherContainer.style.top = "10px";
    weatherContainer.style.right = "10px";
    weatherContainer.style.background = "rgba(0, 121, 107, 0.9)";
    weatherContainer.style.color = "white";
    weatherContainer.style.padding = "10px";
    weatherContainer.style.borderRadius = "8px";
    weatherContainer.style.fontSize = "1rem";

    // Create input field
    const input = document.createElement("input");
    input.type = "text";
    input.id = "city-input";
    input.placeholder = "Enter city";
    input.style.marginRight = "5px";
    input.style.padding = "5px";

    // Create button
    const button = document.createElement("button");
    button.textContent = "Get Weather";
    button.style.padding = "5px";
    button.style.cursor = "pointer";

    // Weather display
    const weatherDisplay = document.createElement("div");
    weatherDisplay.id = "weather";
    weatherDisplay.textContent = "Loading...";
    weatherDisplay.style.marginTop = "5px";

    // Append elements
    weatherContainer.appendChild(input);
    weatherContainer.appendChild(button);
    weatherContainer.appendChild(weatherDisplay);
    document.body.appendChild(weatherContainer);

    function fetchWeather(city = "Johannesburg") {
        fetch(`/weather?city=${city}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    weatherDisplay.textContent = "Weather unavailable";
                } else {
                    weatherDisplay.innerHTML = `🌡 ${data.temperature}°C | ${data.description}`;
                }
            })
            .catch((error) => {
                weatherDisplay.textContent = "Error fetching weather";
                console.error("Weather Fetch Error:", error);
            });
    }

    fetchWeather();

    button.addEventListener("click", function () {
        const city = input.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
});
