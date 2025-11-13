// lib/arcana22.js
// БАЗА 22 АРКАНІВ ДЛЯ MATRIX RYVOK (мінімальна)

export const ARCANA22 = [
  { id: 1, code: 1,  name: '1. Маг',          color: '#F4D35E' },
  { id: 2, code: 2,  name: '2. Жриця',       color: '#9D4EDD' },
  { id: 3, code: 3,  name: '3. Імператриця', color: '#FF9F1C' },
  { id: 4, code: 4,  name: '4. Імператор',   color: '#F77F00' },
  { id: 5, code: 5,  name: '5. Жрець',       color: '#669BBC' },
  { id: 6, code: 6,  name: '6. Закохані',    color: '#FFB5A7' },
  { id: 7, code: 7,  name: '7. Колісниця',   color: '#4CC9F0' },
  { id: 8, code: 8,  name: '8. Справедливість', color: '#80ED99' },
  { id: 9, code: 9,  name: '9. Відлюдник',   color: '#6C757D' },
  { id: 10, code: 10, name: '10. Колесо Фортуни', color: '#F15BB5' },
  { id: 11, code: 11, name: '11. Сила',      color: '#FF8500' },
  { id: 12, code: 12, name: '12. Повішений', color: '#6F2DBD' },
  { id: 13, code: 13, name: '13. Трансформація', color: '#C44536' }, // (Смерть)
  { id: 14, code: 14, name: '14. Помірність',    color: '#90BE6D' },
  { id: 15, code: 15, name: '15. Тінь',          color: '#3C1642' }, // (Диявол)
  { id: 16, code: 16, name: '16. Вежа',          color: '#E63946' },
  { id: 17, code: 17, name: '17. Зірка',         color: '#48CAE4' },
  { id: 18, code: 18, name: '18. Місяць',        color: '#5465FF' },
  { id: 19, code: 19, name: '19. Сонце',         color: '#FFD166' },
  { id: 20, code: 20, name: '20. Суд',           color: '#6A994E' },
  { id: 21, code: 21, name: '21. Світ',          color: '#52B788' },
  { id: 22, code: 22, name: '22. Духовний шлях', color: '#F72585' }, // твій авторський акцент
];

// Допоміжна функція: знайти аркан за числом
export function getArcana(num) {
  return ARCANA22.find(a => a.code === num) || null;
}
