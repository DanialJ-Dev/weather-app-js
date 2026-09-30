const modal = document.getElementById("modal");
const modalText = document.querySelector("p");

const contactModal = document.getElementById("contact-modal");
const modalBody = document.getElementById("modal-body");

const showErrorModal = (text) => {
  modalText.innerText = text;
  modal.style.display = "flex";
};

const removeModal = () => {
  modal.style.display = "none";
  contactModal.style.display = "none";
};

const showContactModal = () => {
  modalBody.innerHTML = `
      <h3><i class="fa-solid fa-envelope"></i> تماس با ما</h3>
      <p>👨‍💻 طراح و برنامه‌نویس: دانیال جدید<br>📧 ایمیل: jadid568@gmail.com<br>📞 تلفن: ۰۹۳۶۲۲۹۰۹۳۷<br> 🌐 وبسایت: <a href="https://danialj-dev.github.io/portfolio/" style="text-decoration: none">www.DanialJ-Dev.com</a></p>
    `;
  contactModal.style.display = "block";
};

const handleOutsideClick = (e) => {
  if (e.target === e.currentTarget) {
    removeModal();
  }
};

modal.addEventListener("click", handleOutsideClick);
contactModal.addEventListener("click", handleOutsideClick);

export { showErrorModal, showContactModal, removeModal };
