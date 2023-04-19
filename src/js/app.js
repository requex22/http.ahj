const addTicketBtn = document.querySelector(".header-button");
const editForm = document.querySelector('form[name="edit"]');
const saveBtn = document.getElementById("save_button");
const cancelBtn = document.getElementById("cancel_button");
const xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:8080/?method=allTickets");
xhr.send();

function init() {
  editFormFunc();

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        const ticketContainer = document.querySelector(".tickets-list");
        ticketContainer.innerHTML = "";

        Array.from(data).forEach((item) => {
          ticketContainer.insertAdjacentHTML("beforeend", `${draw(item)}`);
        });

        const tickets = Array.from(
          ticketContainer.querySelectorAll(".ticket-card")
        );

        tickets.forEach((item) => {
          item.addEventListener("click", (e) => {
            if (e.target.classList.contains("ticket-content")) {
              item
                .querySelector(".ticket-hidden")
                .classList.toggle("ticket-visible");
            }
          });

          item.querySelector(".delete-button").addEventListener("click", () => {
            xhr.open(
              "POST",
              `http://localhost:8080/?method=deleteTicket&id=${item.dataset.id}`
            );
            xhr.send();

            xhr.open("GET", "http://localhost:8080/?method=allTickets");
            xhr.send();

            ticketContainer.innerHTML = "";

            Array.from(data).forEach((item) => {
              ticketContainer.insertAdjacentHTML("beforeend", `${draw(item)}`);
            });
          });

          item.querySelector(".edit-button").addEventListener("click", () => {
            editForm.style.display = "block";

            const nameInpt = editForm.querySelector("#input_name");
            const descInpt = editForm.querySelector("#input_description");
            const submitBtn = editForm.querySelector(".submit-button");
            const cancelBtn = editForm.querySelector(".cancel-button");

            console.log(item);

            nameInpt.value = item.querySelector(".ticket-name").textContent;
            descInpt.value = item.querySelector(
              ".ticket-description"
            ).textContent;

            const form = new FormData();

            submitBtn.addEventListener("click", () => {
              form.append("name", nameInpt.value);
              form.append("description", descInpt.value);

              xhr.open(
                "POST",
                `http://localhost:8080/?method=editTicket&id=${item.dataset.id}`
              );
              xhr.send(form);

              editForm.style.display = "none";
              location.reload();
            });

            cancelBtn.addEventListener("click", () => {
              editForm.style.display = "none";
            });
          });

          item.querySelector(".ticket-status").addEventListener("click", () => {
            xhr.open(
              "POST",
              `http://localhost:8080/?method=ticketDone&id=${item.dataset.id}`
            );
            xhr.send();

            item.querySelector(".ticket-status").classList.toggle("true");
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
}

init();
function draw(item) {
  return `
    <div class="ticket-card" data-id="${item.id}">
        <div class="ticket-main">
            <div class='ticket-status ${item.status}'></div>
            <div class='ticket-content'>
                <div class='ticket-name'>${item.name}</div>
            </div>
            <div class='ticket-data'>${item.created}</div>
            <div class='ticket-actions'>
                <span class='edit-button'>
                    <span class="visually-hidden">Edit</span>
                </span>
                <span class='delete-button'>
                    <span class="visually-hidden">Delete</span>
                </span>
            </div>
        </div>
        <div class="ticket-hidden">
            <span class="ticket-description">${item.description}</span>
        </div>
    </div>
    `;
}

function editFormFunc() {
  addTicketBtn.addEventListener("click", () => {
    editForm.style.display = "block";

    const nameInpt = editForm.querySelector("#input_name");
    const descInpt = editForm.querySelector("#input_description");
    const submitBtn = editForm.querySelector(".submit-button");
    const cancelBtn = editForm.querySelector(".cancel-button");

    const form = new FormData();

    submitBtn.addEventListener("click", (event) => {
      event.preventDefault();

      form.append("name", nameInpt.value);
      form.append("description", descInpt.value);

      xhr.open("POST", "http://localhost:8080/?method=createTicket");
      xhr.send(form);

      editForm.style.display = "none";
      location.reload();
    });

    cancelBtn.addEventListener("click", () => {
      nameInpt.value = "";
      descInpt.value = "";

      editForm.style.display = "none";
    });
  });
}
