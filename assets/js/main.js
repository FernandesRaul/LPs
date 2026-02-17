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
    // Procura se existe um vídeo no slide que está ativo agora
    const currentVideo = slides[currentSlide].querySelector('video');
    if (currentVideo) {
      currentVideo.pause(); 
      currentVideo.currentTime = 0; // Opcional: Reinicia o vídeo para a próxima vez
    }

    // Remove classe ativa visual do slide atual
    slides[currentSlide].classList.remove('is-active');
    
    // Lógica circular (calcula o índice do novo slide)
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }
    
    // Mostra o novo slide (adiciona classe CSS)
    const newSlide = slides[currentSlide];
    newSlide.classList.add('is-active');

    // 2. DÁ PLAY NO VÍDEO DO NOVO SLIDE
    const newVideo = newSlide.querySelector('video');
    if (newVideo) {
      // Pequeno delay para garantir que o elemento está visível antes de dar play
      setTimeout(() => {
        const playPromise = newVideo.play();
        
        // Tratamento de erro para navegadores que bloqueiam autoplay
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay bloqueado ou interrompido. Interação do usuário necessária.", error);
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
  // 3. FORMULÁRIO DE CONTATO
  // ============================================
  const form = document.getElementById('lead-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('lead-name').value;
      const btn = form.querySelector('button');
      const originalText = btn.innerText;
      
      btn.innerText = "Enviando...";
      btn.disabled = true;

      // Simula envio para servidor
      setTimeout(() => {
        alert(`Obrigado, ${nome}! Seu pedido foi enviado.`);
        form.reset();
        btn.innerText = "Enviado!";
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
        }, 3000);
      }, 1500);
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