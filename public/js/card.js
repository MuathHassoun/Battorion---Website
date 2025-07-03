document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const hasImg = card.querySelector('img');
    const hasText = card.querySelector('.text');

    if (hasImg) {
      card.classList.add('enter-left');
    } else if (hasText) {
      card.classList.add('enter-right');
    } else {
      card.classList.add('enter-right');
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => observer.observe(card));
});
