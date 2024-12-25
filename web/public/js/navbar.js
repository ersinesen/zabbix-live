function updateNavbar() {
    //console.log("Navbar.js loaded");
    const userName = "zabbix";
    const userDepartment = "IT";

    const userNameDiv = document.getElementById('userNameDiv');
    if (userNameDiv && userName) {
        userNameDiv.textContent = userName;
    }

    const userDepartmentDiv = document.getElementById('userDepartmentDiv');
    if (userDepartmentDiv && userDepartment) {
        userDepartmentDiv.textContent = userDepartment;
    }
}
