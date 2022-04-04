const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const filters = document.querySelectorAll(".nav-item");
const addbtn = document.querySelector(".addbutton");

let taskData = [];

const getItemsFilter = async function (type) {
    let filterTask = [];

    switch (type) {
        case "todo":
            filterTask = taskData.filter((item) => item.task_status === false);
            break;
        case "done":
            filterTask = taskData.filter((item) => item.task_status);
            break;
        default:
            filterTask = taskData;
    }
    getList2(filterTask);
};

const updateItem = function (itemIndex, newValue) {
    const newItem = taskData[itemIndex];
    newItem.task_name = newValue;
    taskData.splice(itemIndex, 1, newItem);

    fetch(`http://localhost:3000/updateTask`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_name: newValue,
            task_status: newItem.task_status,
            task_id: newItem.task_id
        })
    }).then((response) => response.json().then(data => ({
            data: data,
            status: response.status
        })))
        .then((res) => {
            if (res.status == 200) {
                  iziToast.success({
                      title: 'Task',
                      message: res.data.message,
                      position: 'topRight',
                    });
                } else {
                  iziToast.error({
                      title: 'Error',
                      message: res.data.message,
                      position: 'topRight',
                    });
            }
            getList(taskData);
        })
        .catch((error) => {
            iziToast.error({
                title: 'Error',
                message: "something went wrong",
                position: 'topRight',
            });
        });
};

const removeData = function (itemData) {
    fetch('http://localhost:3000/deleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_name: itemData.task_name,
            task_status: itemData.task_status,
            task_id: itemData.task_id
        })
    }).then((response) => response.json().then(data => ({
          data: data,
          status: response.status
        })))
        .then((res) => {
              if (res.status == 200) {
                    iziToast.success({
                        title: 'Task',
                        message: res.data.message,
                        position: 'topRight',
                    });
                } else {
                    iziToast.error({
                        title: 'Error',
                        message: res.data.message,
                        position: 'topRight',
                    });
                }
            getList(taskData);
        })
        .catch((error) => {
            iziToast.error({
                title: 'Error',
                message: "something went wrong",
                position: 'topRight',
            });
        });
}

const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (item.querySelector(".title").getAttribute("data-time") == itemData.createdAt) {

            item.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const itemIndex = taskData.indexOf(itemData);
                const currentItem = taskData[itemIndex];
                const currentClass = currentItem.task_status ? "bi-check-circle-fill" : "bi-check-circle";
                currentItem.task_status = currentItem.task_status ? false : true;
                taskData.splice(itemIndex, 1, currentItem);

                fetch(`http://localhost:3000/updateTask`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        task_name: currentItem.task_name,
                        task_status: currentItem.task_status,
                        task_id: currentItem.task_id
                    })
                }).then((response) => response.json().then(data => ({
                      data: data,
                      status: response.status
                    })))
                    .then((res) => {
                        if (res.status == 200) {
                                iziToast.success({
                                    title: 'Task',
                                    message: res.data.message,
                                    position: 'topRight',
                                });
                            } else {
                                iziToast.error({
                                    title: 'Task',
                                    message: res.data.message,
                                    position: 'topRight',
                                });
                            }
                    })
                    .catch((error) => {
                        iziToast.error({
                            title: 'Error',
                            message: "something went wrong",
                            position: 'topRight',
                        });
                    });

                const iconClass = currentItem.task_status ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterType = document.querySelector("#filterType").value;
                getItemsFilter(filterType);
            });

            item.querySelector("[data-edit]").addEventListener("click", function (e) {
                e.preventDefault();
                itemInput.value = itemData.task_name;
                addbtn.innerHTML = "SAVE TASK";
                document.querySelector("#citem").value = taskData.indexOf(itemData);
                return taskData;
            });
            addbtn.innerHTML = "ADD TASK";

            item.querySelector("[data-delete]").addEventListener("click", function (e) {
                e.preventDefault();
                itemList.removeChild(item);
                removeData(itemData)

                document.querySelectorAll(".nav-link").forEach((nav) => {
                    nav.classList.remove("active");
                });
                filters[0].firstElementChild.classList.add("active");

                return taskData.filter((item) => item != itemData);
            });
        }
    });
};

const getList = async function () {

    itemList.innerHTML = "";
    await fetch('http://localhost:3000/fetchTask', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json().then(data => ({
          data: data,
          status: response.status
        })))
        .then((res) => {
            if (res.status == 200) {
                taskData = res.data.data;
                } else{
                iziToast.error({
                    title: 'Error',
                    message: res.data.message,
                    position: 'topRight',
                });
            }
        })
        .catch(() => {
            iziToast.error({
                title: 'Error',
                message: "something went wrong",
                position: 'topRight',
            });
        })

    if (taskData.length > 0) {
        taskData.forEach((item) => {
            const iconClass = item.task_status ? "bi-check-circle-fill" : "bi-check-circle";
            itemList.insertAdjacentHTML(
                "beforeend",
                `<li class="list-group-item"><input type="checkbox" value="${item.task_id}">
          <span class="title" data-time="${item.createdAt}">${item.task_name}</span> 
          <span class="icons">
              <a href="#" data-done title="click to complete"><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit title="click to Edit"><i class="fas fa-edit"></i></a>
              <a href="#" data-delete title="click to delete"><i class="fas fa-trash-alt"></i></a>
          </span>
        </li>`
            );
            handleItem(item);
        });
    } else {
        itemList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item">
        No record found.
      </li>`
        );
    }
};

// Fetch call for every 5 Seconds
// window.addEventListener('load', function () {
//     var fetchInterval = 5000;
//     setInterval(getList, fetchInterval);
// });

const getList2 = function (taskData) {
    itemList.innerHTML = "";
    if (taskData.length > 0) {
        taskData.forEach((item) => {
            const iconClass = item.task_status ? "bi-check-circle-fill" : "bi-check-circle";
            itemList.insertAdjacentHTML(
                "beforeend",
                `<li class="list-group-item"><input type="checkbox" value="${item.task_id}">
          <span class="title" data-time="${item.createdAt}">${item.task_name}</span> 
          <span class="icons">
              <a href="#" data-done title="click to complete"><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit title="click to Edit"><i class="fas fa-edit"></i></a>
              <a href="#" data-delete title="click to delete"><i class="fas fa-trash-alt"></i></a>
          </span>
        </li>`
            );
            handleItem(item);
        });
    } else {
        itemList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item">
        No record found.
      </li>`
        );
    }
};

function deleteAllTask() {
    if (taskData.length > 0) {
        if (confirm("Are sure want to delete All Task?") == true) {
            fetch('http://localhost:3000/deleteAllTask', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then((response) => response.json().then(data => ({
                  data: data,
                  status: response.status
                })))
                .then((res) => {
                    if (res.status == 200) {
                            iziToast.success({
                                title: 'All Task',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        } else {
                            iziToast.error({
                                title: 'Error',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        }
                    getList(taskData);
                })
                .catch((error) => {
                    iziToast.error({
                        title: 'Error',
                        message: "something went wrong",
                        position: 'topRight',
                    });
                });
        } else {
            return;
        }
    } else {
        iziToast.error({
            title: 'Failure',
            message: "No Task Available",
            position: 'topRight',
        });
    }
}

function deleteSelectedTask() {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value)
    });
    if (values.length > 0) {
        console.log("values", values)
        if (confirm("Are sure want to delete the Selected Task?") == true) {
            fetch('http://localhost:3000/deleteTask', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_id: values
                })
            }).then((response) => response.json().then(data => ({
                  data: data,
                  status: response.status
                })))
                .then((res) => {
                    if (res.status == 200) {
                            iziToast.success({
                                title: 'Task',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        } else {
                            iziToast.error({
                                title: 'Error',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        }
                    getList(taskData);
                })
                .catch((error) => {
                    iziToast.error({
                        title: 'Error',
                        message: "something went wrong",
                        position: 'topRight',
                    });
                });
        } else {
            return;
        }
    } else {
        iziToast.error({
            title: 'No Task',
            message: "have been selected",
            position: 'topRight',
        });
    }
}

const createTask = async function (itemData) {
    await fetch('http://localhost:3000/createTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            }).then((response) => response.json().then(data => ({
                    data: data,
                    status: response.status
                })))
                .then((res) => {
                    if (res.status == 201) {
                            iziToast.success({
                                title: 'Task',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        } else {
                            iziToast.error({
                                title: 'Task',
                                message: res.data.message,
                                position: 'topRight',
                            });
                        }
                }).catch((error) => {
                    iziToast.error({
                        title: 'Error',
                        message: "something went wrong",
                        position: 'topRight',
                    });
                });
            taskData.push(itemData);
            getList(taskData);
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
}

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskValue = itemInput.value.trim();

        if (taskValue.length === 0) {
            setError(itemInput, 'Task is required');
            setTimeout(() => {
                setError(itemInput, '')
            }, 2000)
            return;
        } else {
            const currenItemIndex = document.querySelector("#citem").value;
            if (currenItemIndex) {
                updateItem(currenItemIndex, taskValue);
                document.querySelector("#citem").value = "";
            } else {
                const taskObj = {
                    task_name: taskValue,
                };
                createTask(taskObj);
            }
            document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");
            });
            filters[0].firstElementChild.classList.add("active");
        }
        itemInput.value = "";
    });

    filters.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            document.querySelector("#filterType").value = tabType;
            getItemsFilter(tabType);
        });
    });
    getList(taskData);
});