/* =====================================
   SMART BMI
   JAVASCRIPT
===================================== */


/* =========================
   GET ELEMENTS
========================= */

const nameInput = document.getElementById("name");

const ageInput = document.getElementById("age");

const heightInput = document.getElementById("height");

const weightInput = document.getElementById("weight");

const calculateBtn = document.getElementById("calculateBtn");

const bmiValue = document.getElementById("bmiValue");

const category = document.getElementById("category");

const resultWeight = document.getElementById("resultWeight");

const resultHeight = document.getElementById("resultHeight");

const resultStatus = document.getElementById("resultStatus");

const insightTitle = document.getElementById("insightTitle");

const insightText = document.getElementById("insightText");

const errorMessage = document.getElementById("errorMessage");

const rangeMarker = document.getElementById("rangeMarker");

const weightSlider = document.getElementById("weightSlider");

const sliderWeight = document.getElementById("sliderWeight");

const projectedBMI = document.getElementById("projectedBMI");

const historyList = document.getElementById("historyList");

const clearHistory = document.getElementById("clearHistory");

const themeBtn = document.getElementById("themeBtn");


let currentHeight = 0;

let currentWeight = 65;

let bmiChart;


/* =========================
   BMI CATEGORY
========================= */

function getCategory(bmi) {

    if (bmi < 18.5) {

        return {
            name: "UNDERWEIGHT",
            color: "#00c2ff",
            message:
                "Your BMI is below the standard adult healthy range."
        };

    }


    if (bmi < 25) {

        return {
            name: "HEALTHY RANGE",
            color: "#22c55e",
            message:
                "Your BMI is within the standard adult healthy range."
        };

    }


    if (bmi < 30) {

        return {
            name: "OVERWEIGHT",
            color: "#facc15",
            message:
                "Your BMI is above the standard adult healthy range."
        };

    }


    return {
        name: "OBESITY RANGE",
        color: "#fb923c",
        message:
            "Your BMI is in the standard adult obesity range."
    };

}


/* =========================
   CALCULATE BMI
========================= */

function calculateBMI() {

    errorMessage.textContent = "";


    const name = nameInput.value.trim();

    const age = Number(ageInput.value);

    const height = Number(heightInput.value);

    const weight = Number(weightInput.value);


    /* Validation */

    if (!name) {

        errorMessage.textContent =
            "Please enter your name.";

        return;

    }


    if (!age || age < 1 || age > 120) {

        errorMessage.textContent =
            "Please enter a valid age.";

        return;

    }


    if (!height || height < 50 || height > 250) {

        errorMessage.textContent =
            "Please enter a valid height.";

        return;

    }


    if (!weight || weight < 10 || weight > 300) {

        errorMessage.textContent =
            "Please enter a valid weight.";

        return;

    }


    /* Convert cm to meters */

    const heightInMeters = height / 100;


    /* BMI Formula */

    const bmi =
        weight /
        (heightInMeters * heightInMeters);


    const roundedBMI = bmi.toFixed(1);


    /* Category */

    const result = getCategory(bmi);


    /* Save current values */

    currentHeight = height;

    currentWeight = weight;


    /* Update UI */

    bmiValue.textContent = roundedBMI;

    category.textContent = result.name;

    category.style.color = result.color;

    category.style.background =
        `${result.color}18`;


    resultWeight.textContent =
        `${weight} kg`;

    resultHeight.textContent =
        `${height} cm`;

    resultStatus.textContent =
        result.name;


    resultStatus.style.color =
        result.color;


    /* Insight */

    insightTitle.textContent =
        `${name}, here's your BMI insight`;


    insightText.textContent =
        `${result.message} BMI is a screening measure and does not account for factors such as muscle mass or body-fat distribution.`;


    /* BMI meter */

    updateBMIMeter(bmi, result.color);


    /* Simulator */

    weightSlider.value = weight;

    sliderWeight.textContent = weight;

    updateSimulator();


    /* Save history */

    saveHistory(
        weight,
        height,
        Number(roundedBMI)
    );


    /* Update chart */

    renderHistory();


    /* Smooth scroll */

    document
        .querySelector(".result-card")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


/* =========================
   BMI METER
========================= */

function updateBMIMeter(bmi, color) {

    let percentage;


    if (bmi < 15) {

        percentage = 5;

    } else if (bmi > 40) {

        percentage = 95;

    } else {

        percentage =
            ((bmi - 15) / 25) * 100;

    }


    percentage =
        Math.max(
            5,
            Math.min(95, percentage)
        );


    rangeMarker.style.left =
        `${percentage}%`;


    rangeMarker.style.borderColor =
        color;


    rangeMarker.style.boxShadow =
        `0 0 15px ${color}`;


    /* Circle */

    const angle =
        Math.max(
            20,
            Math.min(340, percentage * 3.4)
        );


    document.querySelector(
        ".bmi-circle"
    ).style.background =
        `conic-gradient(
            ${color} 0deg,
            ${color} ${angle}deg,
            rgba(255,255,255,0.05) ${angle}deg
        )`;

}


/* =========================
   WEIGHT SIMULATOR
========================= */

weightSlider.addEventListener(
    "input",
    updateSimulator
);


function updateSimulator() {

    const simulatedWeight =
        Number(weightSlider.value);


    sliderWeight.textContent =
        simulatedWeight;


    if (!currentHeight) {

        projectedBMI.textContent =
            "--";

        return;

    }


    const heightInMeters =
        currentHeight / 100;


    const simulatedBMI =
        simulatedWeight /
        (heightInMeters * heightInMeters);


    projectedBMI.textContent =
        simulatedBMI.toFixed(1);

}


/* =========================
   HISTORY
========================= */

function getHistory() {

    const history =
        localStorage.getItem(
            "smartBMIHistory"
        );


    return history
        ? JSON.parse(history)
        : [];

}


function saveHistory(
    weight,
    height,
    bmi
) {

    const history =
        getHistory();


    const record = {

        date:
            new Date().toLocaleDateString(),

        time:
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        weight,

        height,

        bmi

    };


    history.unshift(record);


    /* Keep only last 10 */

    const limitedHistory =
        history.slice(0, 10);


    localStorage.setItem(
        "smartBMIHistory",
        JSON.stringify(
            limitedHistory
        )
    );

}


/* =========================
   RENDER HISTORY
========================= */

function renderHistory() {

    const history =
        getHistory();


    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                📊

                <p>
                    Your BMI history will appear here.
                </p>

            </div>

        `;

        createChart([]);

        return;

    }


    historyList.innerHTML =
        history.map(item => {

            const result =
                getCategory(item.bmi);


            return `

                <div class="history-item">

                    <div>

                        <div class="history-date">

                            ${item.date}
                            •
                            ${item.time}

                        </div>

                        <div class="history-weight">

                            ${item.weight} kg

                        </div>

                    </div>


                    <div
                        class="history-bmi"
                        style="color:${result.color}"
                    >

                        ${item.bmi}

                    </div>

                </div>

            `;

        }).join("");


    createChart(history);

}


/* =========================
   CHART
========================= */

function createChart(history) {

    const canvas =
        document.getElementById(
            "bmiChart"
        );


    if (bmiChart) {

        bmiChart.destroy();

    }


    const reversed =
        [...history].reverse();


    bmiChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    reversed.map(
                        item =>
                            item.date
                    ),

                datasets: [

                    {

                        label: "BMI",

                        data:
                            reversed.map(
                                item =>
                                    item.bmi
                            ),

                        borderColor:
                            "#00c2ff",

                        backgroundColor:
                            "rgba(0,194,255,0.12)",

                        pointBackgroundColor:
                            "#7c3aed",

                        pointBorderColor:
                            "#ffffff",

                        pointRadius: 5,

                        borderWidth: 3,

                        tension: 0.4,

                        fill: true

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        grid: {

                            color:
                                "rgba(148,163,184,0.08)"

                        },

                        ticks: {

                            color:
                                "#94a3b8"

                        }

                    },

                    x: {

                        grid: {

                            display: false

                        },

                        ticks: {

                            color:
                                "#94a3b8"

                        }

                    }

                }

            }

        });

}


/* =========================
   CLEAR HISTORY
========================= */

clearHistory.addEventListener(
    "click",
    () => {

        const confirmDelete =
            confirm(
                "Clear all BMI history?"
            );


        if (!confirmDelete) return;


        localStorage.removeItem(
            "smartBMIHistory"
        );


        renderHistory();

    }
);


/* =========================
   DARK / LIGHT MODE
========================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        themeBtn.textContent =
            isLight ? "☀️" : "🌙";


        localStorage.setItem(
            "smartBMITheme",
            isLight
                ? "light"
                : "dark"
        );

    }
);


/* =========================
   LOAD THEME
========================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            "smartBMITheme"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        themeBtn.textContent = "☀️";

    }

}


/* =========================
   BUTTON EVENT
========================= */

calculateBtn.addEventListener(
    "click",
    calculateBMI
);


/* =========================
   ENTER KEY
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            calculateBMI();

        }

    }
);


/* =========================
   INITIALIZE
========================= */

loadTheme();

renderHistory();
