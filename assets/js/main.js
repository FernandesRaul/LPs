document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // 1. TEMA CLARO / ESCURO
  // ============================================
  const toggleBtn = document.getElementById('theme-toggle');
  const iconSun = document.querySelector('.icon-sun');
  const iconMoon = document.querySelector('.icon-moon');
  const htmlEl = document.documentElement;

  // Função para atualizar os ícones
  function updateIcons(theme) {
    if (theme === 'light') {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    } else {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    }
  }

  // Função para definir o tema (salva e aplica)
  function setTheme(themeName) {
    htmlEl.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    updateIcons(themeName);
  }

  // Verifica preferência salva ou do sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersLight) {
    setTheme('light');
  } else {
    setTheme('dark'); // Padrão
  }

  // Evento de clique no botão
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }

  // ============================================
  // 2. CARROSSEL (COM VÍDEO INTELIGENTE)
  // ============================================
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;

  function showSlide(index) {
    // 1. PAUSA O VÍDEO ATUAL ANTES DE TROCAR
    const currentVideo = slides[currentSlide].querySelector('video');
    if (currentVideo) {
      currentVideo.pause(); 
      currentVideo.currentTime = 0; // Reinicia o vídeo
    }

    // Remove classe ativa visual do slide atual
    slides[currentSlide].classList.remove('is-active');
    
    // Lógica circular
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }
    
    // Mostra o novo slide
    const newSlide = slides[currentSlide];
    newSlide.classList.add('is-active');

    // 2. DÁ PLAY NO VÍDEO DO NOVO SLIDE
    const newVideo = newSlide.querySelector('video');
    if (newVideo) {
      setTimeout(() => {
        const playPromise = newVideo.play();
        
        // Tratamento de erro para navegadores que bloqueiam autoplay
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay bloqueado. Interação necessária.", error);
          });
        }
      }, 50);
    }
  }

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }

  // ============================================
  // 3. FORMULÁRIO DE CONTATO (ENVIO REAL P/ EMAIL)
  // ============================================
  const form = document.getElementById('lead-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Impede o recarregamento da página
      
      const nome = document.getElementById('lead-name').value;
      const contato = document.getElementById('lead-contact').value;
      const servico = document.getElementById('lead-service').value;
      const msg = document.getElementById('lead-msg').value;
      
      const btn = form.querySelector('button');
      const originalText = btn.innerText;
      
      // Feedback visual imediato
      btn.innerText = "Enviando...";
      btn.disabled = true;

      // URL do FormSubmit configurada para o seu e-mail
      const endpoint = "https://formsubmit.co/ajax/rauldefreitastech@gmail.com";

      fetch(endpoint, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: nome, // Nome do cliente
            email: contato, // Usamos o contato aqui para aparecer no cabeçalho do email
            message: `Serviço desejado: ${servico}\n\nDetalhes: ${msg}\n\nContato/WhatsApp: ${contato}`,
            _subject: `Novo Agendamento: ${nome} - ${servico}`, // Assunto do email
            _captcha: "false" // Desativa captcha para envio direto
        })
      })
      .then(response => response.json())
      .then(data => {
        // Sucesso
        alert(`Obrigado, ${nome}! Recebemos seu pedido. Verifique seu e-mail para confirmação.`);
        form.reset();
        btn.innerText = "Enviado com Sucesso!";
      })
      .catch(error => {
        // Erro
        alert("Houve um erro ao enviar. Por favor, tente novamente ou chame no WhatsApp.");
        console.error(error);
        btn.innerText = "Erro ao enviar";
      })
      .finally(() => {
        // Restaura o botão após 3 segundos
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
        }, 3000);
      });
    });
  }

  // ============================================
  // 4. DATA NO FOOTER
  // ============================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});