

function showPLayers(url) {
      fetch(url)
          .then(response => response.json())
          .then(data => {
              const table = document.getElementById('table');

              table.innerHTML = '<tr> <th>#</th> <th>Name</th> <th>Title</th> <th>Race</th> <th>Profession</th> <th>Level</th> <th>Birthday</th> <th>Banned</th> <th>Edit</th> <th>Delete</th> </tr>';

              data.forEach(player => {
                  const row = table.insertRow();
                  row.insertCell(0).textContent = player.id;
                  row.insertCell(1).textContent = player.name;
                  row.insertCell(2).textContent = player.title;
                  row.insertCell(3).textContent = player.race;
                  row.insertCell(4).textContent = player.profession;
                  row.insertCell(5).textContent = player.level;
                  row.insertCell(6).textContent = player.birthday;
                  row.insertCell(7).textContent = player.banned;

                  let editCell = row.insertCell(8);
                  let editImage = document.createElement('img');
                  editImage.src = '/img/edit.png';
                  editImage.alt = 'Edit';
                  editImage.addEventListener('mouseenter', () => {
                      editImage.style.cursor = 'pointer';
                  });

                  editCell.appendChild(editImage);

                  editImage.addEventListener('click', () => {
                      let check = checkPng(player.id);
                      if (check) {
                          editAccount(player.id);
                      } else {
                          saveAccount(player.id);
                      }
                  });

                  const deleteCell = row.insertCell(9);
                  const deleteImage = document.createElement('img');
                  deleteImage.src = '/img/delete.png';
                  deleteImage.alt = 'Delete';
                  deleteImage.addEventListener('mouseenter', () => {
                      deleteImage.style.cursor = 'pointer';
                  });

                  deleteCell.appendChild(deleteImage);

                  deleteImage.addEventListener('click', function () {
                      deletePlayer(player.id);
                      location.reload();
                  });
              });
          });
}


  function changeList() {
      showPLayers('/rest/players');
      pages(3);
      let select = document.getElementById('pageSizeSelect');

      select.addEventListener('change', async function () {
          let selectedValue = parseInt(select.value)
          let url = '/rest/players?pageNumber=0&pageSize=' + selectedValue;
          await showPLayers(url);
          pages(selectedValue);
      });
  }


  function pages(number) {
      const url = '/rest/players/count';
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Произошла ошибка при выполнении запроса');
              }
              return response.text();
          })
          .then(data => {
              let countPlayers = parseInt(data);
              let countPages = Math.ceil(countPlayers / number);

              let pages = document.getElementById('pagination');
              pages.innerHTML = 'Pages: ';

              for (let i = 0; i < countPages; i++) {
                  let button = document.createElement('button');
                  button.id = i;
                  button.textContent = i + 1;
                  button.setAttribute('class', 'myButton');

                  if(i === 0) {
                      button.classList.add('active-button');
                  }
                  button.addEventListener('click', function () {
                      removeRedCollor();
                      button.classList.add('active-button');

                      let select = document.getElementById('pageSizeSelect');
                      let selectedValue = parseInt(select.value);
                      let url = '/rest/players?pageNumber=' + i +'&pageSize=' + selectedValue;
                      showPLayers(url);
                  });
                  pages.appendChild(button);
              }
          })
          .catch(error => {
              console.error('Произошла ошибка:', error);
          });
  }

  function removeRedCollor() {
      let buttons = document.querySelectorAll('.myButton');

      buttons.forEach(button => {
          button.classList.remove('active-button');
      });

  }

  function deletePlayer(id) {
      let url = '/rest/players/' + id;

      fetch(url, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Произошла ошибка при выполнении DELETE-запроса');
              }
          });
  }

 function checkPng(id) {
    let result = false;
    const table = document.getElementById('table');
    const index = 8;
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let cell = cells[0];
        if (cell && cell.textContent && parseInt(cell.textContent) === id) {
            const imageCell = cells[8];
            const image = imageCell.querySelector('img');
            const imagePath = image.src;
            if (imagePath.includes('/img/edit.png')) {
                result = true;
            } else if (imagePath.includes('/img/save.png')) {
                result = false;
            }
        }
    });
    return result;
}

function editAccount(id) {
    const table = document.getElementById('table');
    const columnIndex = 0;

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let cell = cells[columnIndex];

        if (cell && cell.textContent && parseInt(cell.textContent) === id) {
            const dell = cells[9];
            const imageDelete = dell.querySelector('img');
            imageDelete.alt = '';
            imageDelete.src = '';

            const imageCell = cells[8];
            const image = imageCell.querySelector('img');

            if (image && image.src.includes('/img/edit.png')) {
                image.src = '/img/save.png';

                const nameCell = cells[1];
                const titleCell = cells[2];
                const raceCell = cells[3];
                const professionCell = cells[4];
                const bannedCell = cells[7];

                const nameValue = nameCell.textContent;
                const titleValue = titleCell.textContent;
                const raceValue = raceCell.textContent;
                const professionValue = professionCell.textContent;
                const bannedValue = bannedCell.textContent;

                nameCell.innerHTML = `<input type="text" class="name-field" value="${nameValue}">`;
                titleCell.innerHTML = `<input type="text" class="title-field" value="${titleValue}">`;
                raceCell.innerHTML = `
                    <select class="race-field">
                        <option value="HUMAN" ${raceValue === 'HUMAN' ? 'selected' : ''}>HUMAN</option>
                        <option value="DWARF" ${raceValue === 'DWARF' ? 'selected' : ''}>DWARF</option>
                        <option value="ELF" ${raceValue === 'ELF' ? 'selected' : ''}>ELF</option>
                        <option value="GIANT" ${raceValue === 'GIANT' ? 'selected' : ''}>GIANT</option>
                        <option value="ORC" ${raceValue === 'ORC' ? 'selected' : ''}>ORC</option>
                        <option value="TROLL" ${raceValue === 'TROLL' ? 'selected' : ''}>TROLL</option>
                        <option value="HOBBIT" ${raceValue === 'HOBBIT' ? 'selected' : ''}>HOBBIT</option>
                    </select>
                `;
                professionCell.innerHTML = `
                    <select class="profession-field">
                        <option value="WARRIOR" ${professionValue === 'WARRIOR' ? 'selected' : ''}>WARRIOR</option>
                        <option value="ROGUE" ${professionValue === 'ROGUE' ? 'selected' : ''}>ROGUE</option>
                        <option value="SORCERER" ${professionValue === 'SORCERER' ? 'selected' : ''}>SORCERER</option>
                        <option value="CLERIC" ${professionValue === 'CLERIC' ? 'selected' : ''}>CLERIC</option>
                        <option value="PALADIN" ${professionValue === 'PALADIN' ? 'selected' : ''}>PALADIN</option>
                        <option value="NAZGUL" ${professionValue === 'NAZGUL' ? 'selected' : ''}>NAZGUL</option>
                        <option value="WARLOCK" ${professionValue === 'WARLOCK' ? 'selected' : ''}>WARLOCK</option>
                        <option value="DRUID" ${professionValue === 'DRUID' ? 'selected' : ''}>DRUID</option>
                    </select>
                `;
                bannedCell.innerHTML = `
                    <select class="banned-field">
                        <option value="true" ${bannedValue === 'true' ? 'selected' : ''}>true</option>
                        <option value="false" ${bannedValue === 'false' ? 'selected' : ''}>false</option>
                    </select>
                `;
            }
        }
    });
}

function saveAccount(id) {
    const url = '/rest/players/' + id;
    const table = document.getElementById('table');
    const columnIndex = 0;

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let cell = cells[columnIndex];

        if (cell && cell.textContent && parseInt(cell.textContent) === id) {
            const imageCell = cells[8];
            const image = imageCell.querySelector('img');

            if (image && image.src.includes('/img/save.png')) {

                let nameField = row.querySelector('.name-field');
                let titleField = row.querySelector('.title-field');
                let raceField = row.querySelector('.race-field');
                let professionField = row.querySelector('.profession-field');
                let bannedField = row.querySelector('.banned-field');

                const player = {
                    id: id,
                    name: nameField.value,
                    title: titleField.value,
                    race: raceField.value,
                    profession: professionField.value,
                    banned: bannedField.value
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
                        image.src = '/img/edit.png';

                        const imageDelCell = cells[9];
                        const imageDel = imageDelCell.querySelector('img');
                        imageDel.alt = 'delete';
                        imageDel.src = '/img/delete.png';

                        return response.json();
                    })
                    .then(data => {
                        changeList();
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }
    });
}