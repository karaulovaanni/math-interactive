'use strict';
(()=>{
 const settings={route:{answer:57,explanation:'30 + (30 − 3) = 30 + 27 = 57 км.'},bus:{answer:'total',explanation:'Второй отрезок — 10 − n минут. Общее время: 10 + (10 − n). По условию 0 ≤ n ≤ 10.'},perimeter:{answer:18,explanation:'P = 2 · (6 + 3) = 2 · 9 = 18 см.'}};
 document.querySelectorAll('.application-task').forEach(form=>{
  const key=form.dataset.application,config=settings[key],feedback=form.querySelector('.feedback');
  form.addEventListener('submit',event=>{
   event.preventDefault();let ok,empty;
   if(key==='bus'){const choice=form.querySelector('input:checked');empty=!choice;ok=choice?.value===config.answer;}
   else{const value=form.querySelector('input').value.trim().replace(',','.');empty=!value;ok=/^\d+(?:\.\d+)?$/.test(value)&&Number(value)===config.answer;}
   feedback.className='feedback show '+(ok?'good':'bad');
   feedback.textContent=ok?'Верно! '+config.explanation:empty?'Сначала '+(key==='bus'?'выбери выражение.':'введи ответ.'):'Пока неверно. '+(key==='bus'?'Нужно сложить время обоих отрезков.':'Проверь подстановку и порядок действий.');
   if(ok)award('application-'+key,4);
  });
  form.addEventListener('input',()=>{feedback.className='feedback';feedback.textContent='';});
 });
})();
