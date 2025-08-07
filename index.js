taille = 0;

window.onload = function() {
    // Call Async function
    load_data();
    
}
// chargement des taches avec fetch - Promesse
function load_data() {
    fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(data => {
        // this.total_data = data.lenght;
        taille = data.length;

        console.log(taille);
        //On vide le tableau
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td class="fw-bold">${item.task}</td>
                <td>${item.description}</td>
                <td>${item.category}</td>
                <td>${item.when}</td>
                <td>${item.priority}</td>
                <td>${item.fulfillment} %</td>
                <td><i class="bi bi-pencil-square text-primary" data-bs-toggle="modal" data-bs-target="#updatetask" onclick="update_data(${item.id})"></i>  <i class="bi bi-trash text-danger" onclick="deleteDate(${item.id})"></i></td>
            `;

            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erreur Lors de Chargement de la requeste API :', error));
}

// Fonction Ajouter une tache
function submitform() {
        var form = document.querySelector("#formElem");
        data = {
          id : (taille + 1).toString(),
          task : form.querySelector('input[name="titre"]').value,
          category : form.querySelector('input[name="categorie"]').value,
          when : form.querySelector('input[name="date"]').value,
          priority : form.querySelector('input[name="priority"]').value,
          fulfillment : form.querySelector('input[name="avancement"]').value,
          description : form.querySelector('textarea[name="descrip"]').value,
        }
        
        // console.log(data['id']);
        let response = fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
        })
        response = request.json();
}

// Suppression Taches
function deleteDate(id){
    // console.log(id);
    const response = fetch(`http://localHost:3000/tasks/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error!`);
    }
    console.log(`Tâche ${id} supprimée avec succès`);
    return true;
}

//MAJ Tache
function update_data(id){
    fetch(`http://localHost:3000/tasks/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data["task"])
        var formFields = [
            { label: "id", type: "text", id: "id", name: "id", placeholder: "id", value: data["id"] },
            { label: "Titre", type: "text", id: "titre", name: "titre", placeholder: "formation", value: data["task"] },
            { label: "Categorie", type: "text", id: "categorie", name: "categorie", placeholder: "formation", value: data["category"] },
            { label: "Echéance", type: "date", id: "date", name: "date", placeholder: "formation", value: data["when"] },
            { label: "Priorité", type: "text", id: "priority", name: "priority", placeholder: "formation", value: data["priority"] },
            { label: "Avancement", type: "number", id: "avancement", name: "avancement", placeholder: "formation", value: data["fulfillment"] },
            { label: "Description", type: "textarea", id: "descrip", name: "descrip", rows: 3, value: data["description"] }
        ];

    // On construit le formulaire de modification
    var form = document.createElement("form");
    form.method = "POST";
    form.name="formUpdate";
    form.id = "formUpdate";

    formFields.forEach(field => {
        const div = document.createElement("div");
        div.className = "mb-3";

        const label = document.createElement("label");
        label.className = "form-label";
        label.htmlFor = field.id;
        label.textContent = field.label;

        let input;
        if (field.type === "textarea") {
            input = document.createElement("textarea");
            input.className = "form-control";
            input.id = field.id;
            input.name = field.name;
            input.rows = field.rows || 3;
            input.value = field.value || "";
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.className = "form-control";
            input.id = field.id;
            input.name = field.name;
            input.placeholder = field.placeholder || "";
            input.value = field.value || "";
            // input
        }

        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });
    
    // Injection dans le div modal-body
    document.getElementById("modal-body").innerHTML="";
    document.getElementById("modal-body").appendChild(form);
    });
}

// Fonction submit pour Editer les modifications
function submitupdate() {
        // e.preventDefault();
        var form = document.querySelector("#formUpdate");
        data = {
          id : (form.querySelector('input[name="id"]').value).toString(), //(id).toString(),
          task : form.querySelector('input[name="titre"]').value,
          category : form.querySelector('input[name="categorie"]').value,
          when : form.querySelector('input[name="date"]').value,
          priority : form.querySelector('input[name="priority"]').value,
          fulfillment : form.querySelector('input[name="avancement"]').value,
          description : form.querySelector('textarea[name="descrip"]').value,
        }
        
        // console.log(data['id']);
        let id_ =data['id']
        let response = fetch(`http://localHost:3000/tasks/${id_}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
        })
        response = request.json();
}

// Fonction pour affichier uniquement les taches A faire
document.addEventListener('DOMContentLoaded', function () {
    // Ton code ici sera exécuté une fois que tout le DOM est prêt
    document.querySelector('#todo').addEventListener('click', function(){
        load_task_to_do();
    });
});
// document.getElementById('todo').addEventListener('click', load_task_to_do);

function load_task_to_do(){
    fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(data => {
        //On vide le tableau
        tbody.innerHTML = '';
        // alert("Test")
        data.forEach(item => {
            const row = document.createElement('tr');
           
            if(item.fulfillment != 100){
                row.innerHTML = `
                    <td class="fw-bold">${item.task}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.when}</td>
                    <td>${item.priority}</td>
                    <td>${item.fulfillment} %</td>
                    <td><i class="bi bi-pencil-square text-primary" data-bs-toggle="modal" data-bs-target="#updatetask" onclick="update_data(${item.id})"></i>  <i class="bi bi-trash text-danger" onclick="deleteDate(${item.id})"></i></td>
                `;
                tbody.appendChild(row);
            }
            // else{
            //     row.innerHTML =`<td colspan="7" style="text-align: center">Toutes les Tâches sont achevées </td>`;
            // }
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erreur Lors de Chargement de la requeste API :', error));
}

// Fonction pour affichier toutes les taches
document.addEventListener('DOMContentLoaded', function () {
    // Ton code ici sera exécuté une fois que tout le DOM est prêt
    document.querySelector('#all').addEventListener('click', function(){
        load_data();
    });
});

// Fonction pour affichier toutes les taches
document.addEventListener('DOMContentLoaded', function () {
    // Ton code ici sera exécuté une fois que tout le DOM est prêt
    document.querySelector('#completed').addEventListener('click', function(){
        load_task_completed();
    });
});

function load_task_completed(){
    fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(data => {
        //On vide le tableau
        tbody.innerHTML = '';
        // alert("Test")
        data.forEach(item => {
            const row = document.createElement('tr');
           
            if(item.fulfillment == 100){
                row.innerHTML = `
                    <td class="fw-bold">${item.task}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.when}</td>
                    <td>${item.priority}</td>
                    <td>${item.fulfillment} %</td>
                    <td><i class="bi bi-pencil-square text-primary" data-bs-toggle="modal" data-bs-target="#updatetask" onclick="update_data(${item.id})"></i>  <i class="bi bi-trash text-danger" onclick="deleteDate(${item.id})"></i></td>
                `;
                tbody.appendChild(row);
            }
            // else{
            //     row.innerHTML =`<td colspan="7" style="text-align: center">Toutes les Tâches sont achevées </td>`;
            // }
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erreur Lors de Chargement de la requeste API :', error));
}