const adressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const adressInput = document.querySelector("#address");
const regionInput = document.querySelector("#region");
const neighborhoodInput = document.querySelector("#neighborhood");
const cityInput = document.querySelector("#city");
const formInputs = document.querySelectorAll("[data-input]");
const closeButton = document.querySelector("#closeMessage");
const fadeElement = document.querySelector("#fade");

// Validar entrada do CEP
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  /* Converter para o real valor digitado pelo usuário */
  const key = String.fromCharCode(e.keyCode);

  // Permitir apenas números
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Get Address Event
cepInput.addEventListener("keyup", (e) => {
  // Pegando o valor todo digitado
  const inputValue = e.target.value;
  // Verificar se tem o tamanho correto
  if (inputValue.length === 8) {
    getAdress(inputValue);
  }
});

const getAdress = async (cep) => {
  toggleLoader();
  cepInput.blur(); // Usuário não poderá mandar requisições após
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(url);
  const data = await response.json();

  // Verificar se o CEP realmente existe

  if (data.erro === "true") {
    if (!adressInput.hasAttribute("disabled")) {
      toggleDisabled();
      }
      
    adressForm.reset();
    toggleLoader();
    toggleMessage("CEP inválido, tente novamente");
    return;
  }

  if (adressInput.value === "") {
    toggleDisabled();
  }

  adressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;
  toggleLoader();
};

// Adicionar ou remover atributos disabled
const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

// Mostrar ou ocultar o loader
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

// Mostrar ou ocultar mensagem
const toggleMessage = (msg) => {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  messageElementText.innerText = msg;
  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Fechar botão
closeButton.addEventListener("click", () => toggleMessage());

// Save Adress
adressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    toggleLoader();
    setTimeout(() => {
        toggleLoader();
        toggleMessage('Endereço salvo com sucesso!');
        adressForm.reset();
        toggleDisabled();
    }, 1500)
})
