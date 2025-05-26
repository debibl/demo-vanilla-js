const info = document.getElementById('info');

const createPartner = async (partner) => {
  const discount = await window.api.getDiscount(partner.id);
  return `
    <div class="container" data-id="${partner.id}">
      <div class="text">
        <p class="headline"> ${partner.type} | ${partner.name}</p>
        <p>${partner.ceo}</p>
        <p>+7 ${partner.phone}</p>
        <p>Рейтинг: ${partner.rating}</p>
      </div>
      <p class="discount">${discount}%</p>
    </div>
  `;
};

const loadPartners = async () => {
  const data = await window.api.getPartners();
  const partners = await Promise.all(
    data.map((partner) => createPartner(partner))
  );
  info.innerHTML = partners.join('');
  
  // Handle click on partner
  const cards = document.querySelectorAll('.container');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      window.location.href = `edit.html?id=${id}`;
    });
  });
};

loadPartners();
