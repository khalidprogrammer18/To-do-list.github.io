// change page mode
// #region
const mode = document.querySelector("#mode");

if (!localStorage.getItem("mode")) {
    localStorage.setItem("mode", "light")
}
function applyMode() {
    if (localStorage.getItem("mode") === "dark") {
        mode.checked = true;
        document.body.className = "dark";
    } else {
        mode.checked = false;
        document.body.className = ""
    }
}
applyMode()
mode.onchange = function () {
    if (mode.checked) {
        localStorage.setItem("mode", "dark")
    } else {
        localStorage.setItem("mode", "light")
    }
    applyMode()
}
// #endregion

// add missions
// #region
let submit = document.querySelector("#submit");
let note = document.querySelector("#note");
function message(text, color) {
    if (note.innerHTML === "") {
        note.append(document.createTextNode(text));
    }
    note.style.cssText = `transform: translate(-50%, 0px); color: ${color}`;
    setTimeout(function () {
        note.style.cssText = "transform: translate(-50%, -65px);"
        note.innerHTML = "";
    }, 3000);
}

let currently = function () {
    let now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : `0${now.getMonth() + 1}`}-${now.getDate() > 9 ? now.getDate() : `0${now.getDate()}`}`;
};
let recently = function () {
    let now = new Date();
    return `${now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`}:${now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`}`;
}
let red = "rgb(255, 38, 9)";
let green = "rgb(13, 197, 0)";
let blue = "rgb(88, 191, 255)";

submit.onclick = function (e) {
    e.preventDefault()
    let title = document.querySelector("#heading").value;
    let textarea = document.querySelector("#desc").value;
    let date = document.querySelector("#date").value;
    let time = document.querySelector("#time").value;
    let important = document.querySelector("#important").checked;
    
    new Promise((res, rej) => {
        if (missions.some(e => e[0] === title)) {
            message("لا يمكنك اختيار عنوان موجود بالفعل", red);
            document.querySelector("#heading").focus();
            document.querySelector("#heading").style.borderColor = red;
            setInterval(() => {
                document.querySelector("#heading").style.borderColor = blue;
            }, 3000);
        } else if (title.length >= 4) {
            res([title, textarea]);
        } else {
            if (title === "") {
                message("عنوان المهمة مطلوبة", red)
            } else {
                message("أقل حد للعنوان هو 4 حروف", red)
            }
            document.querySelector("#heading").focus()
            document.querySelector("#heading").style.borderColor = red;
            setInterval(() => {
                document.querySelector("#heading").style.borderColor = blue;
            }, 3000);
        };
    }).then((val) => {
        if (date === currently()) {
            return [...val, date];
        } else if (date < currently() && date !== "") {
            document.querySelector("#date").value = "";
            document.querySelector("#date").focus();
            document.querySelector("#date").style.borderColor = red;
            setInterval(() => {
                document.querySelector("#date").style.borderColor = blue;
            }, 3000);
            message("التاريخ خاطئ", red);
        } else {
            return [...val, date];
        };
    }).then((val) => {
        if ((date === currently()) && ((time < recently() || time === recently()) && time !== "")) {
            document.querySelector("#time").value = "";
            document.querySelector("#time").focus();
            document.querySelector("#time").style.borderColor = red;
            setInterval(() => {
                document.querySelector("#time").style.borderColor = blue;
            }, 3000);
            message("الوقت خاطئ", red);
            throw "time erro";
        } else {
            return [...val, time, important];
        };
    }).then((val) => {
        missions.push(val);
        message("تم إضافة هذه المهمة إلى قائمة المهام", green);
        tasksList.innerHTML = "";
        for (let i = 0; i < missions.length; i++) {
            addTask(missions[i])
        }
        localStorage.setItem("missions", JSON.stringify(missions));
    });
};

let tasksList = document.querySelector("#area");
function* theColors() {
    yield "#FF0000"; // أحمر
    yield "#00FF00"; // أخضر
    yield "#0000FF"; // أزرق
    yield "#FFFF00"; // أصفر
    yield "#FF00FF"; // فوشيا / وردي
    yield "#00FFFF"; // سماوي
    yield "#FFA500"; // برتقالي
    yield "#800080"; // بنفسجي غامق
    yield "#008000"; // أخضر غامق
    yield "#000080"; // أزرق غامق
    yield "#FFC0CB"; // وردي
    yield "#FFD700"; // ذهبي
    yield "#00FF7F"; // أخضر نيون
    yield "#FF4500"; // برتقالي داكن / أحمر برتقالي
    yield "#1E90FF"; // أزرق سماوي غامق
    yield "#FF1493"; // وردي فاقع
    yield "#ADFF2F"; // أخضر فاقع
    yield "#FF6347"; // طماطم
    yield "#40E0D0"; // تركواز
    yield "#DA70D6"; // أرجواني فاتح
}
borderColors = theColors();

function addTask([heading, description, date, time, importance]) {
    let div = document.createElement("div");
    div.className = "task";
    div.style.borderBottomColor = borderColors.next().value || red;
    let tHead = document.createElement("div");
    tHead.className = "task-head";
    let tBody = document.createElement("div");
    tBody.className = "task-body";
    let helperDiv = document.createElement("div");

    if (importance) {
        tHead.innerHTML += '<i class="fa-solid fa-exclamation important" title="مهم"></i>';
    }

    let taskHeading = document.createElement("h3");
    taskHeading.textContent = heading;

    let dateTime = document.createElement("p");
    dateTime.textContent = `(${time || "وقت غير محدد"} | ${date || "تاريخ غير محدد"})`;

    let del = document.createElement("i");
    del.className = "fa-regular fa-trash-can del";

    let arrow = document.createElement("i");
    arrow.className = "fa-solid fa-arrow-down arrow";

    let nowP = document.createElement("span");
    nowP.textContent = `تاريخ ووقت وضع المهمة (${currently()} | ${recently()})`;

    helperDiv.append(taskHeading, dateTime)

    tHead.append(helperDiv, del, arrow);
    tBody.append(description || "لا يوجد وصف", nowP);

    div.append(tHead, tBody);
    tasksList.append(div);
};

let missions = JSON.parse(localStorage.getItem("missions")) || [];
if (missions.length > 0) {
    missions.forEach(mission => {
        addTask(mission)
    });
} 

document.addEventListener("click", e => {
    const arrow = e.target.closest(".arrow");
    if (arrow) {
        e.stopPropagation();

        const task = arrow.closest(".task");

        document.querySelectorAll(".task").forEach(t => {
            if (t !== task) t.style.height = null;
        });
        
        const arr = task.querySelector(".arrow");

        if (task.style.height) {
            task.style.height = null;
            arr.className = "fa-solid fa-arrow-down arrow";
        } else {
            task.style.height = task.scrollHeight + "px";
            arr.className = "fa-solid fa-up-long arrow up";
        }

        return;
    }

    document.querySelectorAll(".task").forEach(t => {
        t.style.height = null;
        t.querySelector(".arrow").className = "fa-solid fa-arrow-down arrow";
    }
    );

    const remove = e.target.closest(".del");
    if (remove) {
        e.stopPropagation();

        const deletedTask = remove.closest(".task");

        const heading = deletedTask.querySelector("h3").textContent;

        const index = missions.findIndex(m => m[0] === heading); 

        if (index > -1) {
            missions.splice(index, 1);
            localStorage.setItem("missions", JSON.stringify(missions));
        }
        
        deletedTask.remove();
        message("تم حذف المهمة بنجاح", green)
    }

});

let btn = document.querySelector("button");

btn.onclick = function () {
    if (localStorage.getItem("missions")) {
        localStorage.removeItem("missions")
        tasksList.innerHTML = "";
        message("تم حذف كل المهام بنجاح", green)
        missions = [];
    } else {
        message("لا توجد مهام في القائمة ليتم حذفها!", red)
    }

}

// #endregion
