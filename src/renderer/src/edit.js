const form = document.getElementById('form-edit');
const inputs = Array.from(document.querySelectorAll('input'));
inputs.push(document.querySelector('select'));
const id = new URLSearchParams(window.location.search).get('id');

const loadPartnerInfo = async () => {
  const partner = await window.api.getPartnerById(id);
  const inputNames = inputs.map((input) => input.name);
  inputNames.forEach((name) => {
    document.getElementById(`${name}`).value = partner[name];
  });
};

loadPartnerInfo();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const partner = {
    ...Object.fromEntries(inputs.map(input => [input.name, data.get(input.name)])),
    id
  };

  await window.api.editPartner(partner);
});
