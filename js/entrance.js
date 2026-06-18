// ═══════════════════════════════════════════════════
// entrance.js — 입장 뾰잉 애니메이션
// ═══════════════════════════════════════════════════

const EntranceAnimation = (() => {

  // 거품 파편을 화면 중앙에서 방사형으로 터뜨리기
  function spawnFoamParticles(centerX, centerY, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'foam-particle';

      // 랜덤 크기
      const size = 8 + Math.random() * 24;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // 랜덤 방향
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 60 + Math.random() * 140;
      const tx = centerX + Math.cos(angle) * distance;
      const ty = centerY + Math.sin(angle) * distance;

      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';

      // 파편 애니메이션을 CSS 대신 JS로 제어 (방향성 포함)
      particle.style.transition = `all ${0.4 + Math.random() * 0.3}s ease-out`;

      document.body.appendChild(particle);

      // 강제 리플로우 후 최종 위치로 이동
      particle.getBoundingClientRect();
      requestAnimationFrame(() => {
        particle.style.left = tx + 'px';
        particle.style.top = ty + 'px';
        particle.style.opacity = '0';
        particle.style.transform = `scale(${0.3 + Math.random() * 0.5})`;
      });

      // 파편 제거
      setTimeout(() => particle.remove(), 800);
    }
  }

  function play() {
    const mainMap = document.getElementById('main-map');
    if (!mainMap) return;

    // 1) 거품 파편 터뜨리기 (비활성화)
    // const cx = window.innerWidth / 2;
    // const cy = window.innerHeight / 2;
    // spawnFoamParticles(cx, cy, 16);

    // 2) 맵 요소들에 뾰잉 애니메이션 적용
    const nodes = mainMap.querySelectorAll('.map-node');
    nodes.forEach((node, i) => {
      node.style.opacity = '0';
      node.style.transform += ' scale(0)';
      setTimeout(() => {
        node.classList.add('entrance-animate');
        node.style.opacity = '';
        node.style.transform = '';
      }, 150 + i * 100);
    });

    // 덤불도 뾰잉
    const bushes = mainMap.querySelectorAll('.bush');
    bushes.forEach((bush, i) => {
      bush.style.opacity = '0';
      bush.style.transform = 'scale(0)';
      setTimeout(() => {
        bush.classList.add('entrance-animate');
        bush.style.opacity = '';
        bush.style.transform = '';
      }, 200 + i * 80);
    });

    // 모드 전환 버튼도 살짝 지연
    const switcher = document.querySelector('.mode-switcher');
    if (switcher) {
      switcher.style.opacity = '0';
      switcher.style.transform = 'translateY(-20px)';
      switcher.style.transition = 'opacity 0.4s ease 0.6s, transform 0.4s var(--spring) 0.6s';
      requestAnimationFrame(() => {
        switcher.style.opacity = '1';
        switcher.style.transform = 'translateY(0)';
      });
    }
  }

  // 페이지 로드 시 실행
  document.addEventListener('DOMContentLoaded', () => {
    // 약간의 딜레이를 주고 시작 (렌더링 안정화)
    setTimeout(play, 100);
  });

  return { play };
})();

// ── 공통 UI 인터랙션 (카루셀 & 라이트박스 모달) ──
window.moveCarousel = function(event, direction) {
  const container = event.currentTarget.closest('.insta-carousel');
  if (!container) return;
  const inner = container.querySelector('.carousel-inner');
  if (!inner) return;
  // 부드러운 스크롤 이동 (슬라이드 한 칸 너비만큼)
  const slideWidth = inner.clientWidth;
  inner.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
};

window.updateCarouselDots = function(event) {
  const inner = event.currentTarget;
  const container = inner.closest('.insta-carousel');
  const dotsContainer = container.querySelector('.carousel-indicators');
  if (!inner || !dotsContainer) return;
  
  const scrollLeft = inner.scrollLeft;
  const slideWidth = inner.clientWidth;
  if (slideWidth === 0) return;
  
  // 현재 보고 있는 인덱스 계산
  const currentIndex = Math.round(scrollLeft / slideWidth);
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
};

window.openLightbox = function(imgSrc) {
  const modal = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-img');
  if (modal && img) {
    img.src = imgSrc;
    modal.classList.add('active');
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('image-lightbox');
  if (modal) {
    modal.classList.remove('active');
    // 애니메이션 후 소스 비우기
    setTimeout(() => {
      const img = document.getElementById('lightbox-img');
      if (img) img.src = '';
    }, 300);
  }
};

window.switchStage3Page = function(event, targetIndex) {
  const container = event.currentTarget.closest('.card-item, .modal-body, .accordion-item');
  if (!container) return;

  // 모든 페이지 숨기기
  const pages = container.querySelectorAll('.stage3-page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // 타겟 페이지만 보이기
  const targetPage = container.querySelector('#s3_page_' + targetIndex);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // 페이지 전환 시 최상단으로 스크롤
    const scrollContainer = targetPage.closest('.card-body, .modal-body');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 모바일 아코디언인 경우 아코디언 헤더 위치로 스크롤 & 높이 갱신
      const accordionItem = targetPage.closest('.accordion-item');
      if (accordionItem) {
        accordionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const accordionContent = accordionItem.querySelector('.accordion-content');
        if (accordionContent) {
          // 렌더링 후 높이 갱신
          setTimeout(() => {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
          }, 50);
        }
      }
    }
  }
};
