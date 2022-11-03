$(document).ready(function () {
    $('select').material_select();
});

document.querySelector('#regbutton').addEventListener("click", (e) => {
    e.preventDefault();
    toastr.remove()
    const dateStudent = {
        nume: document.querySelector('#nume').value,
        prenume: document.querySelector('#prenume').value,
        telefon: document.querySelector('#telefon').value,
        email: document.querySelector('#email').value,
        varsta: document.querySelector('#varsta').value,
    };
    axios
        .post('/participant', dateStudent)
        .then((response) => {
            toastr.success("Participant adaugat cu succes!");
        })
        .catch((error) => {
            const values = Object.values(error.response.data)
            console.log(error);
            values.map(item => {
                toastr.error(item)
            });
        });

}, false)