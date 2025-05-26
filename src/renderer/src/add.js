const form = document.getElementById('form-add');
const inputs = Array.from(document.querySelectorAll('input'));
inputs.push(document.querySelector('select'));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const partner = {
    ...Object.fromEntries(inputs.map(input => [input.name, data.get(input.name)])),
    id
  };

  await window.api.addPartner(partner);
  form.reset();
});
