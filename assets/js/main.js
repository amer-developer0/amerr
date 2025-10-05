// =================================
// assets/js/main.js
// =================================



// =======================
// 1. عناصر DOM
// =======================

const languageSwitcher = document.getElementById('language-switcher');
const languageMenu = document.getElementById('language-menu');
const toast = document.getElementById('toast');
const yearSpan = document.getElementById('year');


const typingText = document.getElementById('typing-text');
// نموذج الاتصال
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
// const messageInput = document.getElementById('message');
const sendEmailBtn = document.getElementById('send-email');
const sendWhatsAppBtn = document.getElementById('send-whatsapp');

// الشبكات
const skillsGrid = document.getElementById('skills-grid');
const toolsGrid = document.getElementById('tools-grid');
const projectsGrid = document.getElementById('projects-grid');
const projectsEmpty = document.getElementById('projects-empty');
const servicesGrid = document.getElementById('services-grid');
// الأقسام والتنقل
const sections = document.querySelectorAll('.section, #home');
const navLinks = document.querySelectorAll('.nav-link');
// نص "من أنا" (فقرات متعددة)
const aboutText = document.getElementById('about-text');
const aboutText2 = document.getElementById('about-text-2');
const aboutText3 = document.getElementById('about-text-3');

// النماذج
const formProject = document.getElementById('form-project');
const formSkill = document.getElementById('form-skill');
const formTool = document.getElementById('form-tool');

// عنوان الصفحة وعنوان المشاريع
const projectsTitle = document.getElementById('projects-title');


// ✅ عناصر جديدة: نافذة الفيديو المنبثقة

const videoModalClose = document.getElementById('video-modal-close');






// =======================
// 4. تأثير الكتابة
// =======================
const roles = {
    en: ['Front-end Developer', 'Back-end Developer', 'Full-stack Developer'],
    ar: ['مطوّر واجهات أمامية', 'مطوّر واجهات خلفية', 'مطوّر متكامل']
  };
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  function typeRole() {
    const currentRole = roles[currentLang]?.[roleIndex];
    if (!currentRole) return;
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        typeRole();
      }, 1000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles[currentLang].length;
      setTimeout(typeRole, 1500);
    return;
    }
    const typingSpeed = 250;
    const erasingSpeed = 100;
    setTimeout(typeRole, isDeleting ? erasingSpeed : typingSpeed);
  }
  


// =======================
// 5. تأثيرات التمرير والتنقل النشط
// =======================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
        if (id === 'services') {
          orderServiceBtn.style.display = 'inline-flex';
        } else {
          orderServiceBtn.style.display = 'none';
        }
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(section => observer.observe(section));


  // =======================
  // تشغيل الفيديو
  // =========================
  
  
  // عناصر DOM
  const videoModal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('video-player');
  const closeModalBtn = document.getElementById('video-modal-close');

  // فتح النافذة وتشغيل الفيديو
  function openVideoModal(videoSrc) {
    if (!videoSrc || !videoModal || !videoPlayer) return;
    
    // تحميل الفيديو
    videoPlayer.src = videoSrc;
    videoPlayer.load();
    
    // إظهار النافذة
    videoModal.classList.add('show');
    
    // تشغيل تلقائي (اختياري)
    videoPlayer.play().catch(e => console.log("Autoplay prevented:", e));
  }

  // إغلاق النافذة
  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    
    videoModal.classList.remove('show');
    videoPlayer.pause();
    videoPlayer.src = ''; // يوقف التحميل ويفرغ الذاكرة
  }

  // أحداث الإغلاق
  closeModalBtn?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // إغلاق بالـ ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('show')) {
      closeVideoModal();
    }
  });

  // ربط أزرار الفيديو في المشاريع
  document.querySelectorAll('.draggable-video-btn').forEach(btn => {
    const videoSrc = btn.getAttribute('data-video');
    if (videoSrc) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openVideoModal(videoSrc);
      });
    }
  });


 






// =======================
// 15. نموذج الاتصال - البريد الإلكتروني وواتساب
// =======================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setLanguage(currentLang);
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
    const waNumber = '201280787721';
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
    sendWhatsAppBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const t = translations[currentLang];
      if (!name || !email || !message) {
        showToast(t['Error'], 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showToast(t['Error Invalid Email'], 'error');
        return;
      }
      let whatsappMessage = `Hello Amer Abdo,
  `;
      whatsappMessage += `My name is ${name}
  `;
      whatsappMessage += `Email: ${email}
  `;
      whatsappMessage += `Message: ${message}
  `;
      whatsappMessage += `Sent from your portfolio website.`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    });
    sendEmailBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const t = translations[currentLang];
      if (!name || !email || !message) {
        showToast(t['Error'], 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showToast(t['Error Invalid Email'], 'error');
        return;
      }
      const originalText = sendEmailBtn.textContent;
      sendEmailBtn.textContent = t['Sending...'];
      sendEmailBtn.disabled = true;
      try {
        const response = await fetch('https://formspree.io/f/xdkdjqzo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        if (response.ok) {
          showToast(t['Success Email'], 'success');
          contactForm.reset();
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        showToast(t['Error Network'], 'error');
      } finally {
        sendEmailBtn.textContent = originalText;
        sendEmailBtn.disabled = false;
      }
    });
  });






// =======================
// 17. الإشعارات وردود الفعل
// =======================
function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  


// =======================
// 21. Dark/Light Mode Toggle
// =======================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLink = document.createElement('link');
themeLink.rel = 'stylesheet';
themeLink.id = 'theme-stylesheet';

// تحديد الوضع الافتراضي (داكن)
let currentTheme = localStorage.getItem('theme') || 'dark';

// تحميل ملف CSS المناسب
function setTheme(theme) {
  if (theme === 'dark') {
    themeLink.href = 'assets/css/theme-dark.css';
    themeIcon.className = 'fas fa-sun'; // أيقونة الشمس في الوضع الداكن (للتبديل إلى فاتح)
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    themeLink.href = 'assets/css/theme-light.css';
    themeIcon.className = 'fas fa-moon'; // أيقونة القمر في الوضع الفاتح (للتبديل إلى داكن)
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }

  // تأكد من إضافة الـ link إذا لم يكن موجودًا
  if (!document.getElementById('theme-stylesheet')) {
    document.head.appendChild(themeLink);
  }
}

// تطبيق الوضع المحفوظ أو الافتراضي
setTheme(currentTheme);

// تبديل الوضع عند النقر
themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(currentTheme);
});

// دعم التنقل بالكيبورد (Enter/Space)
themeToggle?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    themeToggle.click();
  }
});








// ===========================
// منطق طلب الخدمه
// ===========================


  // عناصر DOM
  const orderBtn = document.getElementById('order-service-btn');
  const cancelBtn = document.getElementById('cancel-selection');
  const confirmBtn = document.getElementById('confirm-order');
  const servicesActions = document.getElementById('services-actions');
  const messageInput = document.getElementById('message');

  // 1. بدء وضع الاختيار
  orderBtn?.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.add('selectable');
      card.classList.remove('selected');
      // عند النقر على الكارت → اختيار/إلغاء
      card.addEventListener('click', toggleSelect);
    });
    servicesActions.style.display = 'block';
    orderBtn.style.display = 'none';
  });

  // 2. دالة لاختيار/إلغاء اختيار الكارت
  function toggleSelect() {
    this.classList.toggle('selected');
  }

  // 3. إلغاء الاختيار
  cancelBtn?.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.remove('selectable', 'selected');
      card.removeEventListener('click', toggleSelect);
    });
    servicesActions.style.display = 'none';
    orderBtn.style.display = 'inline-flex';
  }); 
   

  // 4. تأكيد الطلب
  confirmBtn?.addEventListener('click', () => {
    const selected = document.querySelectorAll('.service-card.selected');
    if (selected.length === 0) {
      alert('Please select at least one service.');
      return;
    }

    // جمع الرسائل من data-message (كلها إنجليزي)
    const messages = Array.from(selected).map(card => 
      card.getAttribute('data-message') || 'Service request'
    );

    // ملء حقل الرسالة برسائل مفصولة بسطر فارغ
    messageInput.value = messages.join('\n\n');

    // النزول لقسم الاتصال
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

    // إعادة الواجهة لوضعها الطبيعي
    cancelBtn.click();
  });

// إظهار/إخفاء زر "Order Service" حسب ظهور قسم الخدمات
const servicesSection = document.getElementById('services');
// const orderBtn = document.getElementById('order-service-btn');

if (servicesSection && orderBtn) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      orderBtn.style.display = entry.isIntersecting ? 'inline-flex' : 'none';
    });
  }, { threshold: 0.3 }); // يظهر لما 30% من القسم يظهر في الشاشة

  observer.observe(servicesSection);
}