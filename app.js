let allEmployees = [];
let currentpage = 0;
const limit = 5;
let filteredData = [];

document.addEventListener("DOMContentLoaded", () => {
    getEmployees();

    document.getElementById("search").addEventListener("click", () => {
        const query = document.getElementById("searchbox").value.toLowerCase();
        filteredData = searchEmployees(query);
        currentpage = 0;
        renderEmployees(filteredData);
        generatePaginationButtons(filteredData.length);
    });


async function getEmployees() {
    try {
        const response = await fetch("http://localhost:3000/employees");
        const data = await response.json();
        allEmployees = data;
        filteredData = data;
        renderEmployees(filteredData);
        generatePaginationButtons(filteredData.length);
    } catch (error) {
        console.error('Error fetching employee data', error);
    }
}

function renderEmployees(data) {
    const tablebody = document.getElementById("tablename");
    let rows = "";

    const start = currentpage * limit;
    const end = start + limit;
    const pageData = data.slice(start, end);

    pageData.forEach((employee, index) => {
        rows += `
            <tr>
                <td>${start + index + 1}</td>
                <td>${employee.salutation}. ${employee.firstName} ${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.gender}</td>
                <td>${new Date(employee.dob).toLocaleDateString()}</td>
                <td>${employee.country}</td>
                <td class="morebutton">
              <button class="more_button"><strong>...</strong><i class="fa-solid fa-ellipsis"></i></button>
                <div class="dropdown-menu">
                    <div class="dropdown-item">
                        <button class="action-btn" onclick="viewEmployee('${employee.id}')"><span><i class="fa-regular fa-eye"></i></span> View Details</button>
                        <button class="action-btn" onclick="editEmployeeDetails('${employee.id}')"  data-bs-toggle="modal" data-bs-target="#edit_page" href="#">
                        <span><i class="fa-solid fa-pen"></i></span> Edit</button>
                        <button class="action-btn" onclick="deleteEmployee('${ employee.id }')" data-bs-toggle="modal" data-bs-target="#delete_employee" >
                        <i class="fa fa-sharp fa-light fa-trash" id="buttonDropdown_action"></i>Delete</button>
                    </div>
                </div>
                </td>
            </tr>
        `;
    });

    tablebody.innerHTML = rows;
}

function generatePaginationButtons(totalItems) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / limit);
    pagination.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i + 1;

        button.classList.add('btn', 'btn-outline-primary');
        

        button.addEventListener('click',() => {
            currentpage = i;
            renderEmployees(allEmployees);
            generatePaginationButtons(allEmployees.length); // re-render to show active state
        })

        pagination.appendChild(button);
    }
}

function searchEmployees(query) {
    return allEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
    );
}

document.getElementById("addemployee-btn").addEventListener("click",() => {
     const overlay = document.getElementById("overlay");
     overlay.style.visibility="visible";
     overlay.style.opacity="1"
});
function formclose(){
    document.getElementById("overlay").style.visibility="hidden";
    document.getElementById("overlay").style.opacity=0

    document.getElementById("firstname").value="";
    document.getElementById("lastname").value="";
    document.getElementById("emailbox").value="";
    document.getElementById("number").value="";
    document.getElementById("dob").value="";
    document.getElementById("address").value="";
    document.getElementById("qualification").value="";
    document.getElementById("city").value="";
    document.getElementById("pin").value="";
    document.getElementById("country").value="";
    document.getElementById("state").value="";
    document.getElementById("salutation").value="Mr";
    document.getElementById("radio1").checked=false;
    document.getElementById("radio2").checked=false;
    
}
document.getElementById("cancelbtn").addEventListener("click",formclose);
document.getElementById("closebtn").addEventListener("click",formclose);

function formatData(input) {
    const [yyyy, mm, dd] = input.split("-");
    return `${dd}-${mm}-${yyyy}`;
}
document.getElementById("addemployeebtn").addEventListener("click",() => {

    const employeeData={
        salutation: document.getElementById("salutation").value,
        firstName: document.getElementById("firstname").value,
        lastName: document.getElementById("lastname").value,
        email: document.getElementById("emailbox").value,
        phone: document.getElementById("number").value,
        dob: formatData (document.getElementById("dob").value),
        gender: document.querySelector(`input[name="gender"]:checked`)?.value || "",
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
        pin: document.getElementById("pin").value,
        qualifications: document.getElementById("qualification").value,
        

        username:"user",
        password: "default123"
    };
    fetch("http://localhost:3000/employees",{
        method:"POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(employeeData)

    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        formclose();
        getEmployees();
    })
    function editEmployeeDetails(id){
         fetch(`http://localhost:3000/employees/${id}`,{
        method:"GET",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify()
    })
    .then(response => response.json())
    .then(employee =>{
        const editOverlay = document.getElementById("overlayEdit")
        editOverlay.style.display="flex"

        document.getElementById("edit-salutation").value = employee.salutation;
        document.getElementById("edit-firstname").value = employee.firstName;
        document.getElementById("edit-lastname").value = employee.lastName;
        document.getElementById("edit-email").value = employee.email;
        document.getElementById("edit-num").value = employee.phone;
        document.getElementById("edit-dob").value = formatData2(employee.dob);
        document.getElementById("edit-course").value = employee.qualifications;
        document.getElementById("edit-address").value = employee.address;
        document.getElementById("edit-country").value = employee.country;
        document.getElementById("edit-state").value = employee.state;
        document.getElementById("edit-city").value = employee.city;
        document.getElementById("edit-pin").value = employee.pin;

        if(employee.gender== "Male")document.getElementById("edit-radio1").checked =true;
        if(employee.gender== "Female")document.getElementById("edit-radio2").checked =true;

        document.getElementById("savebtn").setAttribute("data-id",id);
    })
    .catch(error => console.error("Error fetching employee:",error));
    
}
function formatData2(input) {
    const [dd, mm, yyyy] = input.split("-");
    return `${yyyy}-${mm}-${dd}`;
}
})
});