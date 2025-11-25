const listEl = document.getElementById('list');
const input = document.getElementById('newItem');
const imageInput = document.getElementById('imageInput');
const FILElabel = document.getElementById('FILElabel');
const noFileYetEl = document.getElementById('nofileyet');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const countEl = document.getElementById('count');
const downloadBtn = document.getElementById('downloadBtn');
const themeToggle = document.getElementById('themeToggle');

let items = [];
let darkMode = false;

// Dark Mode laden
if(localStorage.getItem('darkMode') === 'true'){
  darkMode = true;
  document.body.classList.add('dark-mode');
  themeToggle.innerText = '☀️';
}

// Dark Mode Toggle
themeToggle.addEventListener('click', ()=>{
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
  themeToggle.innerText = darkMode ? '☀️' : '🌙';
  localStorage.setItem('darkMode', darkMode);
});

imageInput.addEventListener('change', ()=>{

  const noFileYetEl = document.getElementById('nofileyet');

  if(imageInput.files.length > 0){
    noFileYetEl.innerText = imageInput.files[0].name;
  } else {
    noFileYetEl.innerText = 'No file chosen yet';
  }
});

function render(){
  listEl.innerHTML = '';
  items.forEach((it, idx)=>{
    const li = document.createElement('li');
    li.className = 'item';

    const left = document.createElement('div');
    left.className = 'left';

    if(it.image){
      const img = document.createElement('img');
      img.src = it.image;
      img.className = 'thumb';
      img.alt = 'Bild';
      left.appendChild(img);
    } else {
      const noImg = document.createElement('div');
      noImg.className = 'no-image';
      noImg.innerText = '';
      left.appendChild(noImg);
    }

    const text = document.createElement('input');
    text.type = 'text';
    text.value = it.text;
    text.setAttribute('aria-label','Edit entry');

    text.addEventListener('change', (e)=>{
      items[idx].text = e.target.value.trim();
      updateCount();
    });

    text.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') text.blur();
    });

    left.appendChild(text);

    const btns = document.createElement('div');
    btns.className = 'btns';

    const del = document.createElement('button');
    del.innerText = 'Delete';
    del.className = 'ghost';
    del.addEventListener('click', ()=>{
      items.splice(idx,1);
      render();
      updateCount();
    });

    btns.appendChild(del);

    li.appendChild(left);
    li.appendChild(btns);

    listEl.appendChild(li);
  });
}

function addItem(){
  const v = input.value.trim();
  if(!v) return;
  
  const file = imageInput.files[0];
  const noFileYetEl = document.getElementById('nofileyet');
  
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      items.push({
        text: v,
        image: e.target.result
      });
      input.value = '';
      imageInput.value = '';
      noFileYetEl.innerText = 'No file chosen yet';
      render();
      updateCount();
      input.focus();
    };
    reader.readAsDataURL(file);
  } else {
    items.push({
      text: v,
      image: null
    });
    input.value = '';
    render();
    updateCount();
    input.focus();
  }
}

addBtn.addEventListener('click', addItem);
input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') addItem(); });

clearBtn.addEventListener('click', ()=>{
  if(!items.length) return;
  if(confirm('Delete all entries?')){
    items = [];
    render();
    updateCount();
  }
});

downloadBtn.addEventListener('click', ()=>{
  if(!items.length){
    alert('No entries to download.');
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My List</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;background:#f5f5f5}
    body.dark-mode{background:#0f172a;color:#f1f5f9}
    body.dark-mode h1{color:#f1f5f9;border-bottom-color:#475569}
    body.dark-mode .item{background:#1e293b;box-shadow:0 2px 5px rgba(0,0,0,0.3)}
    body.dark-mode .item-text{color:#f1f5f9}
    body.dark-mode .footer{color:#94a3b8}
    h1{color:#333;border-bottom:3px solid #111827;padding-bottom:10px}
    .item{background:white;margin:15px 0;padding:15px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.1);display:flex;align-items:center;gap:15px}
    .item img{width:80px;height:80px;object-fit:cover;border-radius:8px}
    .item .no-image{width:80px;height:80px;background:#e5e7eb;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px}
    .item-text{flex:1;font-size:16px;color:#333}
    .footer{margin-top:30px;text-align:center;color:#666;font-size:14px}
  </style>
</head>
<body${darkMode ? ' class="dark-mode"' : ''}>
  <h1>My List</h1>
  ${items.map((item, i) => `
    <div class="item">
      ${item.image ? `<img src="${item.image}" alt="Bild ${i+1}">` : '<div class="no-image"></div>'}
      <div class="item-text">${item.text}</div>
    </div>
  `).join('')}
  <div class="footer">Created at ${new Date().toLocaleDateString('de-DE')}</div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-list-${new Date().toISOString().slice(0,10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
function updateCount(){
  countEl.innerText = items.length + (items.length===1 ? ' entry' : ' Entries');
}

render();
updateCount();