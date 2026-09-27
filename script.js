/* =========================================
   CARESYNC HMS
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const PATIENTS_KEY = "caresyncPatients";
const CURRENT_USER_KEY = "caresyncCurrentUser";
const STUDENT_RECORDS_KEY = "ehrStudentRecords";
const SCENARIOS_KEY = "ehrTeamScenarios";


/* =========================================
   ADMIN ACCOUNT
========================================= */

const ADMIN_EMAIL = "admin@ehr.com";
const ADMIN_PASSWORD = "Admin@0110";

const STUDENT_ACCOUNTS = [
    { email: "Team1@ehr.com", password: "team1118", name: "TEAM ONE" },
    { email: "Team2@ehr.com", password: "team2227", name: "TEAM TWO" },
    { email: "Team3@ehr.com", password: "team3336", name: "TEAM THREE" },
    { email: "Team4@ehr.com", password: "team4445", name: "TEAM FOUR" },
    { email: "Team5@ehr.com", password: "team5554", name: "TEAM FIVE" },
    { email: "Team6@ehr.com", password: "team6663", name: "TEAM SIX" },
    { email: "Team7@ehr.com", password: "team7772", name: "TEAM SEVEN" },
    { email: "Team8@ehr.com", password: "team8881", name: "TEAM EIGHT" }
];


/* =========================================
   HELPER FUNCTIONS
========================================= */

function getPatients() {

    return JSON.parse(
        localStorage.getItem(PATIENTS_KEY)
    ) || [];

}


function savePatients(patients) {

    localStorage.setItem(
        PATIENTS_KEY,
        JSON.stringify(patients)
    );

}


function getAppointments() {

    return JSON.parse(
        localStorage.getItem(APPOINTMENTS_KEY)
    ) || [];

}


function saveAppointments(appointments) {

    localStorage.setItem(
        APPOINTMENTS_KEY,
        JSON.stringify(appointments)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

}


function setCurrentUser(user) {

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

}


function logout() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    window.location.href = "index.html";

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================
   PAGE CHECK
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -------------------------------------
           GET CURRENT USER
        ------------------------------------- */

        const currentUser =
            getCurrentUser();


        /* -------------------------------------
           INDEX PAGE
        ------------------------------------- */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            initializeLoginPage();

        }


        /* -------------------------------------
           PATIENT PAGE
        ------------------------------------- */

        if (
            window.location.pathname.endsWith(
                "team.html"
            )
        ) {

            protectPatientPage();
            initializeDashboard();

        }


        /* -------------------------------------
           ADMIN PAGE
        ------------------------------------- */

        if (
            window.location.pathname.endsWith(
                "admin.html"
            )
        ) {

            protectAdminPage();

            initializeAdmin();

        }


        /* -------------------------------------
           CONTACT
        ------------------------------------- */

        const contactForm =
            document.getElementById(
                "contactForm"
            );


        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    showToast(
                        "Thank you! Your message has been sent."
                    );

                    contactForm.reset();

                }
            );

        }


        /* -------------------------------------
           PATIENT LOGOUT
        ------------------------------------- */

        const logoutPatient =
            document.getElementById(
                "logoutPatient"
            );


        if (logoutPatient) {

            logoutPatient.addEventListener(
                "click",
                logout
            );

        }


        /* -------------------------------------
           ADMIN LOGOUT
        ------------------------------------- */

        const adminLogout =
            document.getElementById(
                "adminLogout"
            );


        if (adminLogout) {

            adminLogout.addEventListener(
                "click",
                logout
            );

        }

    }
);


/* =========================================
   LOGIN PAGE
========================================= */

function initializeLoginPage() {

    const roleCards =
        document.querySelectorAll(
            ".role-card"
        );

    const selectedRole =
        document.getElementById(
            "selectedRole"
        );

    const adminHint =
        document.getElementById(
            "adminHint"
        );

    const showRegister =
        document.getElementById(
            "showRegister"
        );

    const registerModal =
        document.getElementById(
            "registerModal"
        );

    const closeRegister =
        document.getElementById(
            "closeRegister"
        );


    /* -------------------------------------
       ROLE SELECTION
    ------------------------------------- */

    roleCards.forEach(
        card => {

            card.addEventListener(
                "click",
                function () {

                    roleCards.forEach(
                        item => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    card.classList.add(
                        "active"
                    );

                    const role =
                        card.dataset.role;

                    selectedRole.value =
                        role;


                    if (role === "admin") {

                        adminHint.style.display =
                            "block";

                        if (showRegister) {
                            showRegister.style.display =
                                "none";
                        }

                    } else {

                        adminHint.style.display =
                            "none";

                        if (showRegister) {
                            showRegister.style.display =
                                "none";
                        }

                    }

                }
            );

        }
    );


    /* -------------------------------------
       LOGIN
    ------------------------------------- */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const role =
                selectedRole.value;


            /* --------------------------------
               ADMIN LOGIN
            -------------------------------- */

            if (role === "admin") {

                if (
                    email === ADMIN_EMAIL &&
                    password === ADMIN_PASSWORD
                ) {

                    setCurrentUser({

                        role: "admin",

                        email: ADMIN_EMAIL,

                        name: "Administrator"

                    });


                    showToast(
                        "Admin login successful!"
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "admin.html";

                        },
                        700
                    );

                } else {

                    showToast(
                        "Incorrect admin email or password."
                    );

                }

                return;

            }


            /* --------------------------------
               STUDENT LOGIN
            -------------------------------- */

            const student =
                STUDENT_ACCOUNTS.find(
                    account =>
                        account.email.toLowerCase() ===
                            email.toLowerCase() &&
                        account.password === password
                );


            if (!student) {

                showToast(
                    "Incorrect email or password."
                );

                return;

            }


            setCurrentUser({

                role: "student",

                id: student.email,

                name: student.name,

                email: student.email

            });


            showToast(
                "Login successful! Welcome!"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "team.html";

                },
                700
            );

        }
    );


    /* -------------------------------------
       OPEN REGISTER MODAL
    ------------------------------------- */

    if (showRegister) {

        showRegister.addEventListener(
            "click",
            function () {

                registerModal.classList.add(
                    "show"
                );

            }
        );

    }


    /* -------------------------------------
       CLOSE REGISTER
    ------------------------------------- */

    if (closeRegister) {

        closeRegister.addEventListener(
            "click",
            function () {

                registerModal.classList.remove(
                    "show"
                );

            }
        );

    }


    /* -------------------------------------
       CLOSE WHEN CLICKING OUTSIDE
    ------------------------------------- */

    if (registerModal) {

        registerModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    registerModal
                ) {

                    registerModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* -------------------------------------
       REGISTER
    ------------------------------------- */

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "regName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "regEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "regPassword"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "regConfirm"
                    ).value;


                if (
                    password !==
                    confirmPassword
                ) {

                    showToast(
                        "Passwords do not match."
                    );

                    return;

                }


                if (password.length < 6) {

                    showToast(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                if (
                    email.toLowerCase() ===
                    ADMIN_EMAIL.toLowerCase()
                ) {

                    showToast(
                        "This email is reserved for admin."
                    );

                    return;

                }


                const patients =
                    getPatients();


                const exists =
                    patients.some(
                        p =>
                            p.email.toLowerCase() ===
                            email.toLowerCase()
                    );


                if (exists) {

                    showToast(
                        "An account with this email already exists."
                    );

                    return;

                }


                const newPatient = {

                    id:
                        Date.now(),

                    name:
                        name,

                    email:
                        email,

                    password:
                        password,

                    createdAt:
                        new Date().toISOString()

                };


                patients.push(
                    newPatient
                );


                savePatients(
                    patients
                );


                registerForm.reset();

                registerModal.classList.remove(
                    "show"
                );


                document.getElementById(
                    "loginEmail"
                ).value = email;


                showToast(
                    "Registration successful! Please login."
                );

            }
        );

    }

}


/* =========================================
   PATIENT PAGE PROTECTION
========================================= */

function protectPatientPage() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "student"
    ) {

        window.location.href =
            "index.html";

        return;

    }


    const patientName =
        document.getElementById(
            "patientName"
        );


    if (patientName) {

        patientName.textContent =
            user.name || "Student";

    }

    const dashboardName =
        document.getElementById(
            "dashboardName"
        );

    if (dashboardName) {
        dashboardName.textContent =
            user.name || "Student";
    }

}


/* =========================================
   STUDENT DASHBOARD
========================================= */

function initializeDashboard() {

    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );

    const toggle =
        document.getElementById(
            "sidebarToggle"
        );

    const title =
        document.getElementById(
            "dashboardTitle"
        );

    const menuItems =
        document.querySelectorAll(
            ".dashboard-menu-item"
        );

    renderTeamScenarios();

    const viewNames = {
        dashboardView: "Dashboard",
        demographicsView: "Patient Demographics",
        historyView: "Medical History",
        documentationView: "Documentation"
    };

    function showView(viewId) {

        document.querySelectorAll(
            ".dashboard-view"
        ).forEach(view => {
            view.classList.toggle(
                "active",
                view.id === viewId
            );
        });

        menuItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.view === viewId
            );
        });

        if (title) {
            title.textContent =
                viewNames[viewId] || "Dashboard";
        }

        if (sidebar && toggle) {
            sidebar.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }

    }

    menuItems.forEach(item => {
        item.addEventListener(
            "click",
            () => showView(item.dataset.view)
        );
    });

    document.querySelectorAll(
        "[data-view-target]"
    ).forEach(card => {
        card.addEventListener(
            "click",
            () => showView(card.dataset.viewTarget)
        );
    });

    if (toggle && sidebar) {
        toggle.addEventListener(
            "click",
            function () {
                const isMobile =
                    window.matchMedia("(max-width: 800px)").matches;

                const isOpen = isMobile
                    ? sidebar.classList.toggle("open")
                    : !sidebar.classList.toggle("collapsed");

                const dashboardPage =
                    document.querySelector(".dashboard-page");

                const dashboardMain =
                    document.querySelector(".dashboard-main");

                if (!isMobile && dashboardPage && dashboardMain) {
                    const collapsed =
                        sidebar.classList.contains("collapsed");

                    dashboardPage.classList.toggle(
                        "sidebar-collapsed",
                        collapsed
                    );

                    dashboardMain.classList.toggle(
                        "sidebar-collapsed",
                        collapsed
                    );
                }

                toggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );
    }

    document.querySelectorAll(
        "[data-save-message]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            function () {
                const form =
                    button.closest("form");

                const currentUser =
                    getCurrentUser();

                if (!form || !currentUser) return;

                const records =
                    getStudentRecords();

                const values = {};

                form.querySelectorAll(
                    "input, textarea, select"
                ).forEach(field => {
                    const label =
                        field.parentElement
                            .childNodes[0]
                            .textContent
                            .trim();

                    values[label] = field.value;
                });

                if (!records[currentUser.email]) {
                    records[currentUser.email] = {};
                }

                records[currentUser.email][
                    form.dataset.record
                ] = values;

                saveStudentRecords(records);
                showToast(button.dataset.saveMessage);
            }
        );
    });

}


/* =========================================
   APPOINTMENT PAGE PROTECTION
========================================= */

function protectAppointmentPage() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "student"
    ) {

        window.location.href =
            "index.html";

        return;

    }


    const fullName =
        document.getElementById(
            "fullName"
        );


    const email =
        document.getElementById(
            "email"
        );


    if (fullName) {

        fullName.value =
            user.name || "";

    }


    if (email) {

        email.value =
            user.email || "";

    }

}


/* =========================================
   APPOINTMENT FORM
========================================= */

function setupAppointmentForm() {

    const form =
        document.getElementById(
            "appointmentForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const currentUser =
                getCurrentUser();


            if (
                !currentUser ||
                currentUser.role !== "student"
            ) {

                showToast(
                    "Please login as a student first."
                );

                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    800
                );

                return;

            }


            const appointment = {

                id:
                    Date.now(),

                patientId:
                    currentUser.id,

                fullName:
                    document.getElementById(
                        "fullName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                dob:
                    document.getElementById(
                        "dob"
                    ).value,

                appointmentDate:
                    document.getElementById(
                        "appointmentDate"
                    ).value,

                appointmentTime:
                    document.getElementById(
                        "appointmentTime"
                    ).value,

                department:
                    document.getElementById(
                        "department"
                    ).value,

                appointmentType:
                    document.getElementById(
                        "appointmentType"
                    ).value,

                reason:
                    document.getElementById(
                        "reason"
                    ).value.trim(),

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString()

            };


            const appointments =
                getAppointments();


            appointments.push(
                appointment
            );


            saveAppointments(
                appointments
            );


            showToast(
                "Appointment submitted successfully!"
            );


            form.reset();


            /* Put patient information back */
            document.getElementById(
                "fullName"
            ).value =
                currentUser.name || "";


            document.getElementById(
                "email"
            ).value =
                currentUser.email || "";


            setTimeout(
                () => {

                    window.location.href =
                        "team.html";

                },
                1200
            );

        }
    );

}


/* =========================================
   ADMIN PROTECTION
========================================= */

function protectAdminPage() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        window.location.href =
            "index.html";

        return false;

    }


    return true;

}


/* =========================================
   ADMIN INITIALIZATION
========================================= */

function initializeAdmin() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        return;

    }


    renderTeamRecords();
    renderPreviousScenarios();

    const teamSelect =
        document.getElementById("scenarioTeam");

    const scenarioForm =
        document.getElementById("scenarioForm");

    const scenarioText =
        document.getElementById("scenarioText");

    const editingId =
        document.getElementById("editingScenarioId");

    const submitButton =
        document.getElementById("scenarioSubmit");

    const cancelButton =
        document.getElementById("cancelScenarioEdit");

    if (!teamSelect || !scenarioForm || !scenarioText) return;

    teamSelect.innerHTML = STUDENT_ACCOUNTS.map(team => `
        <option value="${escapeHTML(team.email)}">${escapeHTML(team.name)}</option>
    `).join("");

    scenarioForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const scenarios = getScenarios();
        const teamEmail = teamSelect.value;
        const text = scenarioText.value.trim();

        if (!text) return;

        if (!scenarios[teamEmail]) {
            scenarios[teamEmail] = [];
        }

        const now = new Date().toLocaleString();
        const scenarioId = editingId.value;

        if (scenarioId) {
            const existing = scenarios[teamEmail].find(
                scenario => String(scenario.id) === String(scenarioId)
            );

            if (existing) {
                existing.text = text;
                existing.updatedAt = now;
            }
        } else {
            scenarios[teamEmail].push({
                id: Date.now(),
                text: text,
                createdAt: now
            });
        }

        saveScenarios(scenarios);
        scenarioForm.reset();
        editingId.value = "";
        submitButton.textContent = "Post Scenario";
        if (cancelButton) {
            cancelButton.hidden = true;
        }
        renderTeamRecords();
        renderPreviousScenarios();
        showToast(scenarioId ? "Scenario updated." : "Scenario posted.");

    });

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            scenarioForm.reset();
            editingId.value = "";
            submitButton.textContent = "Post Scenario";
            cancelButton.hidden = true;
        });
    }

    document.addEventListener("click", function (event) {

        const editButton =
            event.target.closest("[data-edit-scenario]");

        const deleteButton =
            event.target.closest("[data-delete-scenario]");

        const previousDeleteButton =
            event.target.closest("[data-delete-previous-scenario]");

        if (editButton) {
            const teamEmail = editButton.dataset.teamEmail;
            const scenario = (getScenarios()[teamEmail] || []).find(
                item => String(item.id) === String(editButton.dataset.editScenario)
            );

            if (scenario) {
                teamSelect.value = teamEmail;
                scenarioText.value = scenario.text;
                editingId.value = scenario.id;
                submitButton.textContent = "Update Scenario";
                cancelButton.hidden = false;
                scenarioText.focus();
            }
        }

        if (deleteButton) {
            const teamEmail = deleteButton.dataset.teamEmail;
            const scenarios = getScenarios();

            scenarios[teamEmail] = (scenarios[teamEmail] || []).filter(
                item => String(item.id) !== String(deleteButton.dataset.deleteScenario)
            );

            saveScenarios(scenarios);
            renderTeamRecords();
            renderPreviousScenarios();
            showToast("Scenario deleted.");
        }

        if (previousDeleteButton) {
            const teamEmail =
                previousDeleteButton.dataset.teamEmail;

            const scenarios = getScenarios();

            scenarios[teamEmail] =
                (scenarios[teamEmail] || []).filter(
                    item => String(item.id) !== String(
                        previousDeleteButton.dataset.deletePreviousScenario
                    )
                );

            saveScenarios(scenarios);
            renderTeamRecords();
            renderPreviousScenarios();
            showToast("Scenario deleted.");
        }

    });


    /* SEARCH */
    const search =
        document.getElementById(
            "appointmentSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                renderAdmin(
                    search.value.trim()
                );

            }
        );

    }


    /* CLEAR ALL */
    const clearButton =
        document.getElementById(
            "clearAllAppointments"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const appointments =
                    getAppointments();


                if (
                    appointments.length === 0
                ) {

                    showToast(
                        "There are no appointments to clear."
                    );

                    return;

                }


                const confirmed =
                    confirm(
                        "Are you sure you want to delete ALL appointments?"
                    );


                if (!confirmed) return;


                localStorage.removeItem(
                    APPOINTMENTS_KEY
                );


                renderAdmin();


                showToast(
                    "All appointments have been deleted."
                );

            }
        );

    }

}


/* =========================================
   TEAM RECORDS ADMIN RENDER
========================================= */

function renderTeamRecords() {

    const container =
        document.getElementById(
            "teamRecords"
        );

    if (!container) return;

    const records =
        getStudentRecords();

    container.innerHTML = "";

    STUDENT_ACCOUNTS.forEach(team => {

        const teamRecords =
            records[team.email] || {};

        const card =
            document.createElement("article");

        card.className = "team-record-card";

        card.innerHTML = `
            <div class="team-record-heading">
                <div>
                    <span class="section-label">STUDENT ACCOUNT</span>
                    <h2>${escapeHTML(team.name)}</h2>
                    <p>${escapeHTML(team.email)}</p>
                </div>
            </div>
            ${renderRecordSection(
                "Patient Demographics",
                teamRecords.demographics
            )}
            ${renderRecordSection(
                "Medical History",
                teamRecords.medicalHistory
            )}
            ${renderRecordSection(
                "Documentation",
                teamRecords.documentation
            )}
            ${renderScenarioSection(
                team.email,
                getScenarios()[team.email]
            )}
        `;

        container.appendChild(card);

    });

}


function renderRecordSection(title, values) {

    const content = values && Object.keys(values).length
        ? Object.entries(values).map(([label, value]) => `
            <div class="record-output-row">
                <dt>${escapeHTML(label)}</dt>
                <dd>${escapeHTML(value || "-")}</dd>
            </div>
        `).join("")
        : `<p class="record-empty">No information submitted yet.</p>`;

    return `
        <section class="team-record-section">
            <h3>${title}</h3>
            ${values && Object.keys(values).length
                ? `<dl class="record-output-list">${content}</dl>`
                : content}
        </section>
    `;

}


/* =========================================
   LEGACY APPOINTMENT RENDER
========================================= */

function renderAdmin(
    searchTerm = ""
) {

    const appointments =
        getAppointments();


    const tbody =
        document.getElementById(
            "appointmentsTableBody"
        );


    const empty =
        document.getElementById(
            "emptyAppointments"
        );


    if (!tbody) return;


    /* -------------------------------------
       STATISTICS
    ------------------------------------- */

    const total =
        appointments.length;


    const pending =
        appointments.filter(
            a =>
                a.status === "Pending"
        ).length;


    const confirmed =
        appointments.filter(
            a =>
                a.status === "Confirmed"
        ).length;


    const today =
        getTodayAppointments(
            appointments
        );


    document.getElementById(
        "totalAppointments"
    ).textContent = total;


    document.getElementById(
        "pendingAppointments"
    ).textContent = pending;


    document.getElementById(
        "confirmedAppointments"
    ).textContent = confirmed;


    document.getElementById(
        "todayAppointments"
    ).textContent = today;


    /* -------------------------------------
       SEARCH
    ------------------------------------- */

    const filtered =
        appointments.filter(
            appointment => {

                if (!searchTerm) {
                    return true;
                }


                const searchable = [

                    appointment.fullName,

                    appointment.email,

                    appointment.phone,

                    appointment.department,

                    appointment.appointmentType,

                    appointment.reason,

                    appointment.status

                ]
                .join(" ")
                .toLowerCase();


                return searchable.includes(
                    searchTerm.toLowerCase()
                );

            }
        );


    tbody.innerHTML = "";


    /* -------------------------------------
       EMPTY
    ------------------------------------- */

    if (filtered.length === 0) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    /* -------------------------------------
       TABLE ROWS
    ------------------------------------- */

    filtered.forEach(
        appointment => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            appointment.fullName
                        )}
                    </strong>

                    <br>

                    <small>
                        DOB:
                        ${escapeHTML(
                            appointment.dob || "-"
                        )}
                    </small>
                </td>


                <td>

                    ${escapeHTML(
                        appointment.email
                    )}

                    <br>

                    ${escapeHTML(
                        appointment.phone
                    )}

                </td>


                <td>
                    ${formatDate(
                        appointment.appointmentDate
                    )}
                </td>


                <td>
                    ${formatTime(
                        appointment.appointmentTime
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        appointment.department
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        appointment.appointmentType
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        appointment.reason
                    )}
                </td>


                <td>

                    <select
                        class="status-select"
                        data-id="${appointment.id}">

                        <option
                            value="Pending"
                            ${
                                appointment.status ===
                                "Pending"
                                ? "selected"
                                : ""
                            }>

                            Pending

                        </option>


                        <option
                            value="Confirmed"
                            ${
                                appointment.status ===
                                "Confirmed"
                                ? "selected"
                                : ""
                            }>

                            Confirmed

                        </option>


                        <option
                            value="Completed"
                            ${
                                appointment.status ===
                                "Completed"
                                ? "selected"
                                : ""
                            }>

                            Completed

                        </option>


                        <option
                            value="Cancelled"
                            ${
                                appointment.status ===
                                "Cancelled"
                                ? "selected"
                                : ""
                            }>

                            Cancelled

                        </option>

                    </select>

                </td>


                <td>

                    <button
                        class="delete-btn"
                        data-delete-id="${appointment.id}">

                        Delete

                    </button>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    /* -------------------------------------
       STATUS EVENTS
    ------------------------------------- */

    document
        .querySelectorAll(
            ".status-select"
        )
        .forEach(
            select => {

                select.addEventListener(
                    "change",
                    function () {

                        const id =
                            Number(
                                this.dataset.id
                            );


                        updateAppointmentStatus(
                            id,
                            this.value
                        );

                    }
                );

            }
        );


    /* -------------------------------------
       DELETE EVENTS
    ------------------------------------- */

    document
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                this.dataset.deleteId
                            );


                        deleteAppointment(
                            id
                        );

                    }
                );

            }
        );

}


/* =========================================
   UPDATE STATUS
========================================= */

function updateAppointmentStatus(
    id,
    status
) {

    const appointments =
        getAppointments();


    const appointment =
        appointments.find(
            a =>
                Number(a.id) ===
                Number(id)
        );


    if (!appointment) return;


    appointment.status =
        status;


    saveAppointments(
        appointments
    );


    renderAdmin();


    showToast(
        "Appointment status updated."
    );

}


/* =========================================
   DELETE APPOINTMENT
========================================= */

function deleteAppointment(
    id
) {

    const confirmed =
        confirm(
            "Delete this appointment?"
        );


    if (!confirmed) return;


    let appointments =
        getAppointments();


    appointments =
        appointments.filter(
            a =>
                Number(a.id) !==
                Number(id)
        );


    saveAppointments(
        appointments
    );


    renderAdmin();


    showToast(
        "Appointment deleted."
    );

}


/* =========================================
   TODAY
========================================= */

function getTodayAppointments(
    appointments
) {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const date =
        `${year}-${month}-${day}`;


    return appointments.filter(
        appointment =>
            appointment.appointmentDate ===
            date
    ).length;

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(
    date
) {

    if (!date) return "-";


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return `${parts[1]}/${parts[2]}/${parts[0]}`;

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(
    time
) {

    if (!time) return "-";


    const parts =
        time.split(":");


    let hour =
        parseInt(
            parts[0],
            10
        );


    const minute =
        parts[1];


    const ampm =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${ampm}`;

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function getStudentRecords() {

    return JSON.parse(
        localStorage.getItem(STUDENT_RECORDS_KEY)
    ) || {};

}


function saveStudentRecords(records) {

    localStorage.setItem(
        STUDENT_RECORDS_KEY,
        JSON.stringify(records)
    );

}


function getScenarios() {

    return JSON.parse(
        localStorage.getItem(SCENARIOS_KEY)
    ) || {};

}


function saveScenarios(scenarios) {

    localStorage.setItem(
        SCENARIOS_KEY,
        JSON.stringify(scenarios)
    );

}


function renderTeamScenarios() {

    const container =
        document.getElementById("teamScenarios");

    const user =
        getCurrentUser();

    if (!container || !user) return;

    const scenarios =
        getScenarios()[user.email] || [];

    container.innerHTML = scenarios.length
        ? scenarios.map(scenario => `
            <article class="scenario-item">
                <p>${escapeHTML(scenario.text)}</p>
                <small>${escapeHTML(scenario.updatedAt || scenario.createdAt || "")}</small>
            </article>
        `).join("")
        : `<p class="record-empty">No scenarios posted yet.</p>`;

}


function renderScenarioSection(teamEmail, scenarios) {

    const content = scenarios && scenarios.length
        ? scenarios.map(scenario => `
            <article class="scenario-item admin-scenario-item">
                <p>${escapeHTML(scenario.text)}</p>
                <small>${escapeHTML(scenario.updatedAt || scenario.createdAt || "")}</small>
                <div class="scenario-actions">
                    <button class="btn btn-secondary" type="button" data-edit-scenario="${scenario.id}" data-team-email="${escapeHTML(teamEmail)}">Edit</button>
                    <button class="btn btn-danger" type="button" data-delete-scenario="${scenario.id}" data-team-email="${escapeHTML(teamEmail)}">Delete</button>
                </div>
            </article>
        `).join("")
        : `<p class="record-empty">No scenarios posted yet.</p>`;

    return `
        <section class="team-record-section">
            <h3>Scenarios</h3>
            <div class="scenario-list">${content}</div>
        </section>
    `;

}


function renderPreviousScenarios() {

    const container =
        document.getElementById("previousScenarios");

    if (!container) return;

    const scenarios = getScenarios();
    const previousScenarios = [];

    STUDENT_ACCOUNTS.forEach(team => {
        (scenarios[team.email] || []).forEach(scenario => {
            previousScenarios.push({
                ...scenario,
                teamEmail: team.email,
                teamName: team.name
            });
        });
    });

    previousScenarios.sort((first, second) =>
        Number(second.id) - Number(first.id)
    );

    container.innerHTML = previousScenarios.length
        ? previousScenarios.map(scenario => `
            <article class="scenario-item previous-scenario-item">
                <div class="previous-scenario-heading">
                    <strong>${escapeHTML(scenario.teamName)}</strong>
                    <small>${escapeHTML(scenario.updatedAt || scenario.createdAt || "")}</small>
                </div>
                <p>${escapeHTML(scenario.text)}</p>
                <button
                    class="btn btn-danger"
                    type="button"
                    data-delete-previous-scenario="${scenario.id}"
                    data-team-email="${escapeHTML(scenario.teamEmail)}">
                    Delete
                </button>
            </article>
        `).join("")
        : `<p class="record-empty">No scenarios have been posted yet.</p>`;

}