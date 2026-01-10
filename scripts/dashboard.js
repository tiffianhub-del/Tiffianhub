
// Mock data matching the screenshot vibe
const listings = [
  { id:1, title:'South Indian Thali', price:120, unit:'per meal', status:'active',
    details:'Rice, Sambar, Rasam, 2 Vegetables, Curd, Papad, Pickle',
    days:['Mon','Tue','Wed','Thu','Fri'], method:'Home Delivery' },
  { id:2, title:'North Indian Lunch Box', price:150, unit:'per meal', status:'active',
    details:'2 Rotis, Dal, Rice, Paneer Curry, Salad, Pickle, Sweet',
    days:['Mon','Wed','Fri'], method:'Home Delivery' },
  { id:3, title:'Gujarati Thali', price:130, unit:'per meal', status:'inactive',
    details:'3 Rotis, Dal, Kadhi, Rice, 2 Vegetables, Papad, Buttermilk',
    days:['Tue','Thu','Sat'], method:'Pickup Only' },
  { id:4, title:'Healthy Breakfast Box', price:100, unit:'per meal', status:'active',
    details:'Oats Porridge, 2 Boiled Eggs, Fresh Fruits, Multigrain Toast',
    days:['Mon','Tue','Wed','Thu','Fri'], method:'Home Delivery' },
  { id:5, title:'Bengali Special', price:180, unit:'per meal', status:'active',
    details:'Rice, Dal, Fish Curry, Mixed Vegetable, Chutney, Sweet',
    days:['Sat','Sun'], method:'Both' },
  { id:6, title:'Diet Meal Box', price:200, unit:'per meal', status:'inactive',
    details:'Quinoa, Grilled Chicken, Steamed Vegetables, Soup, Fruit Salad',
    days:['Mon','Wed','Fri'], method:'Home Delivery' },
];

const cardsWrap = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

function mk(el, cls, text){
  const e = document.createElement(el);
  if(cls) e.className = cls;
  if(text) e.textContent = text;
  return e;
}

function render(){
  const q = (searchInput.value || '').toLowerCase();
  const st = statusFilter.value;
  const filtered = listings.filter(x =>
    (st === 'all' || x.status === st) &&
    (x.title.toLowerCase().includes(q) || x.details.toLowerCase().includes(q))
  );

  cardsWrap.innerHTML = '';
  filtered.forEach(x => {
    const card = mk('article','card-listing');

    const head = mk('div','card-header');
    const left = mk('div');
    left.appendChild(mk('div','card-title',x.title));
    const price = mk('div','card-price',`CAD $${x.price} `);
    const per = mk('span','meta',` ${x.unit}`);
    price.appendChild(per);
    left.appendChild(price);
    head.appendChild(left);

    const badge = mk('span', x.status==='active' ? 'badge badge-success' : 'badge badge-muted', x.status==='active'?'Active':'Inactive');
    head.appendChild(badge);
    card.appendChild(head);

    const metaTitle = mk('div','small', 'Menu Details');
    metaTitle.style.marginTop = '12px';
    card.appendChild(metaTitle);

    const details = mk('div','meta', x.details);
    card.appendChild(details);

    const row = mk('div','meta-row');

    const days = mk('div');
    days.appendChild(mk('div','small','Days Available'));
    const daysWrap = mk('div','row');
    x.days.forEach(d => daysWrap.appendChild(mk('span','meta-tag',d)));
    days.appendChild(daysWrap);

    const method = mk('div');
    method.appendChild(mk('div','small','Delivery Method'));
    const methodChip = mk('span','meta-tag', x.method);
    method.appendChild(methodChip);

    row.appendChild(days);
    row.appendChild(method);
    card.appendChild(row);

    const actions = mk('div','card-actions');
    const leftA = mk('div','row');
    const edit = mk('button','icon-btn','✏'); edit.title='Edit';
    const del = mk('button','icon-btn','🗑'); del.title='Delete';
    leftA.appendChild(edit); leftA.appendChild(del);
    actions.appendChild(leftA);

    const toggleWrap = document.createElement('label');
toggleWrap.className = 'switch';

const toggleInput = document.createElement('input');
toggleInput.type = 'checkbox';
toggleInput.checked = (x.status === 'active');
toggleInput.className = 'status-toggle';

const slider = document.createElement('span');
slider.className = 'slider';

toggleWrap.appendChild(toggleInput);
toggleWrap.appendChild(slider);

const statusLabel = mk('span','status-label', x.status === 'active' ? 'Active' : 'Inactive');

toggleInput.addEventListener('change', () => {
  x.status = toggleInput.checked ? 'active' : 'inactive';
  statusLabel.textContent = toggleInput.checked ? 'Active' : 'Inactive';
  render();
});

const right = mk('div','row');
right.appendChild(toggleWrap);
right.appendChild(statusLabel);

actions.appendChild(right);

    card.appendChild(actions);

    cardsWrap.appendChild(card);
  });
}

searchInput.addEventListener('input', render);
statusFilter.addEventListener('change', render);
render();
