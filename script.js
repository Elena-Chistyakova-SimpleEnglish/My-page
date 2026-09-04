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

const certificateModal=document.querySelector('#certificateModal');
const certificateImage=document.querySelector('[data-certificate-image]');
const certificateTitle=document.querySelector('#certificateTitle');
function closeCertificate(){if(!certificateModal)return;certificateModal.classList.remove('open');certificateModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-certificate]').forEach(card=>card.addEventListener('click',()=>{certificateImage.src=card.dataset.certificate;certificateTitle.textContent=card.dataset.title;certificateModal.classList.add('open');certificateModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
document.querySelector('[data-close-certificate]')?.addEventListener('click',closeCertificate);
certificateModal?.addEventListener('click',event=>{if(event.target===certificateModal)closeCertificate();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCertificate();});
