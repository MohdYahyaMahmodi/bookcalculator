const minutesSelect = document.getElementById('minutes');
const wpmSelect = document.getElementById('wpm');
const durationSelect = document.getElementById('duration');
const resultSpan = document.getElementById('result');

function calculateBooks() {
  const minutes = parseInt(minutesSelect.value);
  const wpm = parseInt(wpmSelect.value);
  const duration = parseInt(durationSelect.value);

  const wordsPerDay = minutes * wpm;
  const totalWords = wordsPerDay * duration;
  const averageBookWords = 80000;
  const booksRead = Math.floor(totalWords / averageBookWords);

  resultSpan.textContent = booksRead;
}

minutesSelect.addEventListener('change', calculateBooks);
wpmSelect.addEventListener('change', calculateBooks);
durationSelect.addEventListener('change', calculateBooks);

calculateBooks();

// Carousel functionality
const carouselContainer = document.querySelector('.carousel-container');
const carouselWrapper = document.querySelector('.carousel-wrapper');
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

function touchStart(index) {
    return function(event) {
      event.preventDefault(); // Prevent default to avoid any unwanted behavior
      startPosition = getPositionX(event);
      isDragging = true;
      carouselWrapper.classList.add('grabbing');
      animationID = requestAnimationFrame(animation);
    };
  }
  
  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    carouselWrapper.classList.remove('grabbing');
    const snapPosition = Math.round(currentTranslate / 200) * 200;
    currentTranslate = snapPosition;
    setSliderPosition();
    prevTranslate = currentTranslate;
  }
  
  function touchMove(event) {
    if (isDragging) {
      event.preventDefault();
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPosition;
      const maxTranslate = 0;
      const minTranslate = -(carouselWrapper.scrollWidth - carouselContainer.clientWidth);
      if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate;
      } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
      }
      setSliderPosition();
    }
  }
  
  // Adjust getPositionX to handle both mouse and touch events correctly
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  // Ensure event listeners for mouse interactions are set up correctly
  carouselWrapper.addEventListener('mousedown', touchStart(0));
  document.addEventListener('mouseup', touchEnd); // Use document to handle cases where the mouse is released outside the carousel
  document.addEventListener('mousemove', touchMove); // Use document to handle smooth dragging even when the mouse leaves the carousel
  carouselWrapper.addEventListener('mouseleave', touchEnd);

function animation() {
  setSliderPosition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function setSliderPosition() {
  carouselWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -200;
  setSliderPosition();
}

function generateCarouselSlides() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.innerHTML = '';
  
    bookData.forEach(book => {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      slide.innerHTML = `
        <a href="${book.purchaseUrl}" target="_blank">
          <img src="${book.imageUrl}" alt="${book.title}">
        </a>
      `;
      carouselWrapper.appendChild(slide);
    });

    const carouselSlides = document.querySelectorAll('.carousel-slide');
    carouselSlides.forEach((slide, index) => {
      slide.addEventListener('touchstart', touchStart(index));
      slide.addEventListener('touchend', touchEnd);
      slide.addEventListener('touchmove', touchMove);
      slide.addEventListener('mousedown', touchStart(index));
      slide.addEventListener('mouseup', touchEnd);
      slide.addEventListener('mousemove', touchMove);
      slide.addEventListener('mouseleave', touchEnd);
    });
  }
  
  generateCarouselSlides();