// Увесь навчальний зміст матеріалу (РН1 — пояснює базові синтаксичні конструкції Python).

export type PredictQ = {
  id: string;
  tag: string;
  prompt: string;
  code: string;
  options: { text: string; right?: boolean; why: string }[];
  explain: string;
};

export const PREDICT: PredictQ[] = [
  {
    id: "q1",
    tag: "Типи даних",
    prompt: "Що виведе програма?",
    code: 'age = "17"\nprint(age + 1)',
    options: [
      { text: "18", why: 'Python не перетворює рядок "17" на число автоматично. Змінна age має тип str.' },
      { text: "171", why: 'Так було б, якби обидва операнди були рядками: "17" + "1". Але 1 — це int.' },
      {
        text: 'TypeError: can only concatenate str (not "int") to str',
        right: true,
        why: "",
      },
      { text: "17 1", why: "Оператор + не додає пробіл. Пробіл між значеннями ставить print, якщо передати їх через кому." },
    ],
    explain:
      'Змінна age зберігає рядок (str), а 1 — ціле число (int). Оператор + не поєднує ці типи. Виправлення: print(int(age) + 1) → 18.',
  },
  {
    id: "q2",
    tag: "if / elif / else",
    prompt: "Що виведе програма?",
    code: 'x = 7\nif x > 5:\n    print("A")\nelif x > 3:\n    print("B")\nelse:\n    print("C")',
    options: [
      { text: "A", right: true, why: "" },
      { text: "A та B", why: "Гілка elif перевіряється лише тоді, коли умова if хибна. Після виконання if решту гілок пропускають." },
      { text: "B", why: "Умова x > 5 істинна (7 > 5), тож до elif виконання не доходить." },
      { text: "C", why: "Гілка else спрацьовує лише тоді, коли всі попередні умови хибні." },
    ],
    explain:
      "Python перевіряє умови зверху вниз і виконує лише першу істинну гілку. 7 > 5 — істина, тому виводиться A.",
  },
  {
    id: "q3",
    tag: "Цикл for",
    prompt: "Яке число буде виведено?",
    code: "total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)",
    options: [
      { text: "6", right: true, why: "" },
      { text: "10", why: "range(1, 4) не включає праву межу 4: змінна i набуває значень 1, 2, 3." },
      { text: "3", why: "3 — це лише остання i. Змінна total накопичує суму: 0 + 1 + 2 + 3." },
      { text: "0", why: "Рядок total += i виконується на кожній ітерації, тому total змінюється." },
    ],
    explain: "range(1, 4) дає 1, 2, 3. Після трьох ітерацій total = 0 + 1 + 2 + 3 = 6. Відступ означає, що total += i належить до тіла циклу.",
  },
  {
    id: "q4",
    tag: "Арифметичні оператори",
    prompt: "Що виведе програма?",
    code: "print(10 // 3, 10 % 3, 10 / 4)",
    options: [
      { text: "3 1 2.5", right: true, why: "" },
      { text: "3.33 1 2.5", why: "Оператор // — цілочисельне ділення, він повертає 3, а не 3.33." },
      { text: "3 3 2", why: "Оператор % повертає залишок від ділення (10 = 3·3 + 1), тобто 1. А 10 / 4 = 2.5." },
      { text: "3 1 2", why: "Оператор / завжди повертає дробове число (float): 10 / 4 = 2.5." },
    ],
    explain:
      "// — ціла частина від ділення (3), % — залишок (1), / — звичайне ділення з дробовою частиною (2.5).",
  },
];

// ---------- Вправа 2: «Склади програму» ----------
export type Line = { id: string; text: string; indent: number };

export const ASSEMBLE = {
  task: "Програма запитує ціну товару та кількість, рахує суму. Якщо сума від 1000 грн (включно) — застосовує знижку 10 %. Зберіть програму з готових рядків: оберіть потрібні, розташуйте їх у правильному порядку та задайте відступи. Два рядки — зайві.",
  solution: [
    { id: "a", text: 'price = float(input("Ціна: "))', indent: 0 },
    { id: "b", text: 'quantity = int(input("Кількість: "))', indent: 0 },
    { id: "c", text: "total = price * quantity", indent: 0 },
    { id: "d", text: "if total >= 1000:", indent: 0 },
    { id: "e", text: "total = total * 0.9", indent: 1 },
    { id: "f", text: 'print("Знижка 10% застосована")', indent: 1 },
    { id: "g", text: "else:", indent: 0 },
    { id: "h", text: 'print("Знижки немає")', indent: 1 },
    { id: "i", text: 'print("До сплати:", total)', indent: 0 },
  ] as Line[],
  distractors: [
    {
      id: "x1",
      text: "if total => 1000:",
      indent: 0,
      why: "Зайвий рядок: оператора => в Python немає. «Більше або дорівнює» записують як >=.",
    },
    {
      id: "x2",
      text: "total = total - 10%",
      indent: 0,
      why: "Зайвий рядок: у Python % — це залишок від ділення, а не відсоток. Знижку 10 % можна отримати множенням на 0.9.",
    },
  ] as (Line & { why: string })[],
  swappable: ["a", "b"],
  sampleOutput: "Ціна: 500\nКількість: 3\nЗнижка 10% застосована\nДо сплати: 1350.0",
};

// ---------- Вправа 3: «Знайди помилку» ----------
export type BugQ = {
  id: string;
  lines: string[];
  bugLine: number; // 1-based
  traceback: string;
  causes: { text: string; right?: boolean; why: string }[];
  fixed: string[];
  explain: string;
};

export const BUGS: BugQ[] = [
  {
    id: "b1",
    lines: ['name = input("Ім\'я: ")', 'if name == "Олена"', '    print("Привіт, Олено!")', "else:", '    print("Привіт, незнайомцю!")'],
    bugLine: 2,
    traceback: 'File "main.py", line 2\n    if name == "Олена"\n                      ^\nSyntaxError: expected \':\'',
    causes: [
      { text: "Після умови if пропущено двокрапку", right: true, why: "" },
      { text: "Для порівняння слід писати один знак =", why: "Один знак = — це присвоєння. Порівняння записують подвійним ==, і тут це зроблено правильно." },
      { text: "Після if потрібне слово then", why: "У Python слова then немає: заголовок умови завершує двокрапка." },
      { text: "Рядок «Олена» потрібно писати без лапок", why: "Текстові значення (str) завжди записують у лапках." },
    ],
    fixed: ['name = input("Ім\'я: ")', 'if name == "Олена":', '    print("Привіт, Олено!")', "else:", '    print("Привіт, незнайомцю!")'],
    explain: "Заголовки if, elif, else, for, while, def завершує двокрапка — вона відкриває блок із відступом.",
  },
  {
    id: "b2",
    lines: ["score = 75", "if score = 75:", '    print("Залік")'],
    bugLine: 2,
    traceback:
      'File "main.py", line 2\n    if score = 75:\n       ^^^^^^^^^^\nSyntaxError: invalid syntax. Maybe you meant \'==\' or \':=\' instead of \'=\'?',
    causes: [
      { text: "У умові використано = (присвоєння) замість == (порівняння)", right: true, why: "" },
      { text: "Умову if потрібно брати в дужки", why: "У Python круглі дужки навколо умови необов'язкові." },
      { text: "Число 75 потрібно записати як рядок", why: "Порівнювати число з числом коректно — тип змінювати не треба." },
      { text: "Після блоку if обов'язково має бути else", why: "Гілка else необов'язкова." },
    ],
    fixed: ["score = 75", "if score == 75:", '    print("Залік")'],
    explain: "= записує значення у змінну, == порівнює два значення й повертає True або False.",
  },
  {
    id: "b3",
    lines: ["for i in range(3):", "print(i)"],
    bugLine: 2,
    traceback:
      'File "main.py", line 2\n    print(i)\n    ^\nIndentationError: expected an indented block after \'for\' statement on line 1',
    causes: [
      { text: "Тіло циклу не має відступу", right: true, why: "" },
      { text: "range(3) записано неправильно: потрібно range(1, 3)", why: "range(3) коректний і дає 0, 1, 2. Помилка не у вибірці значень." },
      { text: "Після for бракує двокрапки", why: "Двокрапка в рядку 1 є: for i in range(3):" },
      { text: "Функцію print не можна викликати всередині циклу", why: "Можна: у циклі викликають будь-які функції." },
    ],
    fixed: ["for i in range(3):", "    print(i)"],
    explain: "У Python відступ — частина синтаксису: він показує, які рядки належать до блоку. Стандарт PEP 8 — 4 пробіли.",
  },
];

// ---------- Вправа 4: розгалужений сценарій ----------
export type Choice = {
  label: string;
  code?: string;
  next: string;
  cost?: number; // скільки «довіри» втрачається
  ok?: boolean;
  tag?: string; // що це за конструкція
};

export type Node = {
  id: string;
  title: string;
  text: string;
  code?: string;
  terminal?: string; // вивід в консолі
  consequence?: { kind: "ok" | "bad" | "info"; text: string };
  choices: Choice[];
  returnTo?: string; // для відгалужень: після вибору повертаємось
};

export const SCENARIO_START = "start";
export const SCENARIO_TRUST = 3;

export const SCENARIO: Record<string, Node> = {
  start: {
    id: "start",
    title: "Тікет №214 від служби підтримки",
    text: "Ви — стажер у команді інтернет-магазину PyShop. Клієнтка оформила замовлення рівно на 1000 грн і не отримала знижку 10 %. Замовлення на 1500 грн і більше знижку отримують. Ось фрагмент коду. Що, найімовірніше, є причиною?",
    code: "total = 1000\nif total > 1000:\n    total = total * 0.9\nprint(total)",
    choices: [
      { label: "Оператор > не включає межу: при total = 1000 умова хибна", next: "fix", ok: true, tag: "Оператори порівняння" },
      { label: "Змінна total має тип str, тому порівняння працює неправильно", next: "detour_type", cost: 1, tag: "Типи даних" },
      { label: "Неправильний відступ після if, тому рядок зі знижкою не виконується", next: "detour_indent", cost: 1, tag: "Відступи" },
    ],
  },
  detour_type: {
    id: "detour_type",
    title: "Перевірка типу",
    text: "Ви додали print(type(total)) і запустили код.",
    terminal: "<class 'int'>\n1000",
    consequence: {
      kind: "bad",
      text: "20 хвилин витрачено даремно. Якби total був рядком, порівняння зі числом викликало б TypeError, а не тихо пропустило знижку. Тип тут коректний — проблема в самій умові.",
    },
    returnTo: "start",
    choices: [{ label: "Повернутися до аналізу коду", next: "start" }],
  },
  detour_indent: {
    id: "detour_indent",
    title: "Перевірка відступів",
    text: "Ви перевірили відступи: тіло if зсунуте на 4 пробіли, як і має бути.",
    consequence: {
      kind: "bad",
      text: "Неправильний відступ у Python зазвичай дає IndentationError одразу, а не тиху відсутність знижки. Код працює, але робить не те, що очікується — це логічна помилка.",
    },
    returnTo: "start",
    choices: [{ label: "Повернутися до аналізу коду", next: "start" }],
  },
  fix: {
    id: "fix",
    title: "Виправлення умови",
    text: "Правильно: при 1000 грн умова total > 1000 хибна, бо 1000 не більше за 1000. Як виправите умову, щоб знижка діяла від 1000 грн включно?",
    choices: [
      { label: "if total >= 1000:", next: "cart", ok: true, tag: "Оператор >=" },
      { label: "if total >= 999:", next: "fix_999", cost: 1, tag: "«Магічне число»" },
      { label: "if total == 1000:", next: "fix_eq", cost: 1, tag: "Оператор ==" },
    ],
  },
  fix_999: {
    id: "fix_999",
    title: "Тест умови >= 999",
    text: "Для суми 1000 знижка з'явилась. Тестувальник перевірив ще одну суму:",
    terminal: "total = 999.5\n>>> знижка застосована ✗ (має бути 999.5)",
    consequence: {
      kind: "bad",
      text: "Число 999 — це обхідний шлях, а не виправлення: він ламається для нецілих сум. Межа акції — 1000, тож і порівнювати слід з 1000.",
    },
    returnTo: "fix",
    choices: [{ label: "Повернутися до виправлення", next: "fix" }],
  },
  fix_eq: {
    id: "fix_eq",
    title: "Тест умови == 1000",
    text: "Для суми 1000 знижка з'явилась. Тестувальник перевірив більшу суму:",
    terminal: "total = 1500\n>>> знижка не застосована ✗ (має бути 1350.0)",
    consequence: {
      kind: "bad",
      text: "Оператор == перевіряє лише точний збіг. Клієнти із сумою 1500 грн тепер втратили знижку. Потрібна нерівність «від 1000 включно».",
    },
    returnTo: "fix",
    choices: [{ label: "Повернутися до виправлення", next: "fix" }],
  },
  cart: {
    id: "cart",
    title: "Наступне завдання: сума кошика",
    text: "Умову виправлено. Нове завдання: підрахувати суму товарів у кошику, список цін змінюється від замовлення до замовлення. Яку конструкцію оберете?",
    code: "prices = [250, 400, 350]\ntotal = 0\n# ... підрахунок суми ...",
    consequence: { kind: "ok", text: "Умова >= 1000 працює для 999, 1000, 1500 та дробових сум." },
    choices: [
      { label: "Цикл for: перебрати кожну ціну зі списку й додати до total", code: "for price in prices:\n    total += price", next: "review", ok: true, tag: "Цикл for" },
      { label: "Цикл while True без умови виходу: додавати ціни, поки не закінчаться", code: "while True:\n    total += prices[0]", next: "cart_inf", cost: 1, tag: "Цикл while" },
      { label: "Додати елементи вручну за індексами", code: "total = prices[0] + prices[1] + prices[2]", next: "review_debt", cost: 1, tag: "Індексація" },
    ],
  },
  cart_inf: {
    id: "cart_inf",
    title: "Запуск програми…",
    text: "Ви запустили код. Консоль заповнюється числами, а програма не зупиняється.",
    terminal: "250\n500\n750\n1000\n1250\n… (нескінченно)\n^C KeyboardInterrupt",
    consequence: {
      kind: "bad",
      text: "У циклі while True немає умови завершення, тому він не зупиниться, доки його не перервуть (Ctrl+C). Також prices[0] щоразу бере той самий елемент. Для перебору списку краще підходить for.",
    },
    returnTo: "cart",
    choices: [{ label: "Перервати програму й повернутися до вибору", next: "cart" }],
  },
  review_debt: {
    id: "review_debt",
    title: "Для цього кошика працює…",
    text: "Для трьох товарів сума правильна: 1000. Ви переходите до код-рев'ю, але колега помічає проблему.",
    terminal: "prices = [250, 400, 350, 100]\n>>> total = 1000   ✗ (має бути 1100)",
    consequence: {
      kind: "bad",
      text: "Запис за індексами «жорстко прив'язаний» до розміру списку: четвертий товар ігнорується. Цикл for працює для списку будь-якої довжини. Ви відкладаєте це на потім, але в код-рев'ю цей недолік буде згаданий.",
    },
    choices: [{ label: "Перейти до тестування", next: "review" }],
  },
  review: {
    id: "review",
    title: "Перед відправкою на код-рев'ю",
    text: "Умову виправлено, сума кошика рахується. Які значення total перевірите, щоб упевнитися, що знижка працює саме від 1000 грн?",
    code: "if total >= 1000:\n    total = total * 0.9",
    choices: [
      { label: "999, 1000 і 1001 — значення біля межі та по обидва боки від неї", next: "end", ok: true, tag: "Межові значення" },
      { label: "Лише 1000", next: "review_one", cost: 1, tag: "Тестування" },
      { label: "Лише 5000", next: "review_big", cost: 1, tag: "Тестування" },
    ],
  },
  review_one: {
    id: "review_one",
    title: "Результат перевірки",
    text: "Для 1000 усе працює — ви запустили тест і отримали знижку.",
    consequence: {
      kind: "bad",
      text: "Тест на 1000 не відрізняє >= від >: потрібні також 999 (без знижки) та 1001 (зі знижкою). Тестуйте обидві сторони межі.",
    },
    returnTo: "review",
    choices: [{ label: "Повернутися до вибору тестів", next: "review" }],
  },
  review_big: {
    id: "review_big",
    title: "Результат перевірки",
    text: "Для 5000 знижка є.",
    consequence: {
      kind: "bad",
      text: "Велика сума далека від межі, тож не виявляє помилки в операторі порівняння — стара умова total > 1000 теж її пройшла б. Помилки в умовах ховаються саме на межі: 999, 1000, 1001.",
    },
    returnTo: "review",
    choices: [{ label: "Повернутися до вибору тестів", next: "review" }],
  },
  end: { id: "end", title: "Код-рев'ю", text: "", choices: [] },
};
