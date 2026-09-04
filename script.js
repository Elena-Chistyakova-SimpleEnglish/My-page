const modal=document.querySelector('#giftModal');
const result=document.querySelector('[data-gift-result]');
const prize=document.querySelector('[data-prize]');
const prizes=['Скидка 10% на первый месяц','Бесплатный пробный урок','Полезный PDF-материал','Скидка 15% на летний курс','Скидка 50% на одно занятие'];
function closeModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelector('[data-open-gift]')?.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});
document.querySelector('[data-close-modal]')?.addEventListener('click',closeModal);
modal?.addEventListener('click',event=>{if(event.target===modal)closeModal();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
document.querySelector('[data-spin]')?.addEventListener('click',()=>{prize.textContent=prizes[Math.floor(Math.random()*prizes.length)];result.hidden=false;});
