# Подсказки к экзамену

## Если подключение к DB идет через отдельный файл:

```js
import connectDB from './db';

const withDatabaseConnection = async (callback) => {
  const client = await connectDB();

  try {
    const result = await callback(client)
    console.log(result[0])
    return result
  } catch (error) {
    console.error('Database error:', error)
    throw error
  } finally {
    await client.end()
  }
}
```

## Запрос к DB через алиасы и джоины (старая версия):

```sql
SELECT
	T1.ID,
	T1.NAME,
	T2.TYPE,
	T3.TYPE AS MATERIAL
FROM
	PRODUCTS T1,
	PRODUCT_TYPES T2,
	MATERIAL_TYPES T3
WHERE
	T1.TYPE = T2.ID
	AND T1.MATERIAL = T3.ID;
```

## Запрос к DB через связующие таблицы и джоины (новая версия):

```sql
SELECT
	T1.ID,
	T1.NAME,
	T2.TYPE,
	T3.TYPE AS MATERIAL,
	T4.NAME AS WORKSHOP
FROM
	PRODUCTS T1
	JOIN PRODUCT_TYPES T2 ON T1.TYPE = T2.ID
	JOIN MATERIAL_TYPES T3 ON T1.MATERIAL = T3.ID
	JOIN PRODUCT_WORKSHOPS T5 ON T1.ID = T5.NAME
	JOIN WORKSHOPS T4 ON T5.WORKSHOP = T4.ID;
```
## Пример JOIN-ов

Представьте две таблицы:

- students (студенты).
- courses (курсы, которые они посещают).

1. INNER JOIN → Только студенты, записанные на курсы.
2. LEFT JOIN → Все студенты, даже если не записаны на курс.
3. RIGHT JOIN → Все курсы, даже если на них никто не записан.
4. FULL JOIN → Все студенты + все курсы, даже без связей.
5. CROSS JOIN → Каждый студент сочетается с каждым курсом (например, для формирования расписания).

## Пример COALESCE

```sql
SELECT 
  T1.id,
  T1.name, 
  EXTRACT(YEAR FROM age(T1.date_of_birth)) AS age,
  COALESCE(T2.occupation, 'Безработный') AS occupation,
  COALESCE(T2.organization, '-') AS organization, 
  COALESCE(T2.salary, 0) AS salary
	FROM family_members AS T1
	LEFT JOIN family_members_job AS T2 ON T1.id = T2.member_id
```

## UPDATE с RETURNING

```sql
UPDATE partners  -- 1. Указываем таблицу для обновления
SET phone = '+79216600126'  -- 2. Задаём новые значения
WHERE id = 1  -- 3. Условие для выбора строк
RETURNING id, name, phone;  -- 4. Возвращаем результат
```

## INSERT из двух таблиц

```sql
INSERT INTO partners (org_type_id, name, address, phone, email)
VALUES (
    (SELECT id FROM organization_types WHERE type_name = 'ООО'),
    'Рога и копыта',
    'г. Томск, ул. Мира, 13',
    '+79216600123',
    'test@mail.ru'
);
```
## INSERT в две разные таблицы

```sql 
WITH inserted_member AS (
  INSERT INTO family_members (name, date_of_birth)
  VALUES ('Анна', '1995-08-24')
  RETURNING id
)
INSERT INTO family_members_job (member_id, occupation, salary)
SELECT id, 'Дизайнер', 90000
FROM inserted_member;
```