function create() {
    const url = '/rest/players';
        let form = document.getElementById("createPlayer");

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const birthdayInput = document.getElementById("Birthday");
            const birthdayValue = birthdayInput.value;
            const birthdayDate = new Date(birthdayValue);
            const birthdayLong = birthdayDate.getTime();

            const player = {
                name: document.getElementById("Name").value,
                title: document.getElementById("Title").value,
                race: document.getElementById("Race").value,
                profession: document.getElementById("Profession").value,
                birthday: birthdayLong,
                banned: document.getElementById("Banned").value,
                level: document.getElementById("Level").value,
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            };

            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        return response.text();
                    }
                    return response.text();
                })
                .then(data => {
                    location.reload();
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
}