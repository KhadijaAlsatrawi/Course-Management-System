//catch
const inputEL = document.querySelector('#search')
const tableEL = document.querySelector('#display-table')

//functions
function filterCourses(){
  const filter = inputEL.value.toUpperCase();
  const rowEL = document.querySelectorAll('.table-row')

    for (let i = 0; i < rowEL.length; i++) {
    const td = rowEL[i].getElementsByTagName("td")[0];
    if (td) {
      const txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        rowEL[i].style.display = "";
      } else {
        rowEL[i].style.display = "none";
      }
    }
  }
}

//event listners
inputEL.addEventListener('keyup', filterCourses)