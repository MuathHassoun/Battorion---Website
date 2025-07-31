document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const menuToggle = document.querySelector(".menu-toggle");
  document.getElementById("user-list").addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  document.addEventListener("click", (event) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      sidebar.classList.remove("open");
    }
  });
});
